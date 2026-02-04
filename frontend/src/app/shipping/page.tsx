"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Truck, Clock, MapPin, Globe } from "lucide-react";

export default function ShippingPage() {
    const features = [
        {
            icon: Clock,
            title: "مدة التوصيل",
            description: "يتم توصيل الطلبات خلال 3-5 أيام عمل داخل القاهرة والجيزة، و 5-7 أيام لباقي المحافظات."
        },
        {
            icon: Truck,
            title: "مصاريف الشحن",
            description: "شحن مجاني للطلبات فوق 2000 جنيه مصري. مصاريف شحن ثابتة 50 ج.م للقاهرة و 75 ج.م للمحافظات."
        },
        {
            icon: MapPin,
            title: "مناطق التغطية",
            description: "نقوم بالتوصيل لجميع محافظات جمهورية مصر العربية حالياً. الشحن الدولي غير متاح مؤقتاً."
        },
        {
            icon: Globe,
            title: "تتبع الشحنة",
            description: "يمكنك تتبع حالة طلبك من خلال لوحة التحكم أو التواصل معنا عبر واتساب برقم الطلب."
        }
    ];

    return (
        <main className="min-h-screen bg-rich-black">
            <Header />

            <div className="pt-32 pb-24 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6 uppercase tracking-wider">
                            الشحن والتوصيل
                        </h1>
                        <p className="text-xl text-gray-400">
                            نحرص على وصول طلبك في أسرع وقت وبأفضل حالة.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-surface-dark border border-white/5 p-8 rounded-2xl hover:border-gold-500/30 transition-colors group"
                            >
                                <feature.icon className="w-10 h-10 text-gold-500 mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gold-500/5 border border-gold-500/20 p-8 rounded-2xl text-center"
                    >
                        <h3 className="text-xl font-bold text-gold-500 mb-4">هل لديك استفسار آخر؟</h3>
                        <p className="text-gray-400 mb-6">
                            فريق خدمة العملاء جاهز لمساعدتك في تتبع شحنتك أو الرد على أي استفسار بخصوص التوصيل.
                        </p>
                        <a
                            href="https://wa.me/201094372339"
                            target="_blank"
                            className="inline-flex items-center justify-center px-8 py-3 bg-gold-500 text-rich-black font-bold rounded-xl hover:bg-gold-300 transition-colors"
                        >
                            تواصل معنا
                        </a>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
