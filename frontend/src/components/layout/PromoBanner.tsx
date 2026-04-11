"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

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
        <div className="w-full relative overflow-hidden bg-gradient-to-r from-rich-black via-gold-500/10 to-rich-black py-4 border-y border-ivory/[0.04] group">
            <div className="container mx-auto px-4 whitespace-nowrap animate-marquee flex items-center hover:[animation-play-state:paused] hover:cursor-default">
                <div className="inline-flex items-center gap-6 px-4">
                    <p className="text-champagne/80 font-playfair font-medium text-lg md:text-xl uppercase tracking-[0.2em]">
                        {promoBanner}
                    </p>
                    <Sparkles className="w-4 h-4 text-gold-500/40" />
                </div>
                <div className="inline-flex items-center gap-6 px-4" aria-hidden="true">
                    <p className="text-champagne/80 font-playfair font-medium text-lg md:text-xl uppercase tracking-[0.2em]">
                        {promoBanner}
                    </p>
                    <Sparkles className="w-4 h-4 text-gold-500/40" />
                </div>
                <div className="inline-flex items-center gap-6 px-4" aria-hidden="true">
                    <p className="text-champagne/80 font-playfair font-medium text-lg md:text-xl uppercase tracking-[0.2em]">
                        {promoBanner}
                    </p>
                    <Sparkles className="w-4 h-4 text-gold-500/40" />
                </div>
                <div className="inline-flex items-center gap-6 px-4" aria-hidden="true">
                    <p className="text-champagne/80 font-playfair font-medium text-lg md:text-xl uppercase tracking-[0.2em]">
                        {promoBanner}
                    </p>
                    <Sparkles className="w-4 h-4 text-gold-500/40" />
                </div>
            </div>
        </div>
    );
}
