"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const message = `*رسالة جديدة من موقع nine1luxury*%0A%0A\
*من:* ${formData.name}%0A\
*الهاتف:* ${formData.phone}%0A%0A\
*الرسالة:*%0A${formData.message}`;

        const whatsappUrl = `https://wa.me/201094372339?text=${message}`;
        window.open(whatsappUrl, "_blank");
    };

    const contactInfo = [
        {
            icon: Phone,
            title: "خدمة العملاء",
            value: "01094372339",
            link: "tel:+201094372339"
        },
        {
            icon: Mail,
            title: "البريد الإلكتروني",
            value: "nine1luxury@gmail.com",
            link: "mailto:nine1luxury@gmail.com"
        },
        {
            icon: MapPin,
            title: "العنوان",
            value: "القاهرة، مصر",
            link: "#"
        },
    ];

    const socialMedia = [
        {
            icon: Instagram,
            name: "Instagram",
            handle: "@nine1luxury",
            link: "https://instagram.com/nine1luxury"
        },
        {
            icon: Facebook,
            name: "Facebook",
            handle: "nine1luxury",
            link: "https://facebook.com/nine1luxury"
        },
    ];

    return (
        <main className="min-h-screen bg-rich-black">
            <Header />

            <div className="pt-32 pb-24 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white uppercase tracking-wider mb-4">
                            تواصل معنا
                        </h1>
                        <div className="h-px w-24 bg-gold-500 mx-auto mb-6" />
                        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            نحن هنا للإجابة على استفساراتك ومساعدتك. تواصل معنا عبر أي من الوسائل التالية.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-playfair font-bold text-white mb-8">معلومات الاتصال</h2>
                                <div className="space-y-6">
                                    {contactInfo.map((info, idx) => (
                                        <motion.a
                                            key={idx}
                                            href={info.link}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-start gap-4 p-4 bg-surface-dark/40 border border-gold-500/10 hover:border-gold-500/30 transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0 group-hover:bg-gold-500 transition-all">
                                                <info.icon className="w-6 h-6 text-gold-500 group-hover:text-rich-black transition-colors" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold mb-1">{info.title}</h3>
                                                <p className="text-gray-400 text-sm">{info.value}</p>
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h2 className="text-2xl font-playfair font-bold text-white mb-6">تابعنا</h2>
                                <div className="flex gap-4">
                                    {socialMedia.map((social, idx) => (
                                        <motion.a
                                            key={idx}
                                            href={social.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-center gap-3 px-6 py-4 bg-surface-dark/40 border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all group rounded-full"
                                        >
                                            <social.icon className="w-5 h-5 text-gold-500" />
                                            <div className="text-left">
                                                <p className="text-white text-sm font-bold">{social.name}</p>
                                                <p className="text-gray-500 text-xs">{social.handle}</p>
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* WhatsApp Quick Contact */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-gold-500/10 border border-gold-500/30 rounded-sm"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <MessageCircle className="w-6 h-6 text-gold-500" />
                                    <h3 className="text-white font-bold">تواصل سريع عبر واتساب</h3>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">
                                    للاستفسارات السريعة، تواصل معنا مباشرة عبر واتساب
                                </p>
                                <a
                                    href="https://wa.me/201094372339"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-gold-500 text-rich-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-gold-300 transition-colors text-sm rounded-full"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>فتح واتساب</span>
                                </a>
                            </motion.div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-surface-dark/40 border border-gold-500/10 p-8">
                            <h2 className="text-2xl font-playfair font-bold text-white mb-6">أرسل رسالة</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">الاسم *</label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-rich-black border border-white/10 px-4 py-4 text-white focus:border-gold-500 transition-colors outline-none"
                                        placeholder="أدخل اسمك"
                                    />
                                </div>



                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">رقم الهاتف</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-rich-black border border-white/10 px-4 py-4 text-white focus:border-gold-500 transition-colors outline-none"
                                        placeholder="رقم الموبايل (اختياري)"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">الرسالة *</label>
                                    <textarea
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className="w-full bg-rich-black border border-white/10 px-4 py-4 text-white focus:border-gold-500 transition-colors outline-none resize-none"
                                        placeholder="اكتب رسالتك هنا..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-14 bg-gold-500 text-rich-black font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gold-300 transition-colors rounded-full"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>إرسال الرسالة</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
