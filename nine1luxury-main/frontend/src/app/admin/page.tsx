"use client";

import { motion } from "framer-motion";
import {
    Users,
    ShoppingBag,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { Order } from "@/lib/api";

import { useProducts } from "@/context/ProductContext";

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const { products } = useProducts();

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
        const previousOrders = [...orders];
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error("فشل تحديث الحالة");
        } catch (e) {
            console.error(e);
            alert("حدث خطأ أثناء تحديث الحالة");
            setOrders(previousOrders);
        }
    };

    // Calculate dynamic stats
    const stats = useMemo(() => {
        const completedOrders = orders.filter(o => o.status === 'DELIVERED');
        const pendingOrders = orders.filter(o => o.status === 'PENDING');

        const totalSales = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const newOrdersCount = pendingOrders.length;

        // Simple unique customer count based on guestName
        const uniqueCustomers = new Set(orders.map(o => o.guestName || o.User?.name)).size;

        return [
            {
                name: "إجمالي المبيعات",
                value: totalSales,
                change: "+12%", // Placeholder for now
                isUp: true,
                icon: DollarSign,
                color: "text-green-500",
                bg: "bg-green-500/10",
                href: "/admin/orders"
            },
            {
                name: "الطلبات الجديدة",
                value: newOrdersCount,
                change: "نشط",
                isUp: true,
                icon: ShoppingBag,
                color: "text-gold-500",
                bg: "bg-gold-500/10",
                href: "/admin/orders"
            },

            {
                name: "العملاء",
                value: uniqueCustomers,
                change: "الكل",
                isUp: true,
                icon: Users,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
                href: "/admin/customers"
            },
        ];
    }, [orders]);

    // Calculate Best Sellers
    const bestSellers = useMemo(() => {
        const productSales: { [key: string]: number } = {};

        orders.forEach(order => {
            if (order.status !== 'CANCELLED' && Array.isArray(order.items)) {
                order.items.forEach((item: OrderItem) => {
                    const pid = item.productId;
                    productSales[pid] = (productSales[pid] || 0) + (item.quantity || 0);
                });
            }
        });

        return Object.entries(productSales)
            .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
            .slice(0, 5)
            .map(([productId, quantity]) => {
                const product = products.find(p => String(p.id) === String(productId));
                return {
                    id: productId,
                    name: product?.name || 'منتج غير معروف',
                    price: product?.price || 0,
                    image: product?.images?.[0]?.url || '',
                    quantity
                };
            });
    }, [orders, products]);

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">نظرة عامة</h1>
                    <p className="text-gray-400 text-sm mt-1">أهلاً بك مجدداً، إليك ملخص نشاط المتجر اليوم.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Link href={stat.href} key={stat.name} className="block">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-surface-dark border border-white/5 p-6 rounded-2xl hover:border-gold-500/20 transition-all group cursor-pointer h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn("p-3 rounded-xl", stat.bg)}>
                                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-bold",
                                    stat.isUp ? "text-green-500" : "text-red-500"
                                )}>
                                    {stat.change}
                                    {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 text-sm">{stat.name}</p>
                                <h3 className="text-2xl font-bold text-white">
                                    {stat.name === "إجمالي المبيعات" ? formatPrice(stat.value as number) : stat.value}
                                </h3>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-surface-dark border border-white/5 rounded-2xl p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white">آخر الطلبات</h2>
                    </div>
                    <div className="overflow-x-auto -mx-2">
                        {orders.length === 0 ? (
                            <div className="text-center py-20">
                                <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">لا توجد طلبات حديثة اليوم</p>
                            </div>
                        ) : (
                            <table className="w-full text-right border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/5">
                                        <th className="px-4 py-4 font-bold">رقم الطلب</th>
                                        <th className="px-4 py-4 font-bold">العميل</th>
                                        <th className="px-4 py-4 font-bold">الإجمالي</th>
                                        <th className="px-4 py-4 font-bold text-center">الحالة</th>
                                        <th className="px-4 py-4 font-bold">التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {orders.slice(0, 8).map((order) => (
                                        <tr key={order.id} className="group hover:bg-white/[0.02] transition-all">
                                            <td className="px-4 py-5">
                                                <span className="text-xs text-gray-400 font-mono group-hover:text-gold-500/80 transition-colors uppercase">
                                                    #{String(order.id)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-white font-bold group-hover:text-gold-300 transition-colors">
                                                        {order.guestName || order.user?.name || 'عميل مجهول'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-600 font-mono mt-0.5">{order.guestPhone || 'بدون رقم'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-gold-300 font-bold">{formatPrice(order.totalAmount)}</span>
                                                    <span className="text-[9px] text-gray-600 uppercase tracking-tighter">{order.paymentMethod === 'COD' ? 'دفع عند الاستلام' : 'دفع أونلاين'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 text-center">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value as any)}
                                                    className={cn(
                                                        "text-[10px] px-3 py-1.5 rounded-full font-bold uppercase cursor-pointer outline-none border transition-all text-center mx-auto block",
                                                        order.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20' :
                                                            order.status === 'CONFIRMED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500 hover:bg-blue-500/20' :
                                                                order.status === 'SHIPPED' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500 hover:bg-purple-500/20' :
                                                                    order.status === 'DELIVERED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20' :
                                                                        'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'
                                                    )}
                                                >
                                                    <option value="PENDING" className="bg-rich-black text-gray-300">قيد الانتظار</option>
                                                    <option value="CONFIRMED" className="bg-rich-black text-blue-300">تم التأكيد</option>
                                                    <option value="SHIPPED" className="bg-rich-black text-purple-300">تم الشحن</option>
                                                    <option value="DELIVERED" className="bg-rich-black text-green-300">تم التسليم</option>
                                                    <option value="CANCELLED" className="bg-rich-black text-red-300">ملغي</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-5">
                                                <span className="text-[11px] text-gray-500 font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Best Sellers */}
                <div className="bg-surface-dark border border-white/5 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-8">الأكثر مبيعاً</h2>
                    <div className="space-y-6">
                        {bestSellers.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">لا توجد بيانات</div>
                        ) : (
                            bestSellers.map((product) => (
                                <div key={product.id} className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                                        <Image
                                            src={product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=48&h=48&q=80'}
                                            alt={product.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-bold text-sm truncate">{product.name}</h4>
                                        <p className="text-gold-500 text-xs font-mono">{formatPrice(Number(product.price))}</p>
                                    </div>
                                    <div className="text-gray-400 text-xs font-bold">
                                        {product.quantity} مبيعة
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
