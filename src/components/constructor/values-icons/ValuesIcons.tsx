"use client";
import React from "react";
import Grid from "../grid/Grid";
import styles from "./ValuesIcons.module.scss";
import { motion } from "framer-motion";

interface ValueItem {
    icon: string;
    title: string;
    description?: string;
    text?: string;
}

interface Props {
    title?: string;
    description?: string;
    values: ValueItem[];
}

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
};

const ValuesIcons: React.FC<Props> = ({ title, description, values }) => {
    return (
        <section className={styles.section}>
            <div className={styles.head}>
                {title && (
                    <motion.h2
                        className={styles.sectionTitle}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {title}
                    </motion.h2>
                )}

                {description && (
                    <motion.p
                        className={styles.sectionDesc}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {description}
                    </motion.p>
                )}
            </div>

            <Grid columns={values.length > 3 ? 4 : values.length} gap="2.5rem">
                {values.map((v, i) => (
                    <motion.div
                        key={i}
                        className={styles.valueCard}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.25 }}
                        variants={cardVariants}
                        transition={{ delay: i * 0.15, duration: 0.7, ease: "easeOut" }}
                    >
                        <div className={styles.iconWrap}>
                            <div className={styles.icon}>{v.icon}</div>
                        </div>

                        <h3>{v.title}</h3>
                        <p>{v.description ?? v.text}</p>
                    </motion.div>
                ))}
            </Grid>
        </section>
    );
};

export default ValuesIcons;
