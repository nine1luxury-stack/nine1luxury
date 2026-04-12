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
    Wallet,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch admin stats:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { 
            label: "إجمالي الطلبات", 
            value: stats?.metrics?.totalOrders?.value || 0, 
            icon: ShoppingBag, 
            color: "bg-blue-500/10 text-blue-500", 
            trend: stats?.metrics?.totalOrders?.trend || "0%" 
        },
        { 
            label: "العملاء الجدد", 
            value: stats?.metrics?.newCustomers?.value || 0, 
            icon: Users, 
            color: "bg-gold-500/10 text-gold-500", 
            trend: stats?.metrics?.newCustomers?.trend || "0%" 
        },
        { 
            label: "المبيعات", 
            value: formatPrice(stats?.metrics?.totalSales?.value || 0), 
            icon: TrendingUp, 
            color: "bg-green-500/10 text-green-500", 
            trend: stats?.metrics?.totalSales?.trend || "0%" 
        },
        { 
            label: "طلبات قيد الانتظار", 
            value: stats?.metrics?.pendingOrders?.value || 0, 
            icon: Clock, 
            color: "bg-orange-500/10 text-orange-500", 
            trend: stats?.metrics?.pendingOrders?.trend || "0%" 
        },
    ];

    const quickActions = [
        { label: "إضافة منتج", href: "/admin/products", icon: Package },
        { label: "إدارة الطلبات", href: "/admin/orders", icon: ShoppingBag },
        { label: "تجارب العملاء", href: "/admin/testimonials", icon: Calendar },
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
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="glass-card p-6 rounded-2xl animate-pulse">
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 rounded-xl bg-white/5" />
                                <div className="w-10 h-4 bg-white/5 rounded" />
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="h-3 w-20 bg-white/5 rounded" />
                                <div className="h-6 w-32 bg-white/5 rounded" />
                            </div>
                        </div>
                    ))
                ) : (
                    statCards.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-6 rounded-2xl border border-white/5 hover:border-gold-500/20 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-rose-500'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                            </div>
                        </motion.div>
                    ))
                )}
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

                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white px-1">آخر الطلبات</h2>
                    <div className="glass-card rounded-2xl overflow-hidden min-h-[300px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-30">
                                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                <p className="text-sm">جاري جلب البيانات...</p>
                            </div>
                        ) : stats?.recentOrders?.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {stats.recentOrders.map((order: any) => (
                                    <div key={order.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-ivory/40">
                                                <ShoppingBag className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">
                                                    {order.guestName || order.user?.name || "عميل زائر"}
                                                </p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                                    #{order.id.slice(-6)} • {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gold-300">{formatPrice(order.totalAmount)}</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                                                order.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500' :
                                                'bg-gray-500/10 text-gray-500'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center">
                                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold">لا توجد طلبات حديثة لعرضها</p>
                            </div>
                        )}
                        <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                            <Link href="/admin/orders" className="text-xs font-bold text-ivory/40 hover:text-gold-500 transition-colors uppercase tracking-[0.2em]">
                                عرض جميع الطلبات
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}