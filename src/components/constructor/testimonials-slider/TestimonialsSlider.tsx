"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "./TestimonialsSlider.module.scss";
import { media } from "@/resources/media";
import { MdStar, MdStarBorder } from "react-icons/md";

interface Testimonial {
    name: string;
    role?: string;
    image?: string;
    text: string;
    rating?: number;
}

interface Props {
    title?: string;
    description?: string;
    testimonials: Testimonial[];
}

export default function TestimonialsSlider({ title, description, testimonials }: Props) {
    const resolveImage = (key?: string) => {
        if (!key) return undefined;
        const img = media[key as keyof typeof media];
        if (typeof img === "string") return img;
        return (img as any)?.src ?? "";
    };

    return (
        <section className={styles.section}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}

            <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                spaceBetween={40}
                slidesPerView={1}
                centeredSlides
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                speed={800}
                className={styles.slider}
            >
                {testimonials.map((t, i) => (
                    <SwiperSlide key={i}>
                        <motion.div
                            className={styles.card}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            {/* Фото користувача */}
                            {t.image && (
                                <motion.img
                                    src={resolveImage(t.image)}
                                    alt={t.name}
                                    className={styles.avatar}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            )}

                            {/* Цитата */}
                            <motion.blockquote className={styles.text}>
                                “{t.text}”
                            </motion.blockquote>

                            {/* Ім’я + роль */}
                            <div className={styles.footer}>
                                <div className={styles.info}>
                                    <h4 className={styles.name}>{t.name}</h4>
                                    {t.role && <p className={styles.role}>{t.role}</p>}
                                </div>

                                {/* ⭐ Рейтинг */}
                                <div className={styles.stars}>
                                    {Array.from({ length: 5 }).map((_, idx) =>
                                        idx < (t.rating ?? 5) ? (
                                            <MdStar key={idx} className={styles.starFilled} />
                                        ) : (
                                            <MdStarBorder key={idx} className={styles.starEmpty} />
                                        )
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
