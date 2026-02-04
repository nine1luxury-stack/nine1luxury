import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Music2, Phone, MessageCircle, MapPin, Mail } from "lucide-react";

export function Footer() {
    const socialLinks = [
        { icon: Facebook, href: "https://www.facebook.com/share/178QjvTPUZ/?mibextid=wwXIfr", name: "Facebook" },
        { icon: Instagram, href: "https://www.instagram.com/nine1luxury", name: "Instagram" },
        { icon: Music2, href: "https://www.tiktok.com/@nine1luxury", name: "TikTok" },
        { icon: MessageCircle, href: "https://wa.me/201094372339", name: "WhatsApp" },
    ];

    return (
        <footer className="bg-[#050505] border-t border-gold-500/20 pt-20 pb-8 overflow-hidden relative">
            {/* Background Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 w-full max-w-[1400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 text-center md:text-right" dir="rtl">
                    
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start space-y-8">
                        <div className="text-center md:text-right space-y-6">
                            <Link href="/" className="relative block inline-block">
                                <div className="relative w-40 h-16 transition-transform hover:scale-105 duration-300">
                                    <Image
                                        src="/logo-main.png"
                                        alt="nine1luxury"
                                        fill
                                        className="object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                                    />
                                </div>
                            </Link>
                            <p className="text-gray-400 text-sm leading-8 max-w-[280px]">
                                وجهتك الأولى للملابس الشبابية الفاخرة. نجمع بين الأناقة العصرية والجودة العالية لنمنحك إطلالة تعكس ثقتك وتميزك.
                            </p>
                        </div>
                        
                        {/* Social Icons moved here */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-[1px] hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300"
                                >
                                    <div className="w-full h-full rounded-full bg-[#111] group-hover:bg-gradient-to-br group-hover:from-gold-400 group-hover:to-gold-600 flex items-center justify-center transition-colors duration-300">
                                        <social.icon className="w-4 h-4 text-gold-400 group-hover:text-[#050505] transition-colors duration-300" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-gold-400 font-playfair font-bold mb-8 text-xl tracking-wide relative inline-block">
                            اتصل بنا
                            <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-gold-500/50 rounded-full"></span>
                        </h3>
                        <div className="space-y-6 w-full">
                            <a 
                                href="https://wa.me/201094372339" 
                                target="_blank" 
                                className="flex items-center justify-center md:justify-start gap-4 group p-3 rounded-lg border border-white/5 hover:border-gold-500/20 hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-[#050505] text-gold-400 transition-all duration-300">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <span dir="ltr" className="text-gray-300 font-mono text-lg group-hover:text-gold-400 transition-colors">010 9437 2339</span>
                            </a>
                            
                            <a 
                                href="mailto:nine1luxury@gmail.com" 
                                className="flex items-center justify-center md:justify-start gap-4 group p-3 rounded-lg border border-white/5 hover:border-gold-500/20 hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-[#050505] text-gold-400 transition-all duration-300">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span className="text-gray-300 group-hover:text-gold-400 transition-colors">nine1luxury@gmail.com</span>
                            </a>

                            <div className="flex items-center justify-center md:justify-start gap-4 p-3 rounded-lg border border-white/5 hover:border-gold-500/20 hover:bg-white/5 transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <span className="text-gray-300">مصر، القاهرة</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="mt-20 pt-8 border-t border-white/5 text-center text-sm text-gray-500" dir="rtl">
                    <p>جميع الحقوق محفوظة © Nine1Luxury {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    );
}
