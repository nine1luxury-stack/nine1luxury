"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2200); // Animation duration
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-rich-black"
                >
                    {/* Background Particle/Glow Effect */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
                        style={{ background: 'hsla(37, 48%, 48%, 0.1)' }}
                    />
                    
                    <div className="relative flex flex-col items-center gap-8">
                        {/* Logo Animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ 
                                duration: 1, 
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.2
                            }}
                            className="relative w-48 h-20 md:w-64 md:h-28"
                        >
                            <Image
                                src="/logo-main.png"
                                alt="Nine1Luxury"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Loading Bar */}
                        <div className="relative w-40 h-[1px] bg-white/10 overflow-hidden rounded-full">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ 
                                    duration: 1.8, 
                                    ease: "easeInOut",
                                    delay: 0.4
                                }}
                                className="absolute inset-0 bg-gold-500 shadow-[0_0_8px_hsla(37,48%,48%,0.5)]"
                            />
                        </div>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="text-ivory/30 text-[10px] uppercase tracking-[0.4em] font-medium"
                        >
                            Excellence in Every Stitch
                        </motion.p>
                    </div>

                    {/* Decorative Corner Accents */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-12 right-12 w-24 h-24 border-t border-r border-gold-500/10"
                    />
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-12 left-12 w-24 h-24 border-b border-l border-gold-500/10"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
