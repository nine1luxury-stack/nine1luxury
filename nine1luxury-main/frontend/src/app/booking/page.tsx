"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, MessageSquare, CheckCircle, Loader2, Package, Maximize2, MapPin, Banknote } from "lucide-react";
import Image from "next/image";

const EGYPT_CITIES = [
    { name: "القاهرة", shipping: 80 },
    { name: "الجيزة", shipping: 80 },
    { name: "الإسكندرية", shipping: 80 },
    { name: "القليوبية", shipping: 80 },
    { name: "البحيرة", shipping: 80 },
    { name: "الدقهلية", shipping: 80 },
    { name: "الغربية", shipping: 80 },
    { name: "المنوفية", shipping: 80 },
    { name: "دمياط", shipping: 80 },
    { name: "بورسعيد", shipping: 80 },
    { name: "الإسماعيلية", shipping: 80 },
    { name: "السويس", shipping: 80 },
    { name: "كفر الشيخ", shipping: 80 },
    { name: "الشرقية", shipping: 80 },
    { name: "الفيوم", shipping: 90 },
    { name: "بني سويف", shipping: 90 },
    { name: "المنيا", shipping: 110 },
    { name: "أسيوط", shipping: 120 },
    { name: "سوهاج", shipping: 120 },
    { name: "قنا", shipping: 140 },
    { name: "الأقصر", shipping: 140 },
    { name: "أسوان", shipping: 140 },
    { name: "مطروح", shipping: 120 },
    { name: "شمال سيناء", shipping: 120 },
    { name: "جنوب سيناء", shipping: 120 },
    { name: "البحر الأحمر", shipping: 140 },
    { name: "الوادي الجديد", shipping: 140 },
];

