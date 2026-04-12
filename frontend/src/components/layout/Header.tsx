"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, Phone, X, ChevronLeft, Instagram, Facebook, Music2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { CartDrawer } from "./CartDrawer";
import { usePathname } from "next/navigation";

export function Header() {
    const { totalItems } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "الرئيسية" },
        { href: "/products", label: "المنتجات" },
        { href: "/offers", label: "العروض" },
        { href: "/booking", label: "الحجز" },
        { href: "/about", label: "عن المتجر" },
        { href: "/contact", label: "تواصل معنا" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? "glass-effect shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
                    : "bg-transparent"
            }`}
        >
            <div className="w-full px-4 lg:px-8 h-20 flex items-center justify-between max-w-[1400px] mx-auto">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden text-ivory/80 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300 active:scale-90"
                    aria-label="Open Menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Logo */}
                <Link href="/" className="relative flex items-center gap-3 group">
                    <div className="relative w-36 h-16 transition-all duration-500 group-hover:scale-105">
                        <Image
                            src="/logo-main.png"
                            alt="nine1luxury"
                            fill
                            className="object-contain"
                            style={{ filter: 'drop-shadow(0 0 8px hsla(37, 48%, 48%, 0.15))' }}
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-7 text-[0.82rem] font-medium uppercase">
                    {navLinks.filter(l => l.href !== '/booking').map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative py-2 transition-all duration-300 font-amiri font-bold ${
                                isActive(link.href)
                                    ? "text-gold-300"
                                    : "text-ivory/60 hover:text-ivory"
                            }`}
                        >
                            {link.label}
                            {isActive(link.href) && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3 text-ivory">
                    <Link href="/checkout" className="relative hover:text-gold-300 transition-colors p-2 hover:bg-white/5 rounded-xl">
                        <ShoppingBag className="w-5 h-5" />
                        <AnimatePresence>
                            {totalItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-0.5 -right-0.5 bg-gold-500 text-rich-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_12px_hsla(37,48%,48%,0.4)]"
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                    <div className="w-px h-5 bg-ivory/10 mx-1 hidden sm:block" />
                    <a href="tel:01094372339" className="hidden sm:flex items-center gap-2 bg-white/[0.04] hover:bg-gold-500 border border-ivory/10 hover:border-gold-500 px-5 py-2.5 rounded-full text-ivory/70 hover:text-rich-black transition-all duration-400 text-sm font-bold group">
                        <Phone className="w-3.5 h-3.5 group-hover:animate-bounce" />
                        <span>طلب سريع</span>
                    </a>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-50 bg-rich-black/85 backdrop-blur-xl lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 right-0 z-50 w-[82%] max-w-sm bg-surface-dark/98 backdrop-blur-2xl border-l border-ivory/[0.06] p-6 lg:hidden flex flex-col shadow-[-25px_0_70px_rgba(0,0,0,0.8)]"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="relative flex items-center gap-3 group">
                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gold-500/20 bg-rich-black p-1 shadow-[0_0_20px_hsla(37,48%,48%,0.1)]">
                                        <Image src="/logo-main.png" alt="nine1luxury" fill className="object-contain" />
                                    </div>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center text-ivory/40 hover:text-ivory hover:bg-white/5 rounded-xl transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <nav className="flex-1 flex flex-col gap-1.5">
                                {navLinks.filter(l => l.href !== '/booking').map((link, idx) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`text-base font-bold uppercase flex items-center justify-between group px-4 py-3.5 rounded-xl transition-all duration-300 ${
                                                isActive(link.href)
                                                    ? "text-gold-300 bg-gold-500/[0.07] border border-gold-500/15"
                                                    : "text-ivory/70 hover:text-ivory hover:bg-white/[0.03]"
                                            }`}
                                        >
                                            {link.label}
                                            <ChevronLeft className={`w-4 h-4 transition-all ${isActive(link.href) ? 'text-gold-500' : 'text-ivory/15 group-hover:text-ivory/40'}`} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-auto pt-6 border-t border-ivory/[0.06] space-y-4"
                            >
                                <p className="text-[10px] text-ivory/25 font-bold uppercase mb-3 tracking-widest">تابعنا على</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61566609135055", name: "فيسبوك" },
                                        { icon: Instagram, href: "https://www.instagram.com/nine1luxury", name: "انستجرام" },
                                        { icon: Music2, href: "https://www.tiktok.com/@nine1luxury", name: "تيك توك" },
                                        { icon: MessageCircle, href: "https://wa.me/201094372339", name: "واتساب" },
                                    ].map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 text-ivory/35 hover:text-gold-300 transition-all bg-white/[0.02] rounded-xl p-2.5 hover:bg-gold-500/[0.06] border border-transparent hover:border-gold-500/15"
                                        >
                                            <social.icon className="w-4 h-4" />
                                            <span className="text-xs font-bold">{social.name}</span>
                                        </a>
                                    ))}
                                </div>
                                <a
                                    href="tel:01094372339"
                                    className="flex items-center justify-center gap-2 text-rich-black bg-gold-500 hover:bg-gold-400 transition-all rounded-xl p-3.5 mt-3 font-bold text-sm shadow-[0_8px_24px_hsla(37,48%,48%,0.2)]"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>اتصل الآن:</span>
                                    <span dir="ltr" className="font-mono">010 9437 2339</span>
                                </a>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Cart Drawer */}
            <CartDrawer />
        </motion.header>
    );
}
