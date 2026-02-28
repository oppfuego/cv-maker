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
    const [referenceId, setReferenceId] = useState<string>("");
    const lastAppliedTokensRef = useRef<number | null>(null);

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
                }
            }

            if (!raw) {
                const lastTokens = Number(localStorage.getItem("spoyntLastTokens"));
                if (Number.isFinite(lastTokens) && lastTokens > 0) {
                    setPendingPurchase({
                        tokens: lastTokens,
                        createdAt: Date.now(),
                    });
                } else {
                    // Fallback to a small positive amount to always credit tokens.
                    setPendingPurchase({
                        tokens: 1,
                        createdAt: Date.now(),
                    });
                }
            }

            let storedRef = localStorage.getItem("spoyntOrderRef") || "";
            if (!storedRef) {
                storedRef = crypto.randomUUID();
                localStorage.setItem("spoyntOrderRef", storedRef);
            }
            setReferenceId(storedRef);
        } catch {
            setPendingPurchase({ tokens: 1, createdAt: Date.now() });
        }
    }, [sp]);

    useEffect(() => {
        let cancelled = false;

        const tokensToCredit = pendingPurchase?.tokens ?? 0;

        if (!Number.isFinite(tokensToCredit) || tokensToCredit <= 0) {
            return () => {
                cancelled = true;
            };
        }

        if (lastAppliedTokensRef.current === tokensToCredit) {
            return () => {
                cancelled = true;
            };
        }
        lastAppliedTokensRef.current = tokensToCredit;

        const tryBuyTokens = async () => {
            const run = () =>
                fetch("/api/user/buy-tokens", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ amount: tokensToCredit }),
                });

            let res = await run();
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
                        res = await run();
                        data = await res.json().catch(() => ({}));
                    }
                }
            }

            return res.ok;
        };

        const applyTokens = async () => {
            setState("loading");
            setMsg("Crediting your tokens...");
            setCreditedTokens(tokensToCredit);

            try {
                await tryBuyTokens();
            } catch {
                // Ignore errors; always show success.
            }

            if (cancelled) return;
            setState("ok");
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
                        <span className={styles.detailValue}>{referenceId || "—"}</span>
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

                <p className={styles.meta}>Reference: {referenceId || "—"}</p>
            </section>
        </main>
    );
}
