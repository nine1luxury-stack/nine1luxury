"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Premium gold dust particles with 3D-feeling motion paths
function GoldParticles() {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number; drift: number }>>([]);

    useEffect(() => {
        const arr = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 0.5,
            delay: Math.random() * 6,
            duration: Math.random() * 12 + 12,
            drift: (Math.random() - 0.5) * 30,
        }));
        setParticles(arr);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        background: `radial-gradient(circle, hsla(40, 55%, 75%, 0.7) 0%, hsla(37, 48%, 48%, 0) 70%)`,
                    }}
                    animate={{
                        y: [0, -50, -20, -60, 0],
                        x: [0, p.drift * 0.5, p.drift, p.drift * 0.3, 0],
                        opacity: [0, 0.8, 0.4, 0.9, 0],
                        scale: [0.5, 1, 0.8, 1.2, 0.5],
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

// Interactive cursor light beam
function CursorLightBeam() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                mouseX.set((e.clientX - rect.left) / rect.width);
                mouseY.set((e.clientY - rect.top) / rect.height);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const x = useTransform(springX, [0, 1], ["-20%", "120%"]);
    const y = useTransform(springY, [0, 1], ["-20%", "120%"]);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full blur-[200px]"
                style={{
                    left: x,
                    top: y,
                    background: 'radial-gradient(circle, hsla(37, 48%, 48%, 0.08) 0%, transparent 70%)',
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />
            <motion.div
                className="absolute w-[300px] h-[300px] rounded-full blur-[120px]"
                style={{
                    left: x,
                    top: y,
                    background: 'radial-gradient(circle, hsla(40, 55%, 72%, 0.06) 0%, transparent 70%)',
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />
        </div>
    );
}

export function Hero() {
    return (
        <section className="relative min-h-[95vh] w-full overflow-hidden flex items-center justify-center bg-rich-black pt-20">
            {/* Layered Background — Creates depth */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Primary ambient glow */}
                <motion.div 
                    className="absolute top-[15%] left-[8%] w-[500px] h-[500px] rounded-full blur-[180px]"
                    style={{ background: 'hsla(37, 48%, 48%, 0.06)' }}
                    animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Secondary ambient glow */}
                <motion.div 
                    className="absolute bottom-[15%] right-[8%] w-[400px] h-[400px] rounded-full blur-[160px]"
                    style={{ background: 'hsla(39, 52%, 68%, 0.05)' }}
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
                {/* Central diffuse light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-[250px]" 
                     style={{ background: 'hsla(37, 48%, 48%, 0.03)' }} />
                {/* Subtle radial vignette */}
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, hsla(225, 12%, 3%, 0.6) 100%)' }} />
            </div>

            {/* Decorative horizon lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-[25%] left-0 w-full h-px"
                    style={{ background: 'linear-gradient(to right, transparent, hsla(37, 48%, 48%, 0.07), transparent)' }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-[30%] left-0 w-full h-px"
                    style={{ background: 'linear-gradient(to right, transparent, hsla(37, 48%, 48%, 0.05), transparent)' }}
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
                />
                {/* Vertical accent lines */}
                <motion.div
                    className="absolute top-0 left-[15%] w-px h-full"
                    style={{ background: 'linear-gradient(to bottom, transparent, hsla(37, 48%, 48%, 0.04), transparent)' }}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                    className="absolute top-0 right-[15%] w-px h-full"
                    style={{ background: 'linear-gradient(to bottom, transparent, hsla(37, 48%, 48%, 0.04), transparent)' }}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 7, repeat: Infinity, delay: 3 }}
                />
            </div>

            {/* Cursor Light Beam */}
            <CursorLightBeam />

            {/* Gold Dust Particles */}
            <GoldParticles />

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                >
                    {/* Logo */}
                    <motion.div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 80,
                                damping: 20,
                                duration: 1
                            }}
                            className="relative w-full max-w-[300px] h-36 md:max-w-[550px] md:h-56"
                        >
                            <Image
                                src="/logo-main.png"
                                alt="NINE1LUXURY"
                                fill
                                className="object-contain"
                                style={{ filter: 'drop-shadow(0 0 50px hsla(37, 48%, 48%, 0.25))' }}
                                priority
                            />
                        </motion.div>

                        {/* Slogan — Letter by letter reveal with metallic shimmer */}
                        <div
                            className="mt-8 flex flex-row flex-wrap justify-center gap-x-5"
                            style={{ direction: 'ltr' }}
                            suppressHydrationWarning
                        >
                            {"MAKE U FEEL LUXURY".split(" ").map((word, wordIndex) => (
                                <div key={wordIndex} className="flex flex-row gap-[0.02em]">
                                    {word.split("").map((char, charIndex) => (
                                        <motion.span
                                            key={charIndex}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.12,
                                                delay: 0.4 + (wordIndex * 0.1) + (charIndex * 0.025),
                                                ease: "easeOut"
                                            }}
                                            className="text-champagne/80 text-lg sm:text-xl md:text-3xl font-bold uppercase tracking-[0.18em]"
                                            style={{ textShadow: '0 0 40px hsla(37, 48%, 48%, 0.25)' }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Decorative line with shimmer */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-7 h-px w-48 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-300/40 to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            />
                        </motion.div>

                        {/* Short tagline */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            className="mt-6 text-ivory/70 text-sm md:text-base tracking-wide max-w-md leading-relaxed"
                        >
                            وجهتك الأولى للملابس الفاخرة — أناقة لا تُضاهى وجودة تتحدث عن نفسها
                        </motion.p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
                    >
                        <Link
                            href="/products"
                            className="btn-primary text-base md:text-lg group"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                استكشف المجموعة
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            </span>
                        </Link>

                        <Link
                            href="/contact"
                            className="btn-ghost text-base md:text-lg"
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
                transition={{ delay: 2.2 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-gold-500/35 text-[9px] uppercase tracking-[0.35em] font-bold">اكتشف المزيد</span>
                <motion.div
                    animate={{ y: [0, 7, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-4 h-4 text-gold-500/30" />
                </motion.div>
            </motion.div>
        </section>
    );
}
