"use client";

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
            const duration = 800;
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
        <div ref={ref} className="text-3xl md:text-4xl font-playfair font-bold text-gold-300">
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

            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, hsla(37, 48%, 48%, 0.05), transparent)' }} />
                <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full blur-[140px]" style={{ background: 'hsla(37, 48%, 48%, 0.04)' }} />
                <div className="absolute bottom-[20%] right-[10%] w-64 h-64 rounded-full blur-[140px]" style={{ background: 'hsla(39, 52%, 68%, 0.03)' }} />

                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.06 }}
                    className="container mx-auto px-4 text-center relative z-10 pt-20"
                >
                    <h1 className="section-title text-4xl md:text-5xl font-almarai font-extrabold mb-8 tracking-tighter leading-none">
                        من نحن
                    </h1>
                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mx-auto mb-6" />
                    <p className="text-lg text-ivory/35 max-w-2xl mx-auto leading-relaxed">
                        رحلتنا نحو إعادة تعريف الأناقة والفخامة
                    </p>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-16 relative">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 4 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.06, delay: idx * 0.02 }}
                                className="glass-card rounded-2xl p-6 md:p-8 text-center group"
                            >
                                <div className="w-11 h-11 mx-auto mb-4 rounded-xl bg-gold-500/[0.07] flex items-center justify-center group-hover:bg-gold-500 transition-all duration-500">
                                    <stat.icon className="w-5 h-5 text-gold-500 group-hover:text-rich-black transition-colors" />
                                </div>
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                <p className="text-ivory/25 text-sm mt-2 font-bold">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 relative">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, hsla(37, 48%, 48%, 0.02), transparent)' }} />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6 text-center"
                        >
                            <h2 className="section-title text-4xl md:text-7xl font-almarai font-extrabold tracking-tighter">قصتنا</h2>
                            <div className="h-2 w-32 luxury-gradient rounded-full mx-auto" />
                            <p className="text-ivory/35 leading-[2.2] text-lg">
                                بدأت <span className="text-metallic-gradient font-black">Nine1Luxury</span> من رؤية طموحة لمزج الأناقة الكلاسيكية باللمسات العصرية العالمية.
                                نحن لا نبيع مجرد ملابس، بل نقدم تجربة تعزز الثقة والتميز في كل تفصيلة.
                            </p>
                            <p className="text-ivory/35 leading-[2.2] text-lg">
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
                        <motion.p
                            initial={{ opacity: 0, y: 4 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="section-label"
                        >
                            مبادئنا
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 4 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.02 }}
                            className="section-title text-4xl md:text-6xl mb-6 font-almarai font-extrabold tracking-tighter"
                        >
                            قيمنا الأساسية
                        </motion.h2>
                        <div className="h-1.5 w-24 luxury-gradient rounded-full mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 4 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.06, delay: idx * 0.02 }}
                                className="glass-card rounded-2xl p-7 text-center space-y-4 group"
                            >
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-gold-500/[0.07] flex items-center justify-center group-hover:bg-gold-500 transition-all duration-500 group-hover:shadow-[0_0_20px_hsla(37,48%,48%,0.25)] group-hover:scale-105">
                                    <value.icon className="w-7 h-7 text-gold-500 group-hover:text-rich-black transition-colors duration-300" />
                                </div>
                                <h3 className="text-lg font-bold text-ivory group-hover:text-gold-300 transition-colors">{value.title}</h3>
                                <p className="text-ivory/25 text-sm leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 relative">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, hsla(37, 48%, 48%, 0.02), transparent)' }} />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="section-title text-3xl md:text-4xl mb-4">
                                رؤيتنا
                            </h2>
                            <div className="h-px w-14 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mx-auto mb-8" />
                            <p className="text-ivory/35 leading-[2.2] text-lg max-w-3xl mx-auto">
                                نطمح لأن نكون العلامة التجارية الأولى للملابس الفاخرة في المنطقة،
                                حيث يجد كل عميل القطعة المثالية التي تعبر عن شخصيته وتعزز ثقته بنفسه.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>


        </main>
    );
}
