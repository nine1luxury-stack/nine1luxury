"use client";

import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-surface-card border border-gold-500/20 hover:border-gold-500/50 flex items-center justify-center text-gold-500 hover:text-gold-300 shadow-lg hover:shadow-[0_0_20px_rgba(174,132,57,0.2)] hover:scale-110 active:scale-90 transition-all duration-300 animate-fade-in-up"
            aria-label="Scroll to top"
        >
            <ChevronUp className="w-5 h-5" />
        </button>
    );
}
