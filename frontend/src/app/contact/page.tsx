"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, MessageCircle } from "lucide-react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/>
  </svg>
);

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
            icon: InstagramIcon,
            name: "Instagram",
            handle: "@nine1luxury",
            link: "https://instagram.com/nine1luxury"
        },
        {
            icon: FacebookIcon,
            name: "Facebook",
            handle: "nine1luxury",
            link: "https://www.facebook.com/profile.php?id=61566609135055&sk=reels_tab"
        },
        {
            icon: TikTokIcon,
            name: "TikTok",
            handle: "@nine1luxury",
            link: "https://www.tiktok.com/@nine1luxury"
        },
    ];

    return (
        <main className="min-h-screen bg-rich-black">

            <div className="pt-32 pb-24 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.06 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="section-title text-4xl md:text-5xl mb-4"
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
                                <h2 className="text-xl font-almarai font-bold text-champagne mb-7">معلومات الاتصال</h2>
                                <div className="space-y-3">
                                    {contactInfo.map((info, idx) => (
                                        <motion.a
                                            key={idx}
                                            href={info.link}
                                            initial={{ opacity: 0, x: -4 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.06, delay: idx * 0.02 }}
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
                                <h2 className="text-xl font-almarai font-bold text-champagne mb-5">تابعنا</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {socialMedia.map((social, idx) => (
                                        <motion.a
                                            key={idx}
                                            href={social.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, scale: 0.99 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.05, delay: idx * 0.02 }}
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
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.06, delay: 0.02 }}
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
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.06, delay: 0.02 }}
                            className="glass-card rounded-2xl p-7 md:p-8"
                        >
                            <h2 className="text-xl font-almarai font-bold text-champagne mb-6">أرسل رسالة</h2>
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
