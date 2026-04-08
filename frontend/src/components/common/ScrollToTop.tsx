"use client";

import { motion, AnimatePresence } from "framer-motion";
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

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-surface-card border border-gold-500/20 hover:border-gold-500/50 flex items-center justify-center text-gold-500 hover:text-gold-300 shadow-lg hover:shadow-[0_0_20px_rgba(174,132,57,0.2)] transition-all duration-300"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="w-5 h-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