export default function BookingPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        altPhone: "",
        city: "",
        shippingAmount: 0,
        productModel: "",
        productSize: "",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCityChange = (cityName: string) => {
        const cityObj = EGYPT_CITIES.find(c => c.name === cityName);
        setFormData({
            ...formData,
            city: cityName,
            shippingAmount: cityObj ? cityObj.shipping : 0
        });
    };

    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        
        if (!formData.name || formData.name.trim().split(/\s+/).length < 2) {
            newErrors.name = "يرجى إدخال الاسم ثنائياً على الأقل (الأول واللقب)";
        }

        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!formData.phone || !phoneRegex.test(formData.phone)) {
            newErrors.phone = "رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01";
        }

        if (!formData.productModel) newErrors.productModel = "يرجى إدخال اسم الموديل";
        if (!formData.productSize) newErrors.productSize = "يرجى اختيار المقاس";
        if (!formData.city) newErrors.city = "يرجى اختيار المحافظة";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    phone: formData.phone
                }),
            });
            if (res.ok) {
                setIsSuccess(true);
                setFormData({ name: "", phone: "", altPhone: "", city: "", shippingAmount: 0, productModel: "", productSize: "", notes: "" });
                setErrors({});
            } else {
                const errorData = await res.json();
                alert(errorData.error || "حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.");
            }
        } catch (error) {
            console.error(error);
            alert("حدث خطأ في الاتصال بالسيرفر.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-rich-black overflow-hidden">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/luxury_fitting_room.png"
                    alt="Luxury Fitting Room"
                    fill
                    className="object-cover opacity-60 scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-rich-black/80 via-transparent to-rich-black" />
                
                <div className="relative z-10 text-center space-y-4 px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold-500 font-bold uppercase text-sm block"
                    >
                        Exclusive Reservation
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-white uppercase"
                    >
                        احجز منتجك المفضل
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg font-amiri"
                    >
                        احجز قطعتك الفريدة الآن وسنقوم بتوصيلها إليك أينما كنت.
                    </motion.p>
                </div>
            </section>

            {/* Booking Form Section */}
            <section className="py-12 container mx-auto px-4 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                        {/* Info Side */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-playfair font-bold text-white uppercase">لماذا Nine1Luxury؟</h2>
                                <div className="h-1 w-20 bg-gold-500" />
                            </div>
                            
                            <div className="space-y-6">
                                {[
                                    { title: "جودة ممتازة", desc: "نحرص على تقديم أفضل الخامات العالمية." },
                                    { title: "توصيل سريع", desc: "نصلك في أسرع وقت ممكن لجميع محافظات مصر." },
                                    { title: "خدمة متميزة", desc: "فريقنا معك دائماً للتأكد من رضاك التام." }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0 border border-gold-500/20">
                                            <span className="text-gold-500 font-bold">0{i + 1}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold mb-1">{item.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-6 bg-surface-dark border border-white/5 rounded-2xl space-y-4">
                                <h3 className="text-gold-500 font-bold flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    للاستفسار السريع
                                </h3>
                                <p className="text-sm text-gray-400">يمكنكم التواصل معنا مباشرة عبر الهاتف أو واتساب.</p>
                                <a href="tel:01094372339" className="text-2xl font-bold text-white block hover:text-gold-300 transition-colors">01094372339</a>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="wait">
                                {!isSuccess ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-surface-dark border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-3xl -mr-16 -mt-16" />
                                        
                                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                                        <Phone className="w-3 h-3" /> رقم الهاتف
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        dir="ltr"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className={`w-full bg-rich-black border rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-all text-right ${errors.phone ? 'border-red-500' : 'border-white/10'}`}
                                                        placeholder="01xxxxxxxxx"
                                                        maxLength={11}
                                                    />
                                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                                        <User className="w-3 h-3" /> الاسم بالكامل
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className={`w-full bg-rich-black border rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-white/10'}`}
                                                        placeholder="ادخل اسمك هنا"
                                                    />
                                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                                        <Package className="w-3 h-3" /> اسم الموديل
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.productModel}
                                                        onChange={(e) => setFormData({ ...formData, productModel: e.target.value })}
                                                        className={`w-full bg-rich-black border rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-all ${errors.productModel ? 'border-red-500' : 'border-white/10'}`}
                                                        placeholder="اسم الموديل المطلوب"
                                                    />
                                                    {errors.productModel && <p className="text-red-500 text-xs mt-1">{errors.productModel}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                                        <Maximize2 className="w-3 h-3" /> المقاس
                                                    </label>
                                                    <select
                                                        value={formData.productSize}
                                                        onChange={(e) => setFormData({ ...formData, productSize: e.target.value })}
                                                        className={`w-full bg-rich-black border rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-all ${errors.productSize ? 'border-red-500' : 'border-white/10'}`}
                                                    >
                                                        <option value="">اختر المقاس</option>
                                                        <option value="S">S</option>
                                                        <option value="M">M</option>
                                                        <option value="L">L</option>
                                                        <option value="XL">XL</option>
                                                        <option value="XXL">XXL</option>
                                                        <option value="XXXL">XXXL</option>
                                                    </select>
                                                    {errors.productSize && <p className="text-red-500 text-xs mt-1">{errors.productSize}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                                        <MapPin className="w-3 h-3" /> المحافظة
                                                    </label>
                                                    <select
                                                        value={formData.city}
                                                        onChange={(e) => handleCityChange(e.target.value)}
                                                        className={`w-full bg-rich-black border rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-all ${errors.city ? 'border-red-500' : 'border-white/10'}`}
                                                    >
                                                        <option value="">اختر المحافظة</option>
                                                        {EGYPT_CITIES.map(city => (
                                                            <option key={city.name} value={city.name}>{city.name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                                        <Banknote className="w-3 h-3" /> سعر الشحن
                                                    </label>
                                                    <div className="w-full bg-gold-500/5 border border-gold-500/20 rounded-xl px-4 py-3 text-gold-300 font-bold flex items-center justify-between">
                                                        <span>{formData.shippingAmount} ج.م</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <MessageSquare className="w-3 h-3" /> ملاحظات إضافية
                                                </label>
                                                <textarea
                                                    value={formData.notes}
                                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-all min-h-[120px] resize-none"
                                                    placeholder="أي تفاصيل أخرى تود إضافتها..."
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-gold-500 hover:bg-gold-400 text-rich-black font-bold py-4 rounded-xl transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)] disabled:opacity-50 flex items-center justify-center gap-3 group"
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        تأكيد الحجز الآن
                                                        <motion.span
                                                            animate={{ x: [0, 5, 0] }}
                                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                                        >
                                                            ←
                                                        </motion.span>
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-surface-dark border border-gold-500/20 p-12 rounded-3xl text-center space-y-6 shadow-2xl"
                                    >
                                        <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-500/30">
                                            <CheckCircle className="w-10 h-10 text-gold-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-playfair font-bold text-white">تم استلام طلب الحجز</h3>
                                            <p className="text-gray-400">سوف نقوم بالتواصل معك خلال أقرب وقت لتأكيد حجز الموديل {formData.productModel}.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsSuccess(false)}
                                            className="text-gold-500 font-bold hover:text-gold-400 transition-colors underline underline-offset-8"
                                        >
                                            حجز منتج آخر
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
