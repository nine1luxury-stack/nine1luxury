import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Music2, Phone, MessageCircle, MapPin, Mail } from "lucide-react";

export function Footer() {
    const socialLinks = [
        { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61566609135055&sk=reels_tab", name: "Facebook" },
        { icon: Instagram, href: "https://www.instagram.com/nine1luxury", name: "Instagram" },
        { icon: Music2, href: "https://www.tiktok.com/@nine1luxury", name: "TikTok" },
        { icon: MessageCircle, href: "https://wa.me/201094372339", name: "WhatsApp" },
    ];

    const quickLinks = [
        { href: "/products", label: "المنتجات" },
        { href: "/offers", label: "العروض" },
        { href: "/booking", label: "الحجز" },
        { href: "/about", label: "عن المتجر" },
        { href: "/contact", label: "تواصل معنا" },
        { href: "/shipping", label: "سياسة الشحن" },
        { href: "/policy", label: "سياسة الاستبدال" },
    ];

    return (
        <footer className="bg-[hsl(225,14%,4%)] border-t border-ivory/[0.04] pt-20 pb-8 overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full blur-[180px] pointer-events-none" style={{ background: 'hsla(37, 48%, 48%, 0.03)' }} />

            <div className="container mx-auto px-6 relative z-10 w-full max-w-[1400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center md:text-right" dir="rtl">

                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start space-y-6 lg:col-span-1">
                        <Link href="/" className="relative block">
                            <div className="relative w-36 h-14 transition-all duration-300 hover:drop-shadow-[0_0_12px_hsla(37,48%,48%,0.2)]">
                                <Image
                                    src="/logo-main.png"
                                    alt="nine1luxury"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-ivory/70 text-sm leading-8 max-w-[280px]">
                            وجهتك الأولى للملابس الشبابية الفاخرة. نجمع بين الأناقة العصرية والجودة العالية لنمنحك إطلالة تعكس ثقتك وتميزك.
                        </p>

                        {/* Social Icons */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-10 h-10 rounded-xl bg-white/[0.03] border border-ivory/[0.06] hover:border-gold-500/40 hover:bg-gold-500 flex items-center justify-center transition-all duration-400 hover:shadow-[0_0_16px_hsla(37,48%,48%,0.2)] hover:scale-105"
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-4 h-4 text-ivory/60 group-hover:text-rich-black transition-colors duration-300" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-champagne font-bold mb-8 text-base relative inline-block">
                            روابط سريعة
                            <span className="absolute -bottom-2 right-0 w-7 h-0.5 bg-gold-500/40 rounded-full" />
                        </h3>
                        <nav className="space-y-3.5">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block text-ivory/70 hover:text-gold-300 transition-all duration-300 text-sm hover:translate-x-[-3px] transform"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-champagne font-bold mb-8 text-base relative inline-block">
                            اتصل بنا
                            <span className="absolute -bottom-2 right-0 w-7 h-0.5 bg-gold-500/40 rounded-full" />
                        </h3>
                        <div className="space-y-3 w-full">
                            <a
                                href="https://wa.me/201094372339"
                                target="_blank"
                                className="flex items-center justify-center md:justify-start gap-3 group p-3 rounded-xl hover:bg-white/[0.02] transition-all duration-300"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gold-500/[0.07] flex items-center justify-center group-hover:bg-gold-500 text-gold-400 group-hover:text-rich-black transition-all duration-300">
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                                <span dir="ltr" className="text-ivory/80 font-mono text-sm group-hover:text-gold-300 transition-colors">010 9437 2339</span>
                            </a>

                            <a
                                href="mailto:nine1luxury@gmail.com"
                                className="flex items-center justify-center md:justify-start gap-3 group p-3 rounded-xl hover:bg-white/[0.02] transition-all duration-300"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gold-500/[0.07] flex items-center justify-center group-hover:bg-gold-500 text-gold-400 group-hover:text-rich-black transition-all duration-300">
                                    <Mail className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-ivory/80 text-sm group-hover:text-gold-300 transition-colors">nine1luxury@gmail.com</span>
                            </a>

                            <div className="flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-gold-500/[0.07] flex items-center justify-center text-gold-400">
                                    <MapPin className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-ivory/80 text-sm">المحلة، مصر</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-champagne font-bold mb-8 text-base relative inline-block">
                            ابقَ على اطلاع
                            <span className="absolute -bottom-2 right-0 w-7 h-0.5 bg-gold-500/40 rounded-full" />
                        </h3>
                        <p className="text-ivory/70 text-sm mb-5 leading-relaxed">
                            اشترك ليصلك كل جديد وعروض حصرية
                        </p>
                        <div className="w-full max-w-[280px] space-y-2.5">
                            <input
                                type="email"
                                placeholder="بريدك الإلكتروني"
                                className="luxury-input text-sm py-3 text-white"
                            />
                            <button className="w-full bg-gold-500 hover:bg-gold-400 text-rich-black font-bold py-3 rounded-xl text-sm transition-all duration-400 hover:shadow-[0_8px_24px_hsla(37,48%,48%,0.2)]">
                                اشتراك
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="mt-16 pt-8 border-t border-ivory/[0.04] flex flex-col items-center justify-center gap-6" dir="rtl">
                    <div className="flex items-center gap-8 text-[11px] text-ivory/40 uppercase tracking-wider font-bold">
                        <Link href="/policy" className="hover:text-gold-300 transition-colors">سياسة الاستبدال</Link>
                        <Link href="/shipping" className="hover:text-gold-300 transition-colors">سياسة الشحن</Link>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-2 text-xs">
                        <p className="text-ivory/50 font-medium">
                            Nine1Luxury جميع الحقوق محفوظة © 2026 | 
                        </p>
                        <a 
                            href="https://www.instagram.com/_bebo9__?igsh=N3JhankyYTZmNTBy&utm_source=qr" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-ivory/40 hover:text-gold-500 transition-all duration-300 group font-bold"
                        >
                            <span>by IbrahimElseginy || SW</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
