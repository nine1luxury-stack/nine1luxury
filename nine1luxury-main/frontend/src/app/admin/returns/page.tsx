"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Plus, X, Loader2 } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Order, OrderItem, ReturnRequest } from "@/lib/api";



export default function ReturnsPage() {
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Add Return State
    const [lookupOrderId, setLookupOrderId] = useState("");
    const [orderLookupLoading, setOrderLookupLoading] = useState(false);
    const [foundOrder, setFoundOrder] = useState<Order | null>(null);
    const [selectedItems, setSelectedItems] = useState<{
        orderItemId: string;
        productId: string;
        variantId?: string;
        quantity: number;
        type: string; // VALID, DAMAGED, WASH, REPACKAGE
        notes: string;
    }[]>([]);

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        try {
            const res = await fetch('/api/returns');
            if (res.ok) {
                const data = await res.json();
                setReturns(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await fetch(`/api/returns/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchReturns();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLookupOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lookupOrderId) return;
        setOrderLookupLoading(true);
        setFoundOrder(null);
        setSelectedItems([]);
        try {
            const res = await fetch(`/api/orders/${lookupOrderId}`);
            if (res.ok) {
                const data = await res.json();
                setFoundOrder(data);
            } else {
                alert('الطلب غير موجود');
            }
        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء البحث عن الطلب');
        } finally {
            setOrderLookupLoading(false);
        }
    };

    const toggleItemSelection = (item: OrderItem, quantity: number) => {
        setSelectedItems(prev => {
            const exists = prev.find(i => i.orderItemId === item.id);
            if (exists) {
                return prev.filter(i => i.orderItemId !== item.id);
            } else {
                return [...prev, {
                    orderItemId: item.id,
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: quantity,
                    type: 'VALID',
                    notes: ''
                }];
            }
        });
    };

    const updateSelectedItem = (orderItemId: string, field: string, value: string | number) => {
        setSelectedItems(prev => prev.map(item =>
            item.orderItemId === orderItemId ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmitReturn = async () => {
        if (selectedItems.length === 0 || !foundOrder) {
            alert('يرجى اختيار منتج واحد على الأقل للاسترجاع');
            return;
        }

        try {
            const promises = selectedItems.map(item =>
                fetch('/api/returns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: foundOrder.id,
                        orderItemId: item.orderItemId,
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: Number(item.quantity),
                        type: item.type,
                        notes: item.notes,
                        status: 'APPROVED'
                    })
                })
            );

            await Promise.all(promises);

            setIsAddModalOpen(false);
            setFoundOrder(null);
            setSelectedItems([]);
            setLookupOrderId("");
            fetchReturns();
            alert('تمت إضافة المرتجع بنجاح');

        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء إنشاء المرتجع');
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">المرتجعات</h1>
                    <p className="text-gray-400 text-sm mt-1">إدارة طلبات الاسترجاع وتصنيف حالة المنتجات.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gold-500 text-rich-black px-6 py-3 rounded-xl font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/10"
                >
                    <Plus className="w-4 h-4" />
                    <span>إضافة مرتجع جديد</span>
                </button>
            </div>

            <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                                <th className="px-6 py-5">المعرف</th>
                                <th className="px-6 py-5">رقم الطلب</th>
                                <th className="px-6 py-5">المنتج</th>
                                <th className="px-6 py-5">الحالة (المخزن)</th>
                                <th className="px-6 py-5">حالة الطلب</th>
                                <th className="px-6 py-5">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {returns.map((ret) => (
                                <tr key={ret.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-mono text-gray-400">#{String(ret.id)}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-mono text-gold-500">{ret.orderId ? '#' + String(ret.orderId) : '-'}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-white font-bold text-sm">
                                            {ret.orderItem?.productId || 'Product'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            الكمية: {ret.quantity}
                                        </p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "text-xs px-2 py-1 rounded font-bold uppercase",
                                            ret.type === 'VALID' ? "bg-green-500/10 text-green-500" :
                                                ret.type === 'DAMAGED' ? "bg-red-500/10 text-red-500" :
                                                    ret.type === 'WASH' ? "bg-blue-500/10 text-blue-500" :
                                                        "bg-yellow-500/10 text-yellow-500"
                                        )}>
                                            {ret.type === 'VALID' ? 'صالح للبيع' :
                                                ret.type === 'DAMAGED' ? 'تالف' :
                                                    ret.type === 'WASH' ? 'يحتاج غسيل' : 'إعادة تغليف'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "text-xs font-bold",
                                            ret.status === 'APPROVED' ? "text-green-500" :
                                                ret.status === 'REJECTED' ? "text-red-500" : "text-yellow-500"
                                        )}>
                                            {ret.status === 'APPROVED' ? 'مقبول' : ret.status === 'REJECTED' ? 'مرفوض' : 'قيد الانتظار'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        {ret.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(ret.id, 'APPROVED')}
                                                    className="p-2 text-green-500 hover:bg-green-500/10 rounded"
                                                    title="الموافقة وإضافة للمخزن"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(ret.id, 'REJECTED')}
                                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                                                    title="رفض"
                                                >
                                                    <AlertCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {returns.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">
                                        لا توجد مرتجعات.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface-dark border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-rich-black/50">
                                <h2 className="text-xl font-bold text-white font-playfair">إضافة مرتجع جديد</h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                                <form onSubmit={handleLookupOrder} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="أدخل رقم الطلب للبحث..."
                                        value={lookupOrderId}
                                        onChange={(e) => setLookupOrderId(e.target.value)}
                                        className="flex-1 bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={orderLookupLoading}
                                        className="bg-gold-500 text-rich-black px-6 py-3 rounded-lg font-bold hover:bg-gold-300 disabled:opacity-50"
                                    >
                                        {orderLookupLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'بحث'}
                                    </button>
                                </form>

                                {foundOrder && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-gray-400">الاسم</p>
                                                <p className="text-white font-bold">{foundOrder.guestName || 'زائر'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">تاريخ الطلب</p>
                                                <p className="text-white font-mono text-sm">{new Date(foundOrder.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">الإجمالي</p>
                                                <p className="text-gold-500 font-bold">{formatPrice(foundOrder.totalAmount || 0)}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">منتجات الطلب</h3>
                                        <div className="space-y-3">
                                            {foundOrder.items.map((item) => {
                                                const isSelected = selectedItems.some(i => i.orderItemId === item.id);
                                                const selectedData = selectedItems.find(i => i.orderItemId === item.id);

                                                return (
                                                    <div key={item.id} className={cn(
                                                        "border rounded-xl p-4 transition-all",
                                                        isSelected ? "bg-gold-500/5 border-gold-500" : "bg-rich-black border-white/10"
                                                    )}>
                                                        <div className="flex items-start gap-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => toggleItemSelection(item, item.quantity)}
                                                                className="mt-1 w-5 h-5 accent-gold-500 bg-rich-black border-gray-600 rounded focus:ring-gold-500"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex justify-between">
                                                                    <p className="text-white font-bold text-sm">Product ID: {String(item.productId)}</p>
                                                                    <p className="text-white font-mono">{formatPrice(item.price)}</p>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">الكمية المطلوبة: {item.quantity}</p>

                                                                {isSelected && selectedData && (
                                                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in slide-in-from-top-2">
                                                                        <div>
                                                                            <label className="block text-[10px] text-gray-400 mb-1">الكمية المرتجعة</label>
                                                                            <input
                                                                                type="number"
                                                                                min="1"
                                                                                max={item.quantity}
                                                                                value={selectedData.quantity}
                                                                                onChange={(e) => updateSelectedItem(item.id, 'quantity', e.target.value)}
                                                                                className="w-full bg-surface-dark border border-white/10 rounded px-2 py-1.5 text-white text-sm"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[10px] text-gray-400 mb-1">حالة المنتج</label>
                                                                            <select
                                                                                value={selectedData.type}
                                                                                onChange={(e) => updateSelectedItem(item.id, 'type', e.target.value)}
                                                                                className="w-full bg-surface-dark border border-white/10 rounded px-2 py-1.5 text-white text-sm"
                                                                            >
                                                                                <option value="VALID">صالح للبيع</option>
                                                                                <option value="DAMAGED">تالف</option>
                                                                                <option value="WASH">يحتاج غسيل</option>
                                                                                <option value="REPACKAGE">إعادة تغليف</option>
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[10px] text-gray-400 mb-1">سبب الاسترجاع</label>
                                                                            <input
                                                                                type="text"
                                                                                value={selectedData.notes}
                                                                                onChange={(e) => updateSelectedItem(item.id, 'notes', e.target.value)}
                                                                                placeholder="اختياري..."
                                                                                className="w-full bg-surface-dark border border-white/10 rounded px-2 py-1.5 text-white text-sm"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/5 bg-rich-black/50 flex gap-4">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleSubmitReturn}
                                    disabled={selectedItems.length === 0}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gold-500 text-rich-black font-bold hover:bg-gold-300 transition-colors shadow-lg shadow-gold-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    حفظ المرتجع
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
