import React from "react";
import styles from "./ExamplesGrid.module.scss";
import { cvExamples } from "@/data/cvExample";
import CVCard from "@/components/ui/cv-card/CVCard";
import Text from "@/components/constructor/text/Text";

interface ExamplesGridProps {
    title?: string;
    description?: string;
}

const ExamplesGrid: React.FC<ExamplesGridProps> = ({ title, description }) => {
    return (
        <section className={styles.wrapper}>
            {(title || description) && (
                <div className={styles.header}>
                    <Text
                        title={title}
                        description={description}
                        centerTitle
                        centerDescription
                        titleLevel={2}
                    />
                </div>
            )}

            <div className={styles.grid}>
                {cvExamples.map((cv) => (
                    <CVCard key={cv.id} {...cv} />
                ))}
            </div>
        </section>
    );
};

export default ExamplesGrid;
