"use client";
import React from "react";
import styles from "./Marquee.module.scss";

interface MarqueeProps {
    items: { text: string }[];
}

const Marquee: React.FC<MarqueeProps> = ({ items }) => {
    const doubled = [...items, ...items];

    return (
        <section className={styles.marqueeWrapper}>
            <div className={styles.gradientOverlay} />
            <div className={styles.track}>
                {doubled.map((item, i) => (
                    <span key={i} className={styles.item}>
            {item.text}
          </span>
                ))}
            </div>
        </section>
    );
};

export default Marquee;
