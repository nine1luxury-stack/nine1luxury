"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, Loader2 } from "lucide-react";
import Cookies from 'js-cookie';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/admin';

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Mock login logic
            if (formData.password === '123456') {
                const mockUser = {
                    id: '1',
                    name: 'Ebeed',
                    email: 'admin@nine1luxury.com',
                    role: 'ADMIN'
                };

                // Set cookies
                Cookies.set('token', 'mock-admin-token', { expires: 1 });
                Cookies.set('role', 'ADMIN', { expires: 1 });
                Cookies.set('user_info', JSON.stringify(mockUser), { expires: 1 });

                // Redirect
                if (from && from !== '/auth/login') {
                    router.push(from);
                } else {
                    router.push('/admin');
                }
                router.refresh();
            } else {
                throw new Error('كلمة المرور غير صحيحة');
            }

        } catch (error) {
            console.error('Login error:', error);
            alert(error instanceof Error ? error.message : 'فشل تسجيل الدخول');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-rich-black flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gold-300/5 rounded-full blur-3xl opacity-30"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-surface-dark/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-playfair font-bold text-white mb-2">تسجيل دخول المسؤول</h1>
                        <p className="text-gray-400 text-sm">يرجى إدخال كلمة المرور للمتابعة.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gold-500 text-rich-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/10 disabled:opacity-70 disabled:cursor-not-allowed"
                            suppressHydrationWarning
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>دخول</span>
                                    <ArrowLeft className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
