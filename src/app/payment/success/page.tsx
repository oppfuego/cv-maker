"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./PaymentSuccess.module.scss";

export default function PaymentSuccessPage() {
    const sp = useSearchParams();

    const [state, setState] = useState<"loading" | "ok" | "pending" | "error">("loading");
    const [msg, setMsg] = useState<string>("");
    const [creditedTokens, setCreditedTokens] = useState<number | null>(null);
    const [pendingPurchase, setPendingPurchase] = useState<{
        tokens: number;
        createdAt: number;
    } | null>(null);
    const [cpiValue, setCpiValue] = useState<string>("");
    const [isForced, setIsForced] = useState<boolean>(false);
    const hasCheckedRef = useRef(false);

    const badgeClass =
        state === "ok"
            ? styles.badgeOk
            : state === "pending"
                ? styles.badgePending
                : state === "error"
                    ? styles.badgeError
                    : styles.badgeLoading;

    useEffect(() => {
        const queryCpi = sp.get("cpi") || sp.get("invoice") || "";
        let storedCpi = "";
        let storedForced = false;

        try {
            storedCpi = localStorage.getItem("spoyntLastCpi") || "";
            storedForced = localStorage.getItem("spoyntForced") === "true";
        } catch {
            storedCpi = "";
            storedForced = false;
        }

        setCpiValue(queryCpi || storedCpi);
        setIsForced(storedForced);

        try {
            const raw = localStorage.getItem("pendingPurchase");
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (!parsed || !Number.isFinite(parsed.tokens)) return;
            setPendingPurchase({
                tokens: Number(parsed.tokens),
                createdAt: Number(parsed.createdAt) || Date.now(),
            });
        } catch {
            setPendingPurchase(null);
        }
    }, [sp]);

    useEffect(() => {
        if (!cpiValue) {
            if (isForced && pendingPurchase?.tokens) {
                const creditSandboxTokens = async () => {
                    try {
                        setState("loading");
                        setMsg("Crediting your tokens...");

                        const runBuyTokens = async () =>
                            fetch("/api/user/buy-tokens", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({ amount: pendingPurchase.tokens }),
                            });

                        let res = await runBuyTokens();
                        let data = await res.json().catch(() => ({}));

                        if (!res.ok) {
                            const isAuthError =
                                res.status === 401 ||
                                /Missing auth|Invalid or expired token/i.test(String(data?.message || ""));

                            if (isAuthError) {
                                const refreshRes = await fetch("/api/auth/refresh", {
                                    method: "POST",
                                    credentials: "include",
                                });
                                if (refreshRes.ok) {
                                    res = await runBuyTokens();
                                    data = await res.json().catch(() => ({}));
                                }
                            }
                        }

                        if (!res.ok) throw new Error(data?.message || "Failed to credit tokens");

                        if (cancelled) return;
                        setState("ok");
                        setCreditedTokens(pendingPurchase.tokens);
                        setMsg("Payment confirmed. Tokens credited.");
                        localStorage.removeItem("pendingPurchase");
                        return;
                    } catch (err: any) {
                        if (cancelled) return;
                        setState("error");
                        setMsg(err?.message || "Something went wrong.");
                    }
                };

                creditSandboxTokens();
                return;
            }

            setState("error");
            setMsg("Missing payment reference.");
            return;
        }

        if (hasCheckedRef.current) return;
        hasCheckedRef.current = true;

        let cancelled = false;

        const confirmPayment = async () => {
            try {
                setState("loading");
                setMsg("Confirming payment...");

                const res = await fetch(`/api/spoynt/confirm?cpi=${encodeURIComponent(cpiValue)}`,
                    { credentials: "include" });

                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.message || "Confirmation failed");

                if (cancelled) return;

                if (data?.status === "credited") {
                    setState("ok");
                    setCreditedTokens(Number(data?.tokens) || null);
                    setMsg("Payment confirmed. Tokens credited.");
                    localStorage.removeItem("pendingPurchase");
                    return;
                }

                if (data?.status === "pending") {
                    setState("pending");
                    setMsg("Payment is still pending. Please wait a moment and refresh.");
                    return;
                }

                setState("error");
                setMsg(data?.message || "Payment not confirmed.");
            } catch (err: any) {
                if (cancelled) return;
                setState("error");
                setMsg(err?.message || "Something went wrong.");
            }
        };

        confirmPayment();

        return () => {
            cancelled = true;
        };
    }, [cpiValue]);

    const formattedPendingDate = useMemo(() => {
        if (!pendingPurchase) return "—";
        return new Date(pendingPurchase.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }, [pendingPurchase]);

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Payment status</h1>
                        <p className={styles.subtitle}>We are syncing your tokens and order.</p>
                    </div>
                    <span className={`${styles.badge} ${badgeClass}`}>
                        {state === "ok"
                            ? "Confirmed"
                            : state === "pending"
                                ? "Pending"
                                : state === "error"
                                    ? "Error"
                                    : "Loading"}
                    </span>
                </div>

                <p className={styles.message}>{msg || "Confirming payment..."}</p>

                <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                        <span>Selected package</span>
                        <span className={styles.detailValue}>
                            {pendingPurchase ? `${pendingPurchase.tokens} tokens` : "—"}
                        </span>
                    </div>
                    <div className={styles.detailItem}>
                        <span>Reference</span>
                        <span className={styles.detailValue}>{cpiValue || "—"}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span>Credited tokens</span>
                        <span className={styles.detailValue}>
                            {creditedTokens !== null ? `${creditedTokens} tokens` : "—"}
                        </span>
                    </div>
                    <div className={styles.detailItem}>
                        <span>Selected at</span>
                        <span className={styles.detailValue}>{formattedPendingDate}</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    {state === "ok" && (
                        <>
                            <a className={styles.primaryBtn} href="/dashboard">
                                Go to dashboard
                            </a>
                            <a className={styles.secondaryBtn} href="/pricing">
                                Buy more tokens
                            </a>
                        </>
                    )}
                    {state === "error" && (
                        <>
                            <a className={styles.primaryBtn} href="/pricing">
                                Back to pricing
                            </a>
                            <a className={styles.secondaryBtn} href="/contact-us">
                                Contact support
                            </a>
                        </>
                    )}
                    {state === "pending" && (
                        <a className={styles.secondaryBtn} href="/dashboard">
                            Go to dashboard
                        </a>
                    )}
                </div>

                <p className={styles.meta}>Reference: {cpiValue || "—"}</p>
            </section>
        </main>
    );
}
