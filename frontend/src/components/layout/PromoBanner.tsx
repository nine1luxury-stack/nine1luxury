"use client";

import { useState, useEffect } from "react";

export function PromoBanner({ settingKey = "promoBanner" }: { settingKey?: string }) {
    const [promoBanner, setPromoBanner] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data[settingKey]) {
                        setPromoBanner(data[settingKey]);
                    }
                }
            } catch (error) {
                console.error("Failed to load settings:", error);
            }
        };
        fetchSettings();
    }, [settingKey]);

    if (!promoBanner) return null;

    return (
        <div className="w-full relative overflow-hidden bg-gradient-to-r from-rich-black via-gold-500/20 to-rich-black py-4 border-y border-gold-500/30 group">
            <div className="container mx-auto px-4 whitespace-nowrap animate-marquee flex items-center hover:[animation-play-state:paused] hover:cursor-default">
                <p className="inline-block text-gold-300 font-medium text-lg md:text-2xl px-8 w-max">
                    {promoBanner}
                </p>
                <p className="inline-block text-gold-300 font-medium text-lg md:text-2xl px-8 w-max" aria-hidden="true">
                    {promoBanner}
                </p>
                <p className="inline-block text-gold-300 font-medium text-lg md:text-2xl px-8 w-max" aria-hidden="true">
                    {promoBanner}
                </p>
            </div>
        </div>
    );
}
