"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import styles from "./CurrencySwitch.module.scss";
import { IoMdArrowDropdown } from "react-icons/io";

const CurrencySwitch: React.FC = () => {
    const { currency, setCurrency } = useCurrency();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelect = (val: "GBP" | "EUR" | "USD") => {
        setCurrency(val);
        setOpen(false);
    };

    // закриття при кліку поза дропдауном
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <button className={styles.trigger} onClick={() => setOpen(!open)}>
                <span className={styles.label}>{currency}</span>
                <IoMdArrowDropdown
                    className={`${styles.icon} ${open ? styles.open : ""}`}
                    size={20}
                />
            </button>

            <div className={`${styles.menu} ${open ? styles.show : ""}`}>
                {["GBP", "EUR", "USD"].map((c) => (
                    <button
                        key={c}
                        className={`${styles.option} ${currency === c ? styles.active : ""}`}
                        onClick={() => handleSelect(c as "GBP" | "EUR" | "USD")}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CurrencySwitch;
