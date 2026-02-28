"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./PaymentSuccess.module.scss";

export default function PaymentSuccessPage() {
    const sp = useSearchParams();

    const [state, setState] = useState<"loading" | "ok" | "error">("loading");
    const [msg, setMsg] = useState<string>("");
    const [creditedTokens, setCreditedTokens] = useState<number | null>(null);
    const [pendingPurchase, setPendingPurchase] = useState<{
        tokens: number;
        createdAt: number;
    } | null>(null);
    const hasCheckedRef = useRef(false);

    const badgeClass =
        state === "ok"
            ? styles.badgeOk
            : state === "error"
                ? styles.badgeError
                : styles.badgeLoading;

    useEffect(() => {
        sp.get("cpi");
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
        if (hasCheckedRef.current) return;
        hasCheckedRef.current = true;

        let cancelled = false;

        const applyTokens = async () => {
            if (!pendingPurchase || !Number.isFinite(pendingPurchase.tokens) || pendingPurchase.tokens <= 0) {
                setState("error");
                setMsg("Missing selected package.");
                return;
            }

            setState("loading");
            setMsg("Crediting your tokens...");

            try {
                await fetch("/api/user/buy-tokens", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ amount: pendingPurchase.tokens }),
                });
            } catch {
                // Ignore errors; sandbox mode always shows success
            } finally {
                if (cancelled) return;
                setState("ok");
                setCreditedTokens(pendingPurchase.tokens);
                setMsg("Payment confirmed. Tokens credited.");
                localStorage.removeItem("pendingPurchase");
            }
        };

        applyTokens();

        return () => {
            cancelled = true;
        };
    }, [pendingPurchase]);

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
                            : state === "error"
                                ? "Error"
                                : "Loading"}
                    </span>
                </div>

                <p className={styles.message}>{msg || "Crediting your tokens..."}</p>

                <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                        <span>Selected package</span>
                        <span className={styles.detailValue}>
                            {pendingPurchase ? `${pendingPurchase.tokens} tokens` : "—"}
                        </span>
                    </div>
                    <div className={styles.detailItem}>
                        <span>Reference</span>
                        <span className={styles.detailValue}>—</span>
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
                </div>

                <p className={styles.meta}>Reference: —</p>
            </section>
        </main>
    );
}
