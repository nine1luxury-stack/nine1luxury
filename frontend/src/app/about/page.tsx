"use client";


import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Award, Target, Heart, Sparkles } from "lucide-react";

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

    return (
        <main className="min-h-screen bg-rich-black">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gold-500/10 to-transparent" />
                <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-gold-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-gold-300/5 rounded-full blur-[100px]" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-4 text-center relative z-10"
                >
                    <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white uppercase tracking-wider mb-6">
                        من نحن
                    </h1>
                    <div className="h-px w-24 bg-gold-500 mx-auto mb-8" />
                    <p className="text-xl text-gold-300/80 max-w-2xl mx-auto">
                        رحلتنا نحو إعادة تعريف الأناقة والفخامة
                    </p>
                </motion.div>
            </section>

            {/* Story Section */}
            <section className="py-24 bg-surface-dark/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6 text-center"
                        >
                            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white">
                                قصتنا
                            </h2>
                            <div className="h-px w-16 bg-gold-500 mx-auto" />
                            <p className="text-gray-400 leading-relaxed text-lg">
                                بدأت <span className="text-gold-300 font-bold">nine1luxury</span> من رؤية بسيطة: جعل الأناقة والفخامة في متناول الجميع.
                                نؤمن بأن كل شخص يستحق أن يشعر بالثقة والتميز في ملابسه.
                            </p>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                منذ انطلاقتنا، التزمنا بتقديم منتجات عالية الجودة بتصاميم عصرية تجمع بين الأصالة والحداثة.
                                كل قطعة نقدمها هي نتاج شغف وإتقان، مصممة خصيصاً لتعكس شخصيتك الفريدة.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
                            قيمنا
                        </h2>
                        <div className="h-px w-16 bg-gold-500 mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-surface-dark/40 border border-gold-500/10 p-8 text-center space-y-4 hover:border-gold-500/30 transition-all group"
                            >
                                <div className="w-16 h-16 mx-auto rounded-full bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500 transition-all">
                                    <value.icon className="w-8 h-8 text-gold-500 group-hover:text-rich-black transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{value.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 bg-surface-dark/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
                                رؤيتنا
                            </h2>
                            <div className="h-px w-16 bg-gold-500 mx-auto mb-8" />
                            <p className="text-gray-400 leading-relaxed text-lg">
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
