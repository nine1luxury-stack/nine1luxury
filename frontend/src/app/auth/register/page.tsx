"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import Cookies from 'js-cookie';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Set mock token
            Cookies.set('token', 'mock-jwt-token', { expires: 1 });

            // Redirect to home or admin
            router.push('/');
            router.refresh();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-rich-black flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gold-300/5 rounded-full blur-3xl opacity-30"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-surface-dark/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-playfair font-bold text-white mb-2">إنشاء حساب جديد</h1>
                        <p className="text-gray-400 text-sm">انضم إلينا واستمتع بتجربة تسوق فريدة.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-wider">الاسم الكامل</label>
                            <div className="relative">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-12 py-3 text-white focus:border-gold-500 outline-none transition-colors text-right"
                                    placeholder="الاسم"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-wider">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-12 py-3 text-white focus:border-gold-500 outline-none transition-colors text-right"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-wider">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-12 py-3 text-white focus:border-gold-500 outline-none transition-colors text-right"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gold-500 text-rich-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/10 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>إنشاء الحساب</span>
                                    <ArrowLeft className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            لديك حساب بالفعل؟ {' '}
                            <Link href="/auth/login" className="text-white font-bold hover:text-gold-500 transition-colors">
                                تسجيل الدخول
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
