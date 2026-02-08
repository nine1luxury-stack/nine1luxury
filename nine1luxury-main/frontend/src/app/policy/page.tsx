"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { RefreshCw, Phone, AlertCircle, CheckCircle2 } from "lucide-react";

export default function PolicyPage() {
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
                            سياسة الاستبدال والاسترجاع
                        </h1>
                        <p className="text-xl text-gray-400">
                            نضمن لك تجربة تسوق مريحة وآمنة.
                        </p>
                    </motion.div>

                    <div className="space-y-8">
                        {/* Section 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-surface-dark border border-white/5 p-8 rounded-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gold-500/10 rounded-xl shrink-0">
                                    <ClockIcon className="w-6 h-6 text-gold-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">المدة المسموحة</h3>
                                    <ul className="space-y-3 text-gray-400 list-disc list-inside">
                                        <li>يمكنك طلب الاستبدال أو الاسترجاع خلال 14 يوماً من تاريخ استلام الطلب.</li>
                                        <li>يجب الإبلاغ عن أي عيب في المنتج خلال 24 ساعة من الاستلام.</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        {/* Section 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-surface-dark border border-white/5 p-8 rounded-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gold-500/10 rounded-xl shrink-0">
                                    <CheckCircle2 className="w-6 h-6 text-gold-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">شروط قبول الاستبدال/الاسترجاع</h3>
                                    <ul className="space-y-3 text-gray-400 list-disc list-inside">
                                        <li>أن يكون المنتج في حالته الأصلية (غير مستخدم، غير مغسول).</li>
                                        <li>وجود جميع الملصقات والعلامات التجارية (التاغ) في مكانها.</li>
                                        <li>وجود الفاتورة الأصلية أو رقم الطلب.</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        {/* Section 3 */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-surface-dark border border-white/5 p-8 rounded-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gold-500/10 rounded-xl shrink-0">
                                    <AlertCircle className="w-6 h-6 text-gold-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">منتجات لا يمكن استرجاعها</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        حرصاً على صحة عملائنا، لا يمكن استبدال أو استرجاع الملابس الداخلية أو الإكسسوارات الشخصية إلا في حالة وجود عيب صناعة.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* How to Request */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 text-center"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">كيف تقدم الطلب؟</h3>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            تواصل معنا عبر واتساب برقم الطلب وصورة للمنتج (في حالة الاستبدال) وسيتم الرد عليك فوراً لترتيب موعد مع المندوب.
                        </p>
                        <a
                            href="https://wa.me/201094372339"
                            target="_blank"
                            className="inline-flex items-center gap-2 bg-gold-500 text-rich-black px-8 py-4 rounded-xl font-bold hover:bg-gold-300 transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                            <span>تواصل معنا الآن</span>
                        </a>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

function ClockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
