"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, useInView } from "framer-motion";
import { Award, Target, Heart, Sparkles, Users, Package, Star, TrendingUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// Animated counter component
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);
            return () => clearInterval(timer);
        }
    }, [isInView, target]);

    return (
        <div ref={ref} className="text-4xl md:text-5xl font-playfair font-bold text-gold-300">
            {count.toLocaleString()}{suffix}
        </div>
    );
}

export default function AboutPage() {
    const values = [
        {
            icon: Award,
            title: "الجودة الفائقة",
            desc: "نستخدم أفضل الخامات والمواد لضمان منتجات تدوم طويلاً"
        },
        {
            icon: Target,
            title: "التصميم العصري",
            desc: "نواكب أحدث صيحات الموضة العالمية بلمسة محلية مميزة"
        },
        {
            icon: Heart,
            title: "رضا العملاء",
            desc: "سعادتك هي أولويتنا، نقدم خدمة عملاء متميزة"
        },
        {
            icon: Sparkles,
            title: "الفخامة بأسعار معقولة",
            desc: "نؤمن بأن الأناقة حق للجميع"
        },
    ];

    const stats = [
        { icon: Users, value: 500, suffix: "+", label: "عميل سعيد" },
        { icon: Package, value: 150, suffix: "+", label: "منتج مميز" },
        { icon: Star, value: 98, suffix: "%", label: "رضا العملاء" },
        { icon: TrendingUp, value: 1000, suffix: "+", label: "طلب مكتمل" },
    ];

    return (
        <main className="min-h-screen bg-rich-black">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gold-500/8 to-transparent" />
                <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-gold-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-gold-300/5 rounded-full blur-[120px]" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container mx-auto px-4 text-center relative z-10 pt-20"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center"
                    >
                        <Sparkles className="w-8 h-8 text-gold-500" />
                    </motion.div>
                    <h1 className="text-4xl md:text-7xl font-playfair font-bold text-white uppercase mb-6">
                        من نحن
                    </h1>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6" />
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        رحلتنا نحو إعادة تعريف الأناقة والفخامة
                    </p>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-16 relative">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card rounded-2xl p-6 md:p-8 text-center group"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500 transition-all duration-500">
                                    <stat.icon className="w-6 h-6 text-gold-500 group-hover:text-rich-black transition-colors" />
                                </div>
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                <p className="text-gray-500 text-sm mt-2 font-bold">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/3 to-transparent" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6 text-center"
                        >
                            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white">قصتنا</h2>
                            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto" />
                            <p className="text-gray-400 leading-[2] text-lg">
                                بدأت <span className="text-gold-300 font-bold">Nine1Luxury</span> من رؤية بسيطة: جعل الأناقة والفخامة في متناول الجميع.
                                نؤمن بأن كل شخص يستحق أن يشعر بالثقة والتميز في ملابسه.
                            </p>
                            <p className="text-gray-400 leading-[2] text-lg">
                                منذ انطلاقتنا، التزمنا بتقديم منتجات عالية الجودة بتصاميم عصرية تجمع بين الأصالة والحداثة.
                                كل قطعة نقدمها هي نتاج شغف وإتقان، مصممة خصيصاً لتعكس شخصيتك الفريدة.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xs uppercase text-gold-500 font-bold mb-4 tracking-[0.3em]"
                        >
                            مبادئنا
                        </motion.h2>
                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4"
                        >
                            قيمنا
                        </motion.h3>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card rounded-2xl p-8 text-center space-y-4 group"
                            >
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500 transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(174,132,57,0.3)] group-hover:scale-110">
                                    <value.icon className="w-8 h-8 text-gold-500 group-hover:text-rich-black transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-gold-300 transition-colors">{value.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/3 to-transparent" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
                                رؤيتنا
                            </h2>
                            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8" />
                            <p className="text-gray-400 leading-[2] text-lg max-w-3xl mx-auto">
                                نطمح لأن نكون العلامة التجارية الأولى للملابس الفاخرة في المنطقة،
                                حيث يجد كل عميل القطعة المثالية التي تعبر عن شخصيته وتعزز ثقته بنفسه.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
