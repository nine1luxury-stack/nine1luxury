"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook, Send, MessageCircle, Music2 } from "lucide-react";

    export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: "",
    });
    const [isSending, setIsSending] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        const message = `*رسالة جديدة من موقع nine1luxury*%0A%0A\
*من:* ${formData.name}%0A\
*الهاتف:* ${formData.phone}%0A%0A\
*الرسالة:*%0A${formData.message}`;

        const whatsappUrl = `https://wa.me/201094372339?text=${message}`;
        window.open(whatsappUrl, "_blank");
        setTimeout(() => setIsSending(false), 1000);
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
            value: "المحلة، مصر",
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
            link: "https://www.facebook.com/profile.php?id=61566609135055&sk=reels_tab"
        },
        {
            icon: Music2,
            name: "TikTok",
            handle: "@nine1luxury",
            link: "https://www.tiktok.com/@nine1luxury"
        },
    ];

    return (
        <main className="min-h-screen bg-rich-black">

            <div className="pt-32 pb-24 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="section-title text-4xl md:text-6xl mb-4"
                        >
                            تواصل معنا
                        </motion.h1>
                        <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mx-auto mb-6" />
                        <p className="text-ivory/30 max-w-2xl mx-auto leading-relaxed">
                            نحن هنا للإجابة على استفساراتك ومساعدتك. تواصل معنا عبر أي من الوسائل التالية.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-playfair font-bold text-champagne mb-7">معلومات الاتصال</h2>
                                <div className="space-y-3">
                                    {contactInfo.map((info, idx) => (
                                        <motion.a
                                            key={idx}
                                            href={info.link}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.08 }}
                                            className="flex items-start gap-4 p-4 glass-card rounded-2xl group"
                                        >
                                            <div className="w-11 h-11 rounded-xl bg-gold-500/[0.07] flex items-center justify-center shrink-0 group-hover:bg-gold-500 transition-all duration-400 group-hover:shadow-[0_0_16px_hsla(37,48%,48%,0.2)]">
                                                <info.icon className="w-4.5 h-4.5 text-gold-500 group-hover:text-rich-black transition-colors" />
                                            </div>
                                            <div>
                                                <h3 className="text-ivory font-bold mb-1 text-sm">{info.title}</h3>
                                                <p className="text-ivory/30 text-sm">{info.value}</p>
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h2 className="text-xl font-playfair font-bold text-champagne mb-5">تابعنا</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {socialMedia.map((social, idx) => (
                                        <motion.a
                                            key={idx}
                                            href={social.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.08 }}
                                            className="flex items-center justify-center gap-2.5 px-4 py-3 glass-card rounded-xl group hover:scale-[1.02] transition-all duration-300"
                                        >
                                            <social.icon className="w-4.5 h-4.5 text-gold-500" />
                                            <div className="text-right">
                                                <p className="text-ivory/80 text-sm font-bold">{social.name}</p>
                                                <p className="text-ivory/20 text-xs">{social.handle}</p>
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* WhatsApp Quick Contact */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-6 glass-card rounded-2xl border-gold-500/15"
                                style={{ borderColor: 'hsla(37, 48%, 48%, 0.12)' }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-[#25D366]" />
                                    </div>
                                    <h3 className="text-ivory font-bold text-sm">تواصل سريع عبر واتساب</h3>
                                </div>
                                <p className="text-ivory/25 text-sm mb-4">
                                    للاستفسارات السريعة، تواصل معنا مباشرة عبر واتساب
                                </p>
                                <a
                                    href="https://wa.me/201094372339"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-bold uppercase hover:bg-[#20BD5A] transition-all text-sm rounded-full shadow-[0_6px_20px_rgba(37,211,102,0.25)] hover:shadow-[0_8px_28px_rgba(37,211,102,0.35)] hover:scale-[1.02]"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>فتح واتساب</span>
                                </a>
                            </motion.div>
                        </div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card rounded-2xl p-7 md:p-8"
                        >
                            <h2 className="text-xl font-playfair font-bold text-champagne mb-6">أرسل رسالة</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-ivory/25 uppercase font-bold tracking-wider">الاسم *</label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="luxury-input"
                                        placeholder="أدخل اسمك"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-ivory/25 uppercase font-bold tracking-wider">رقم الهاتف</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="luxury-input"
                                        placeholder="رقم الموبايل (واتساب)"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-ivory/25 uppercase font-bold tracking-wider">الرسالة *</label>
                                    <textarea
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={5}
                                        className="luxury-input resize-none"
                                        placeholder="اكتب رسالتك هنا..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{isSending ? "جاري الإرسال..." : "إرسال الرسالة"}</span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>


        </main>
    );
}
