"use client";
import React, { useEffect, useRef, useState } from "react";
import Container from "../container/Container";
import Text from "../text/Text";
import Media from "../image/Media";
import { media as mediaMap } from "@/resources/media";
import { StaticImageData } from "next/image";
import styles from "./VideoDemo.module.scss"; // 👈 стилі окремо

interface Props {
    title?: string;
    description?: string;
    video: string; // ключ у mediaMap
}

const VideoDemo: React.FC<Props> = ({ title, description, video }) => {
    const resolvedVideo = (mediaMap as Record<string, string | StaticImageData>)[video];
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.2 } // коли 20% елемента видно
        );

        if (ref.current) observer.observe(ref.current);
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return (
        <Container
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="0px"
            style={{ width: "100%", maxWidth: "1300px", margin: "0 auto", padding: "0 30px" }}
        >
            <div
                ref={ref}
                className={`${styles.fadeBlock} ${isVisible ? styles.visible : ""}`}
            >
                <Text
                    title={title}
                    description={description}
                />
                <Media
                    type="video"
                    src={resolvedVideo}
                    aspectRatio="16/7"
                    autoPlay
                    loop
                    muted
                    controls={false}
                />
            </div>
        </Container>
    );
};

export default VideoDemo;
