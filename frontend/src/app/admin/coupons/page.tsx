"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ticket, Plus, Trash2, Percent, Loader2, Edit, Save } from "lucide-react";

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        code: "",
        type: "PERCENTAGE",
        value: 10,
        minQuantity: 1,
        isActive: true
    });

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/coupons");
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const url = editingId ? `/api/coupons/${editingId}` : "/api/coupons";
            const method = editingId ? "PATCH" : "POST";
            
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                setShowForm(false);
                setEditingId(null);
                setFormData({
                    code: "",
                    type: "PERCENTAGE",
                    value: 10,
                    minQuantity: 1,
                    isActive: true
                });
                fetchCoupons();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save coupon");
            }
        } catch (error) {
            console.error("Failed to save:", error);
            alert("حدث خطأ");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (coupon: any) => {
        setFormData({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minQuantity: coupon.minQuantity,
            isActive: coupon.isActive
        });
        setEditingId(coupon.id);
        setShowForm(true);
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا الكوبون؟")) return;
        try {
            const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
            if (res.ok) fetchCoupons();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/coupons/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            if (res.ok) fetchCoupons();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">كوبونات الخصم</h1>
                    <p className="text-gray-400 text-sm mt-1">إدارة أكواد الخصم والخصومات على المتجر.</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-gold-500 text-rich-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gold-400 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>إضافة كوبون</span>
                    </button>
                )}
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-dark border border-white/5 p-6 rounded-2xl"
                >
                    <h2 className="text-xl font-bold text-white mb-6">{editingId ? "تعديل الكوبون" : "إضافة كوبون جديد"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">كود الخصم</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white uppercase"
                                    placeholder="مثال: WELCOME20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">نوع الخصم</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white"
                                >
                                    <option value="PERCENTAGE">نسبة مئوية (%)</option>
                                    <option value="FIXED_AMOUNT">قيمة ثابتة (جنية)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">قيمة الخصم</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    value={formData.value}
                                    onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">الحد الأدنى لعدد القطع المطلوبة</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    value={formData.minQuantity}
                                    onChange={e => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ code: "", type: "PERCENTAGE", value: 10, minQuantity: 1, isActive: true });
                                }}
                                className="px-6 py-2 rounded-xl text-gray-400 hover:text-white"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-gold-500 text-rich-black px-8 py-2 rounded-xl font-bold hover:bg-gold-400 flex items-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
                                حفظ الكوبون
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            لا توجد كوبونات مسجلة.
                        </div>
                    ) : (
                        coupons.map((coupon) => (
                            <motion.div
                                key={coupon.id}
                                className="bg-surface-dark border border-white/5 p-6 rounded-2xl relative"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-gold-500/10 border border-gold-500/20 px-3 py-1 rounded text-gold-500 font-bold uppercase tracking-widest text-lg">
                                        {coupon.code}
                                    </div>
                                    <button 
                                        onClick={() => toggleStatus(coupon.id, coupon.isActive)}
                                        className={`px-2 py-1 rounded text-xs font-bold ${coupon.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                                    >
                                        {coupon.isActive ? "نشط" : "معطل"}
                                    </button>
                                </div>
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">الخصم:</span>
                                        <span className="font-bold text-white flex items-center gap-1">
                                            {coupon.value} 
                                            {coupon.type === "PERCENTAGE" ? <Percent className="w-3 h-3"/> : "ج.م"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">الحد الأدنى للقطع:</span>
                                        <span className="font-bold text-white">{coupon.minQuantity} قطعة</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">مرات الاستخدام:</span>
                                        <span className="font-bold text-white">{coupon.usedCount} مرة</span>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => handleEdit(coupon)}
                                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        title="تعديل"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteCoupon(coupon.id)}
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="حذف الكوبون"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
