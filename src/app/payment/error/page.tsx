"use client";

import React from "react";
import styles from "../success/PaymentSuccess.module.scss";

export default function PaymentErrorPage() {
    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Payment failed</h1>
                        <p className={styles.subtitle}>Your payment was not completed.</p>
                    </div>
                    <span className={`${styles.badge} ${styles.badgeError}`}>Error</span>
                </div>

                <p className={styles.message}>Please try again or contact support if the issue persists.</p>

                <div className={styles.actions}>
                    <a className={styles.primaryBtn} href="/pricing">
                        Back to pricing
                    </a>
                    <a className={styles.secondaryBtn} href="/contact-us">
                        Contact support
                    </a>
                </div>
            </section>
        </main>
    );
}

