import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail } from "lucide-react";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/>
  </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export function Footer() {
    const socialLinks = [
        { icon: FacebookIcon, href: "https://www.facebook.com/profile.php?id=61566609135055&sk=reels_tab", name: "Facebook" },
        { icon: InstagramIcon, href: "https://www.instagram.com/nine1luxury", name: "Instagram" },
        { icon: TikTokIcon, href: "https://www.tiktok.com/@nine1luxury", name: "TikTok" },
        { icon: WhatsAppIcon, href: "https://wa.me/201094372339", name: "WhatsApp" },
    ];

    const quickLinks = [
        { href: "/products", label: "المنتجات" },
        { href: "/offers", label: "العروض" },
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
                    
                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-ivory/50" dir="ltr">
                        <span className="font-medium" dir="rtl">
                            جميع الحقوق محفوظة © Nine1Luxury 2026
                        </span>
                        <span className="opacity-70">|</span>
                        <a 
                            href="https://www.instagram.com/_bebo9__?igsh=N3JhankyYTZmNTBy&utm_source=qr" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-ivory/40 hover:text-gold-500 transition-all duration-300 font-bold"
                        >
                            by IbrahimElseginy || SW
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
