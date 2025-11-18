"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Currency = "GBP" | "EUR" | "USD";

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (val: Currency) => void;
    sign: string;
    rateToGBP: number;
    convertFromGBP: (gbp: number) => number;
    convertToGBP: (val: number) => number;
}

// 💱 Символи валют
const CURRENCY_SIGNS: Record<Currency, string> = {
    GBP: "£",
    EUR: "€",
    USD: "$",
};

// 💹 Поточні курси (можна підключити API для оновлення)
const RATES: Record<Currency, number> = {
    GBP: 1,      // базова валюта
    EUR: 1.17,   // 1 GBP = 1.17 EUR
    USD: 1.29,   // 1 GBP = 1.29 USD
};

const CurrencyContext = createContext<CurrencyContextType>({
    currency: "GBP",
    setCurrency: () => {},
    sign: "£",
    rateToGBP: 1,
    convertFromGBP: (v) => v,
    convertToGBP: (v) => v,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrency] = useState<Currency>("GBP");

    const rateToGBP = RATES[currency];
    const sign = CURRENCY_SIGNS[currency];

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                sign,
                rateToGBP,
                convertFromGBP: (gbp) => gbp * rateToGBP,
                convertToGBP: (val) => val / rateToGBP,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
};
