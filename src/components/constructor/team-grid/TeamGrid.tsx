"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import styles from "./TeamGrid.module.scss";

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    image: string;
}

interface TeamSliderProps {
    title?: string;
    description?: string;
    members: TeamMember[];
}

import { media as mediaMap } from "@/resources/media";

function resolveMedia(key?: string) {
    if (!key) return "";
    return (mediaMap as Record<string, any>)[key] || "";
}


const TeamGrid: React.FC<TeamSliderProps> = ({ title, description, members }) => {
    return (
        <section className={styles.section}>
            <motion.div
                className={styles.head}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {title && <h2 className={styles.title}>{title}</h2>}
                {description && <p className={styles.desc}>{description}</p>}
            </motion.div>

            <Swiper
                modules={[EffectCoverflow, Pagination, Autoplay]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 150,
                    modifier: 2,
                    slideShadows: true,
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: true,
                }}
                pagination={{ clickable: true }}
                className={styles.slider}
            >
                {members.map((m, i) => (
                    <SwiperSlide key={i} className={styles.slide}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className={styles.card}
                        >
                            <Image
                                src={resolveMedia(m.image)}
                                alt={m.name}
                                className={styles.photo}
                                width={500}
                                height={500}
                            />

                            <div className={styles.info}>
                                <h3 className={styles.name}>{m.name}</h3>
                                <p className={styles.role}>{m.role}</p>
                                <p className={styles.bio}>{m.bio}</p>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default TeamGrid;
