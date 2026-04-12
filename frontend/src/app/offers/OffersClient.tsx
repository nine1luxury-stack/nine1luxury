"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function OffersClient({ initialOffers }: { initialOffers: any[] }) {
    const offers = initialOffers;

    return (
        <main className="min-h-screen bg-rich-black overflow-hidden" dir="rtl">
            <Header />

            <div className="pt-32 pb-24 container mx-auto px-4">
                {/* Hero section for offers */}
                <div className="relative mb-20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[120px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[150px] -z-10" />
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-black uppercase tracking-widest"
                        >
                            <Sparkles className="w-4 h-4" />
                            حملات حصرية
                        </motion.div>
                        <h1 className="text-5xl md:text-8xl font-extrabold text-white font-almarai uppercase tracking-tight leading-[1.1]">
                            عروض <span className="text-metallic-gradient">استثنائية</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl text-lg font-medium leading-relaxed">
                            اختر من بين مجموعتنا المختارة بعناية، واستمتع بتجربة تسوق فاخرة مع تخفيضات تليق بك.
                        </p>
                    </div>
                </div>

                {offers.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 bg-surface-dark/30 rounded-3xl">
                        <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">لا توجد عروض حالياً</h3>
                        <p className="text-gray-500 mb-8">تابعنا باستمرار للحصول على أحدث العروض والخصومات.</p>
                        <Link 
                            href="/products" 
                            className="inline-flex items-center gap-2 bg-gold-500 text-rich-black px-8 py-3 rounded-xl font-bold hover:bg-gold-400 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            استعرض المنتجات
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offers.map((offer, index) => (
                            <motion.div
                                key={offer.id || index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-surface-dark border border-white/5 rounded-3xl overflow-hidden hover:border-gold-500/30 transition-all duration-500 shadow-2xl shadow-black/40"
                            >
                                {/* Content */}
                                <div className="p-10">
                                    <h3 className="text-3xl font-extrabold text-white mb-4 font-almarai group-hover:text-gold-300 transition-colors leading-tight">
                                        {offer.title}
                                    </h3>
                                    <p className="text-ivory/40 mb-10 line-clamp-3 text-base leading-relaxed min-h-[72px]">
                                        {offer.description || "استمتع بأفضل العروض والخصومات الحصرية على تشكيلتنا المميزة لفترة محدودة."}
                                    </p>
                                    
                                    <Link 
                                        href={`/products?category=${encodeURIComponent(offer.link)}`}
                                        className="w-full inline-flex items-center justify-center gap-3 bg-ivory text-rich-black py-5 rounded-2xl font-black group-hover:bg-gold-500 transition-all duration-300 transform active:scale-95 shadow-xl shadow-black/20 text-sm uppercase tracking-widest"
                                    >
                                        تسوق التشكيلة الآن
                                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
                                    </Link>
                                </div>

                                {/* Subtle decorative line */}
                                <div className="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-l from-gold-500/0 via-gold-500/50 to-gold-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Bottom CTA */}
                {offers.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-32 p-12 rounded-[2.5rem] bg-gradient-to-r from-gold-600/10 via-surface-dark to-gold-600/10 border border-gold-500/10 text-center relative overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <h2 className="text-4xl font-bold text-white">هل تبحث عن شيء محدد؟</h2>
                            <p className="text-gray-400 max-w-xl">استكشف مجموعتنا الكاملة وابحث عما يناسب ذوقك الرفيع من خلال صفحة المنتجات.</p>
                            <Link 
                                href="/products"
                                className="px-10 py-4 bg-gold-500 text-rich-black rounded-2xl font-bold hover:bg-gold-400 transition-all flex items-center gap-3"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                استعرض جميع المنتجات
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>

            <Footer />
        </main>
    );
}
