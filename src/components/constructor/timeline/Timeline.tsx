"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "./Timeline.module.scss";
import Link from "next/link";

interface Step {
    title: string;
    description: string;
    link?: string;
}

interface TimelineProps {
    title?: string;
    steps: Step[];
}

const Timeline: React.FC<TimelineProps> = ({ title, steps}) => {
    return (
        <section className={styles.timelineSection}>
            <div className={styles.inner}>
                {title && (
                    <motion.h2
                        className={styles.title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        {title}
                    </motion.h2>
                )}

                <div className={styles.timelineTrack}>
                    <div className={styles.line} />

                    <div className={styles.steps}>
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className={styles.stepCard}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: index * 0.15,
                                    duration: 0.5,
                                    ease: "easeOut",
                                }}
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className={styles.circle}>
                                    <span>{index + 1}</span>
                                </div>
                                {step.link ? (
                                    <Link href={step.link} className={styles.content}>
                                        <h4>{step.title}</h4>
                                        <p>{step.description}</p>
                                    </Link>

                                ):(
                                    <div className={styles.content}>
                                        <h4>{step.title}</h4>
                                        <p>{step.description}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Timeline;
