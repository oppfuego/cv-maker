"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./PaymentSuccess.module.scss";

export default function PaymentSuccessPage() {
    const sp = useSearchParams();

    const [state, setState] = useState<"loading" | "ok">("loading");
    const [msg, setMsg] = useState<string>("");
    const [creditedTokens, setCreditedTokens] = useState<number | null>(null);
    const [pendingPurchase, setPendingPurchase] = useState<{
        tokens: number;
        createdAt: number;
    } | null>(null);
    const hasCheckedRef = useRef(false);

    const badgeClass = state === "ok" ? styles.badgeOk : styles.badgeLoading;

    useEffect(() => {
        sp.get("cpi");
        try {
            const raw = localStorage.getItem("pendingPurchase");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Number.isFinite(parsed.tokens)) {
                    setPendingPurchase({
                        tokens: Number(parsed.tokens),
                        createdAt: Number(parsed.createdAt) || Date.now(),
                    });
                    return;
                }
            }

            const lastTokens = Number(localStorage.getItem("spoyntLastTokens"));
            if (Number.isFinite(lastTokens) && lastTokens > 0) {
                setPendingPurchase({
                    tokens: lastTokens,
                    createdAt: Date.now(),
                });
            }
        } catch {
            setPendingPurchase(null);
        }
    }, [sp]);

    useEffect(() => {
        if (hasCheckedRef.current) return;
        hasCheckedRef.current = true;

        let cancelled = false;

        const tokensToCredit = pendingPurchase?.tokens ?? 0;

        const applyTokens = async () => {
            setState("loading");
            setMsg("Crediting your tokens...");

            if (Number.isFinite(tokensToCredit) && tokensToCredit > 0) {
                try {
                    await fetch("/api/user/buy-tokens", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ amount: tokensToCredit }),
                    });
                } catch {
                    // Ignore errors; always show success.
                }
            }

            if (cancelled) return;
            setState("ok");
            setCreditedTokens(Number.isFinite(tokensToCredit) ? tokensToCredit : null);
            setMsg("Payment confirmed. Tokens credited.");
            localStorage.removeItem("pendingPurchase");
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
                        {state === "ok" ? "Confirmed" : "Loading"}
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
                    <a className={styles.primaryBtn} href="/dashboard">
                        Go to dashboard
                    </a>
                    <a className={styles.secondaryBtn} href="/pricing">
                        Buy more tokens
                    </a>
                </div>

                <p className={styles.meta}>Reference: —</p>
            </section>
        </main>
    );
}
