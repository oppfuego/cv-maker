"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FAQ.module.scss";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    items: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Frequently Asked Questions</h2>

            <div className={styles.grid}>
                {items.map((item, i) => {
                    const isActive = activeIndex === i;

                    return (
                        <div key={i} className={styles.row}>
                            {/* LEFT — question */}
                            <button
                                className={`${styles.questionCard} ${isActive ? styles.active : ""}`}
                                onClick={() => setActiveIndex(isActive ? null : i)}
                            >
                <span className={styles.number}>
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                                <span className={styles.text}>{item.question}</span>
                            </button>

                            {/* RIGHT — answer */}
                            <div className={styles.answerCell}>
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            key="answer"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className={styles.answerBox}
                                        >
                                            <p>{item.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FAQ;
