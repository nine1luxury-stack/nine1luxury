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
        <div className="w-full relative overflow-hidden bg-gradient-to-r from-bronze/20 via-surface-dark to-bronze/20 py-5 border-y border-ivory/[0.06] group shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
            
            {/* CSS-only infinite marquee — hardware accelerated, zero lag */}
            <div className="flex whitespace-nowrap" style={{ willChange: 'transform' }}>
                <div 
                    className="flex items-center shrink-0"
                    style={{
                        animation: 'marquee-fast 12s linear infinite',
                        willChange: 'transform',
                    }}
                >
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="inline-flex items-center gap-8 px-6">
                            <p className="text-champagne font-almarai font-black text-base md:text-lg uppercase tracking-[0.4em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                {promoBanner}
                            </p>
                            <div className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-gold-500/30" />
                                <div className="w-1.5 h-1.5 rounded-full bg-bronze/40" />
                                <Sparkles className="w-3.5 h-3.5 text-gold-500/30" />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Duplicate for seamless loop */}
                <div 
                    className="flex items-center shrink-0"
                    style={{
                        animation: 'marquee-fast 12s linear infinite',
                        willChange: 'transform',
                    }}
                >
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={`dup-${i}`} className="inline-flex items-center gap-8 px-6">
                            <p className="text-champagne font-almarai font-black text-base md:text-lg uppercase tracking-[0.4em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                {promoBanner}
                            </p>
                            <div className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-gold-500/30" />
                                <div className="w-1.5 h-1.5 rounded-full bg-bronze/40" />
                                <Sparkles className="w-3.5 h-3.5 text-gold-500/30" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subtle light sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ivory/5 to-transparent -translate-x-full group-hover:animate-[gold-shimmer_3s_infinite]" />

            <style jsx>{`
                @keyframes marquee-fast {
                    0% { transform: translateX(0) translateZ(0); }
                    100% { transform: translateX(-100%) translateZ(0); }
                }
            `}</style>
        </div>
    );
}
