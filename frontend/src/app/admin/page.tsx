"use client";

import { motion } from "framer-motion";
import { 
    ShoppingBag, 
    Users, 
    TrendingUp, 
    Clock, 
    ArrowUpRight, 
    Package, 
    Calendar,
    Wallet
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const stats = [
        { label: "إجمالي الطلبات", value: "124", icon: ShoppingBag, color: "bg-blue-500/10 text-blue-500", trend: "+12%" },
        { label: "العملاء الجدد", value: "48", icon: Users, color: "bg-gold-500/10 text-gold-500", trend: "+5%" },
        { label: "المبيعات", value: "45,200 ج.م", icon: TrendingUp, color: "bg-green-500/10 text-green-500", trend: "+18%" },
        { label: "طلبات قيد الانتظار", value: "12", icon: Clock, color: "bg-orange-500/10 text-orange-500", trend: "-2%" },
    ];

    const quickActions = [
        { label: "إضافة منتج", href: "/admin/products", icon: Package },
        { label: "إدارة الطلبات", href: "/admin/orders", icon: ShoppingBag },
        { label: "إدارة الحجوزات", href: "/admin/bookings", icon: Calendar },
        { label: "المصاريف", href: "/admin/expenses", icon: Wallet },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
                    <p className="text-gray-400 text-sm mt-1">أهلاً بك مجدداً في نظام إدارة Nine1Luxury</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gold-300">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 rounded-2xl"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-bold text-white px-1">إجراءات سريعة</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {quickActions.map((action, idx) => (
                            <Link key={idx} href={action.href}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 bg-surface-card border border-white/5 rounded-xl hover:border-gold-500/30 transition-all flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-rich-black transition-all">
                                        <action.icon className="w-5 h-5" />
                                    </div>
                                    <span className="flex-1 font-bold text-sm">{action.label}</span>
                                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Placeholder */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white px-1">آخر الطلبات</h2>
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="p-12 text-center">
                            <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">لا توجد طلبات حديثة لعرضها</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}