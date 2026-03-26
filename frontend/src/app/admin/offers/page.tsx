"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Plus, Trash2, Loader2, Edit, Save, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminOffersPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        link: "جميع المنتجات",
        isActive: true
    });

    const fetchOffers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/offers");
            if (res.ok) {
                const data = await res.json();
                setOffers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOffers();
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const url = editingId ? `/api/offers/${editingId}` : "/api/offers";
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
                    title: "",
                    description: "",
                    link: "جميع المنتجات",
                    isActive: true
                });
                fetchOffers();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save offer");
            }
        } catch (error) {
            console.error("Failed to save:", error);
            alert("حدث خطأ");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (offer: any) => {
        setFormData({
            title: offer.title,
            description: offer.description || "",
            link: offer.link,
            isActive: offer.isActive
        });
        setEditingId(offer.id);
        setShowForm(true);
    };

    const deleteOffer = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;
        try {
            const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
            if (res.ok) fetchOffers();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/offers/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            if (res.ok) fetchOffers();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">إدارة العروض</h1>
                    <p className="text-gray-400 text-sm mt-1">إضافة وتعديل العروض التي تظهر في صفحة "العروض".</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-gold-500 text-rich-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gold-400 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>إضافة عرض</span>
                    </button>
                )}
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-dark border border-white/5 p-6 rounded-2xl"
                >
                    <h2 className="text-xl font-bold text-white mb-6">{editingId ? "تعديل العرض" : "إضافة عرض جديد"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 font-playfair uppercase">عنوان العرض</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white"
                                    placeholder="مثال: خصومات على بناطيل الصيف"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">رابط القسم</label>
                                <select
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white"
                                >
                                    <option value="جميع المنتجات">جميع المنتجات</option>
                                    <option value="تيشرتات">تيشرتات</option>
                                    <option value="هوديز">هوديز</option>
                                    <option value="بناطيل">بناطيل</option>
                                    <option value="سويت شيرتات">سويت شيرتات</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">وصف العرض (اختياري)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white min-h-[50px] resize-none"
                                    placeholder="اكتب وصفاً قصيراً للعرض..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 accent-gold-500"
                            />
                            <label htmlFor="isActive" className="text-sm font-bold text-white cursor-pointer select-none">العرض نشط حالياً</label>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ title: "", description: "", link: "جميع المنتجات", isActive: true });
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
                                حفظ العرض
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
                    {offers.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            لا توجد عروض مسجلة.
                        </div>
                    ) : (
                        offers.map((offer) => (
                            <motion.div
                                key={offer.id}
                                className="bg-surface-dark border border-white/5 p-6 rounded-2xl relative group overflow-hidden"
                            >

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-white font-playfair">{offer.title}</h3>
                                        <button 
                                            onClick={() => toggleStatus(offer.id, offer.isActive)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${offer.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                                        >
                                            {offer.isActive ? "نشط" : "معطل"}
                                        </button>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">{offer.description || "لا يوجد وصف"}</p>
                                    <div className="flex items-center gap-2 text-gold-500 text-xs font-bold mb-6">
                                        <ExternalLink className="w-4 h-4" />
                                        <span>ينقل إلى سكشن: {offer.link}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                        <Link href={`/offers`} className="text-[10px] text-gray-500 hover:text-white transition-colors">عرض الصفحة</Link>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(offer)}
                                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors border border-blue-500/20"
                                                title="تعديل"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteOffer(offer.id)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
