"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

// Generates random particles for the gold dust effect
function GoldParticles() {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);

    useEffect(() => {
        const arr = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            delay: Math.random() * 5,
            duration: Math.random() * 10 + 10,
        }));
        setParticles(arr);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-gold-500/40"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

export function Hero() {
    return (
        <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center justify-center bg-rich-black pt-20">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-gold-500/8 rounded-full blur-[150px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-gold-300/8 rounded-full blur-[150px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/3 rounded-full blur-[200px]" />
            </div>

            {/* Decorative Lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/10 to-transparent"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/10 to-transparent"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                />
            </div>

            {/* Gold Particles */}
            <GoldParticles />

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                >
                    <motion.div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                                duration: 0.8
                            }}
                            className="relative w-full max-w-[320px] h-40 md:max-w-[600px] md:h-60"
                        >
                            <Image
                                src="/logo-main.png"
                                alt="NINE1LUXURY"
                                fill
                                className="object-contain drop-shadow-[0_0_30px_rgba(174,132,57,0.3)]"
                                priority
                            />
                        </motion.div>

                        {/* Slogan */}
                        <div
                            className="mt-6 flex flex-row flex-wrap justify-center gap-x-6"
                            style={{ direction: 'ltr' }}
                            suppressHydrationWarning
                        >
                            {"MAKE U FEEL LUXURY".split(" ").map((word, wordIndex) => (
                                <div key={wordIndex} className="flex flex-row gap-[0.02em]">
                                    {word.split("").map((char, charIndex) => (
                                        <motion.span
                                            key={charIndex}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.15,
                                                delay: 0.3 + (wordIndex * 0.12) + (charIndex * 0.03),
                                                ease: "easeOut"
                                            }}
                                            className="text-gold-300/90 text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-[0.15em]"
                                            style={{ textShadow: '0 0 30px rgba(174,132,57,0.3)' }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Decorative divider */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"
                        />
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10"
                    >
                        <Link
                            href="/products"
                            className="group relative px-10 py-4 bg-gold-500 text-rich-black font-bold uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(174,132,57,0.4)] hover:scale-105 rounded-full text-lg"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                استكشف المجموعة
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>

                        <Link
                            href="/contact"
                            className="px-10 py-4 border border-gold-500/40 text-gold-300 font-bold uppercase hover:bg-gold-500/10 hover:border-gold-500/60 transition-all duration-300 rounded-full text-lg"
                        >
                            تواصل معنا
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-gold-500/40 text-[10px] uppercase tracking-[0.3em] font-bold">اكتشف المزيد</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-5 h-5 text-gold-500/40" />
                </motion.div>
            </motion.div>
        </section>
    );
}
