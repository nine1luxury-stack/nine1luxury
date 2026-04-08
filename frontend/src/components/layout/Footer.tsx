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
        <footer className="bg-[#030303] border-t border-gold-500/10 pt-20 pb-8 overflow-hidden relative">
            {/* Background Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/3 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 w-full max-w-[1400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center md:text-right" dir="rtl">

                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start space-y-6 lg:col-span-1">
                        <Link href="/" className="relative block">
                            <div className="relative w-40 h-16 transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(174,132,57,0.3)]">
                                <Image
                                    src="/logo-main.png"
                                    alt="nine1luxury"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-gray-500 text-sm leading-8 max-w-[280px]">
                            وجهتك الأولى للملابس الشبابية الفاخرة. نجمع بين الأناقة العصرية والجودة العالية لنمنحك إطلالة تعكس ثقتك وتميزك.
                        </p>

                        {/* Social Icons */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-gold-500/50 hover:bg-gold-500 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(174,132,57,0.3)] hover:scale-110"
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-4 h-4 text-gray-400 group-hover:text-rich-black transition-colors duration-300" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-gold-400 font-playfair font-bold mb-8 text-lg relative inline-block">
                            روابط سريعة
                            <span className="absolute -bottom-2 right-0 w-8 h-0.5 bg-gold-500/50 rounded-full" />
                        </h3>
                        <nav className="space-y-4">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block text-gray-400 hover:text-gold-300 transition-colors duration-300 text-sm hover:translate-x-[-4px] transform"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-gold-400 font-playfair font-bold mb-8 text-lg relative inline-block">
                            اتصل بنا
                            <span className="absolute -bottom-2 right-0 w-8 h-0.5 bg-gold-500/50 rounded-full" />
                        </h3>
                        <div className="space-y-4 w-full">
                            <a
                                href="https://wa.me/201094372339"
                                target="_blank"
                                className="flex items-center justify-center md:justify-start gap-3 group p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500 text-gold-400 group-hover:text-rich-black transition-all duration-300">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span dir="ltr" className="text-gray-400 font-mono text-sm group-hover:text-gold-300 transition-colors">010 9437 2339</span>
                            </a>

                            <a
                                href="mailto:nine1luxury@gmail.com"
                                className="flex items-center justify-center md:justify-start gap-3 group p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500 text-gold-400 group-hover:text-rich-black transition-all duration-300">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-gray-400 text-sm group-hover:text-gold-300 transition-colors">nine1luxury@gmail.com</span>
                            </a>

                            <div className="flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl">
                                <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-gray-400 text-sm">المحلة، مصر</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-gold-400 font-playfair font-bold mb-8 text-lg relative inline-block">
                            ابقَ على اطلاع
                            <span className="absolute -bottom-2 right-0 w-8 h-0.5 bg-gold-500/50 rounded-full" />
                        </h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            اشترك ليصلك كل جديد وعروض حصرية
                        </p>
                        <div className="w-full max-w-[280px] space-y-3">
                            <input
                                type="email"
                                placeholder="بريدك الإلكتروني"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-gold-500/50 transition-all outline-none"
                            />
                            <button className="w-full bg-gold-500 hover:bg-gold-400 text-rich-black font-bold py-3 rounded-xl text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(174,132,57,0.3)]">
                                اشتراك
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600" dir="rtl">
                    <p>جميع الحقوق محفوظة © Nine1Luxury {new Date().getFullYear()}</p>
                    <div className="flex items-center gap-6">
                        <Link href="/policy" className="hover:text-gold-300 transition-colors">سياسة الاستبدال</Link>
                        <Link href="/shipping" className="hover:text-gold-300 transition-colors">سياسة الشحن</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
