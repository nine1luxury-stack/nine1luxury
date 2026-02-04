"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-[85vh] w-full overflow-hidden flex items-center justify-center bg-rich-black pt-20">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-gold-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-gold-300/10 rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <motion.div
                        className="flex flex-col items-center mb-8"
                    >
                        <motion.div 
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                                duration: 0.8
                            }}
                            className="relative w-full max-w-[300px] h-36 md:max-w-[600px] md:h-60"
                        >
                            <Image
                                src="/logo-main.png"
                                alt="NINE1LUXURY"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                        <div className="flex overflow-hidden mt-4" style={{ direction: 'ltr' }} suppressHydrationWarning>
                            {"MAKE U FEEL LUXURY".split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.1,
                                        delay: 0.3 + index * 0.04, // Faster typing
                                        ease: "easeOut"
                                    }}
                                    className="text-gold-300 text-xl md:text-3xl font-bold uppercase whitespace-pre"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>



                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                        <Link
                            href="/products"
                            className="group relative px-10 py-4 bg-gold-500 text-rich-black font-bold uppercase overflow-hidden transition-all hover:pr-14 rounded-full"
                        >
                            <span className="relative z-10">استكشف المجموعة</span>
                            <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all w-5 h-5" />
                        </Link>

                        <Link
                            href="/contact"
                            className="px-10 py-4 border border-gold-500/50 text-gold-300 font-bold uppercase hover:bg-gold-500/10 transition-colors rounded-full"
                        >
                            تواصل معنا
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}

        </section>
    );
}
