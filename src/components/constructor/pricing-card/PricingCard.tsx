"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./PricingCard.module.scss";
import ButtonUI from "@/components/ui/button/ButtonUI";
import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";
import Input from "@mui/joy/Input";
import { useCurrency } from "@/context/CurrencyContext";

const TOKENS_PER_GBP = 100;
const MIN_GBP = 10;

interface PricingCardProps {
    variant?: "starter" | "pro" | "premium" | "custom";
    title: string;
    price: string;
    tokens: number;
    description: string;
    features: string[];
    buttonText: string;
    badgeTop?: string;
    badgeBottom?: string;
    index?: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
                                                     variant = "starter",
                                                     title,
                                                     price,
                                                     tokens,
                                                     description,
                                                     features,
                                                     buttonText,
                                                     badgeTop,
                                                     badgeBottom,
                                                     index = 0,
                                                 }) => {
    const { showAlert } = useAlert();
    const user = useUser();
    const { currency, sign, convertFromGBP, convertToGBP } = useCurrency();

    const [customAmountInput, setCustomAmountInput] = useState<string>(String(MIN_GBP));
    const isCustom = price === "dynamic";

    const minAmountInCurrency = useMemo(
        () => Number(convertFromGBP(MIN_GBP).toFixed(2)),
        [convertFromGBP]
    );

    useEffect(() => {
        if (!isCustom) return;
        setCustomAmountInput(String(minAmountInCurrency));
    }, [isCustom, minAmountInCurrency]);

    const parsedCustomAmount = useMemo(() => {
        const n = Number(customAmountInput.replace(/,/g, "."));
        return Number.isFinite(n) ? n : NaN;
    }, [customAmountInput]);

    const clampedCustomAmount = useMemo(() => {
        if (!Number.isFinite(parsedCustomAmount)) return minAmountInCurrency;
        return Math.max(minAmountInCurrency, parsedCustomAmount);
    }, [parsedCustomAmount, minAmountInCurrency]);

    // 💷 Базова ціна у GBP
    const basePriceGBP = useMemo(() => {
        if (isCustom) return 0;
        const num = parseFloat(price.replace(/[^0-9.]/g, ""));
        return isNaN(num) ? 0 : num;
    }, [price, isCustom]);

    // 💰 Конвертація у поточну валюту
    const convertedPrice = useMemo(() => {
        if (isCustom) return 0;
        return convertFromGBP(basePriceGBP);
    }, [basePriceGBP, convertFromGBP, isCustom]);

    const handleBuy = async () => {
        if (!user) {
            showAlert("Please sign up", "You need to be signed in to purchase", "info");
            setTimeout(() => (window.location.href = "/sign-up"), 1200);
            return;
        }

        try {
            const endpoint = "/api/spoynt/create-invoice";

            let body: any;

            if (isCustom) {
                if (!Number.isFinite(parsedCustomAmount)) {
                    showAlert(
                        `Minimum is ${MIN_GBP} GBP`,
                        `Enter at least ${minAmountInCurrency.toFixed(2)} ${currency}`,
                        "warning"
                    );
                    return;
                }

                if (clampedCustomAmount < minAmountInCurrency) {
                    showAlert(
                        `Minimum is ${MIN_GBP} GBP`,
                        `Enter at least ${minAmountInCurrency.toFixed(2)} ${currency}`,
                        "warning"
                    );
                    return;
                }

                body = { currency, amount: Number(clampedCustomAmount.toFixed(2)) };
            } else {
                if (convertToGBP(convertedPrice) < MIN_GBP) {
                    showAlert("Minimum is 10 GBP", "Select a plan with at least 10 GBP", "warning");
                    return;
                }
                // ✅ Reference behavior: presets send tokens
                body = { tokens };
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });

            const text = await res.text();
            if (!res.ok) throw new Error(text);

            const data = JSON.parse(text);

            const purchaseIntent = {
                tokens: isCustom
                    ? Math.floor(convertToGBP(clampedCustomAmount) * TOKENS_PER_GBP)
                    : tokens,
                createdAt: Date.now(),
            };

            localStorage.setItem("pendingPurchase", JSON.stringify(purchaseIntent));

            window.location.href = data.redirectUrl;
        } catch (err: any) {
            showAlert("Error", err.message || "Something went wrong", "error");
        }
    };

    // 🔢 Розрахунок токенів для dynamic input
    const tokensCalculated = useMemo(() => {
        const gbpEquivalent = convertToGBP(clampedCustomAmount);
        return Math.floor(gbpEquivalent * TOKENS_PER_GBP);
    }, [clampedCustomAmount, convertToGBP]);

    return (
        <motion.div
            className={`${styles.card} ${styles[variant]}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
        >
            {badgeTop && <span className={styles.badgeTop}>{badgeTop}</span>}
            <h3 className={styles.title}>{title}</h3>

            {isCustom ? (
                <>
                    <div className={styles.inputWrapper}>
                        <Input
                            type="number"
                            value={customAmountInput}
                            onChange={(e) => setCustomAmountInput(e.target.value)}
                            onBlur={() => setCustomAmountInput(clampedCustomAmount.toFixed(2))}
                            placeholder="Enter amount"
                            size="md"
                            startDecorator={sign}
                            slotProps={{
                                input: {
                                    min: minAmountInCurrency,
                                    step: 0.01,
                                },
                            }}
                        />
                    </div>
                    <p className={styles.dynamicPrice}>
                        {sign}
                        {Number.isFinite(parsedCustomAmount) ? clampedCustomAmount.toFixed(2) : "--"} {currency}
                        ~ {tokensCalculated} tokens
                    </p>
                </>
            ) : (
                <p className={styles.price}>
                    {sign}
                    {convertedPrice.toFixed(2)}{" "}
                    <span className={styles.tokens}>/ {tokens} tokens</span>
                </p>
            )}

            <p className={styles.description}>{description}</p>
            <ul className={styles.features}>
                {features.map((f, i) => (
                    <li key={i}>{f}</li>
                ))}
            </ul>

            <ButtonUI fullWidth onClick={handleBuy} hoverColor="tertiary" hoverTextColor="quaternary">
                {user ? buttonText : "Sign Up to Buy"}
            </ButtonUI>

            {badgeBottom && <span className={styles.badgeBottom}>{badgeBottom}</span>}
        </motion.div>
    );
};

export default PricingCard;

