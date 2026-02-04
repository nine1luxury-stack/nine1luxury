"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, Phone, X, ChevronLeft, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { CartDrawer } from "./CartDrawer";

export function Header() {
    const { totalItems } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    useEffect(() => {
        // Any initial data fetching or side effects
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-rich-black/80 backdrop-blur-md border-b border-gold-500/20"
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Logo & Name */}
                <Link href="/" className="relative flex items-center gap-3 group">
                    <div className="relative w-40 h-20">
                        <Image
                            src="/logo-main.png"
                            alt="nine1luxury"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-10 text-sm font-medium uppercase tracking-wider">
                    <Link href="/" className="text-white hover:text-gold-300 transition-colors font-amiri font-bold">
                        الرئيسية
                    </Link>
                    <Link href="/products" className="text-white hover:text-gold-300 transition-colors font-amiri font-bold">
                        المنتجات
                    </Link>
                    <Link href="/booking" className="text-white hover:text-gold-300 transition-colors font-amiri font-bold">
                        الحجز
                    </Link>
                    <Link href="/about" className="text-white hover:text-gold-300 transition-colors font-amiri font-bold">
                        عن المتجر
                    </Link>
                    <Link href="/contact" className="text-white hover:text-gold-300 transition-colors">
                        تواصل معنا
                    </Link>
                </nav>

                <div className="flex items-center gap-4 text-white">

                    <Link href="/checkout" className="relative hover:text-gold-300 transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gold-500 text-rich-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <div className="w-px h-6 bg-gold-500/20 mx-2 hidden sm:block" />
                    <a href="tel:01094372339" className="hidden sm:flex items-center gap-2 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 px-4 py-2 rounded-full text-gold-300 transition-all text-sm font-bold">
                        <Phone className="w-4 h-4" />
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
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            initial={{ y: "-100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-0 z-50 w-full h-full bg-rich-black/95 backdrop-blur-xl border-b border-gold-500/20 p-6 lg:hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <Link href="/" className="relative flex items-center gap-3 group">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gold-500/20 bg-gradient-to-br from-white to-gold-50/50 p-1 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                                        <Image
                                            src="/logo-main.png"
                                            alt="nine1luxury"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>


                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex-1 flex flex-col gap-6">
                                <Link
                                    href="/products"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-bold text-white hover:text-gold-300 transition-colors uppercase tracking-wider flex items-center justify-between group"
                                >
                                    المنتجات
                                    <ChevronLeft className="w-5 h-5 text-gold-500/50 group-hover:text-gold-500 transition-colors" />
                                </Link>

                                <Link
                                    href="/booking"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-bold text-white hover:text-gold-300 transition-colors uppercase tracking-wider flex items-center justify-between group"
                                >
                                    الحجز
                                    <ChevronLeft className="w-5 h-5 text-gold-500/50 group-hover:text-gold-500 transition-colors" />
                                </Link>

                                <Link
                                    href="/contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-bold text-white hover:text-gold-300 transition-colors uppercase tracking-wider flex items-center justify-between group"
                                >
                                    تواصل معنا
                                    <ChevronLeft className="w-5 h-5 text-gold-500/50 group-hover:text-gold-500 transition-colors" />
                                </Link>
                            </nav>

                            <div className="mt-auto pt-8 border-t border-gold-500/10 space-y-4">
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-gray-400 hover:text-gold-300 transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                    <span className="text-sm font-bold uppercase tracking-wider">تابعنا انستجرام</span>
                                </a>
                                <a
                                    href="https://wa.me/201005783576"
                                    target="_blank"
                                    className="flex items-center gap-3 text-gray-400 hover:text-gold-300 transition-colors"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span className="text-sm font-bold uppercase tracking-wider">مساعدة</span>
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Cart Drawer */}
            <CartDrawer />
        </motion.header>
    );
}
