"use client";


import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Premium gold dust particles with 3D-feeling motion paths
function GoldParticles() {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number; drift: number }>>([]);

    useEffect(() => {
        const arr = Array.from({ length: 10 }, (_, i) => ({
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
            <style>{`
                @keyframes float-particle {
                    0%, 100% { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; }
                    25% { opacity: 0.8; transform: translateY(-20px) translateX(10px) scale(1); }
                    50% { opacity: 0.4; transform: translateY(-40px) translateX(20px) scale(0.8); }
                    75% { opacity: 0.9; transform: translateY(-60px) translateX(10px) scale(1.2); }
                }
                .gold-particle {
                    animation: float-particle ease-in-out infinite;
                }
            `}</style>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full gold-particle"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        background: `radial-gradient(circle, hsla(40, 55%, 75%, 0.7) 0%, hsla(37, 48%, 48%, 0) 70%)`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}



export function Hero() {
    return (
        <section className="relative min-h-[95vh] w-full overflow-hidden flex items-center justify-center bg-transparent pt-20">
            {/* Layered Background — Creates depth */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Primary ambient glow */}
                <div 
                    className="absolute top-[15%] left-[8%] w-[500px] h-[500px] rounded-full animate-pulse"
                    style={{ background: 'radial-gradient(circle, hsla(37, 48%, 48%, 0.15) 0%, transparent 70%)', animationDuration: '8s' }}
                />
                {/* Secondary ambient glow */}
                <div 
                    className="absolute bottom-[15%] right-[8%] w-[400px] h-[400px] rounded-full animate-pulse"
                    style={{ background: 'radial-gradient(circle, hsla(39, 52%, 68%, 0.12) 0%, transparent 70%)', animationDuration: '10s', animationDelay: '2s' }}
                />
                {/* Central diffuse light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full" 
                     style={{ background: 'radial-gradient(circle, hsla(37, 48%, 48%, 0.08) 0%, transparent 70%)' }} />
                {/* Subtle radial vignette */}
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, hsla(225, 12%, 3%, 0.6) 100%)' }} />
            </div>

            {/* Decorative horizon lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <div
                    className="absolute top-[25%] left-0 w-full h-px"
                    style={{ background: 'linear-gradient(to right, transparent, hsla(37, 48%, 48%, 0.07), transparent)' }}
                />
                <div
                    className="absolute bottom-[30%] left-0 w-full h-px"
                    style={{ background: 'linear-gradient(to right, transparent, hsla(37, 48%, 48%, 0.05), transparent)' }}
                />
                {/* Vertical accent lines */}
                <div
                    className="absolute top-0 left-[15%] w-px h-full"
                    style={{ background: 'linear-gradient(to bottom, transparent, hsla(37, 48%, 48%, 0.04), transparent)' }}
                />
                <div
                    className="absolute top-0 right-[15%] w-px h-full"
                    style={{ background: 'linear-gradient(to bottom, transparent, hsla(37, 48%, 48%, 0.04), transparent)' }}
                />
            </div>

            {/* Gold Dust Particles */}
            <GoldParticles />

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <div
                    className="space-y-6 animate-fade-in-up"
                >
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div
                            className="relative w-full max-w-[200px] h-32 md:max-w-[400px] md:h-48"
                        >
                            <Image
                                src="/logo-main.png"
                                alt="NINE1LUXURY"
                                fill
                                className="object-contain"
                                style={{ filter: 'drop-shadow(0 0 50px hsla(37, 48%, 48%, 0.25))' }}
                                sizes="(max-width: 768px) 200px, 400px"
                                quality={75}
                                priority
                                fetchPriority="high"
                            />
                        </div>

                        {/* Slogan */}
                        <div
                            className="mt-8 flex flex-row flex-wrap justify-center gap-x-5"
                            style={{ direction: 'ltr' }}
                            suppressHydrationWarning
                        >
                            <h1 className="text-champagne/80 text-lg sm:text-xl md:text-3xl font-bold uppercase tracking-[0.18em]" style={{ textShadow: '0 0 40px hsla(37, 48%, 48%, 0.25)' }}>
                                MAKE U FEEL LUXURY
                            </h1>
                        </div>

                        {/* Decorative line with shimmer */}
                        <div
                            className="mt-7 h-px w-48 relative overflow-hidden mx-auto"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
                        </div>

                        {/* Short tagline */}
                        <p
                            className="mt-6 text-ivory/70 text-sm md:text-base tracking-wide max-w-md leading-relaxed mx-auto animate-fade-in-up"
                            style={{ animationDelay: '200ms' }}
                        >
                            وجهتك الأولى للملابس الفاخرة — أناقة لا تُضاهى وجودة تتحدث عن نفسها
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up"
                        style={{ animationDelay: '300ms' }}
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
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-up"
                style={{ animationDelay: '500ms' }}
            >
                <span className="text-gold-500/35 text-[9px] uppercase tracking-[0.35em] font-bold">اكتشف المزيد</span>
                <div className="animate-bounce mt-1">
                    <ChevronDown className="w-4 h-4 text-gold-500/30" />
                </div>
            </div>
        </section>
    );
}
