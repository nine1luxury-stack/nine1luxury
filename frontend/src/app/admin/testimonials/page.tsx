"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MessageSquare, 
    Trash2, 
    Star, 
    CheckCircle2, 
    XCircle,
    Loader2,
    Quote,
    Plus,
    X
} from "lucide-react";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newTestimonial, setNewTestimonial] = useState({ name: '', role: 'عميل', content: '', rating: 5 });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const res = await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTestimonial)
            });
            if (res.ok) {
                const added = await res.json();
                setTestimonials(prev => [added, ...prev]);
                setIsAddModalOpen(false);
                setNewTestimonial({ name: '', role: 'عميل', content: '', rating: 5 });
            } else {
                alert("فشل إضافة التجربة");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsAdding(false);
        }
    };


    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/testimonials?all=true'); // Assume API supports all
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            const res = await fetch(`/api/testimonials`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: itemToDelete.id })
            });
            if (res.ok) {
                setTestimonials(prev => prev.filter(t => t.id !== itemToDelete.id));
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/testimonials`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !currentStatus })
            });
            if (res.ok) {
                setTestimonials(prev => prev.map(t => t.id === id ? { ...t, isActive: !currentStatus } : t));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-gold-500" />
                        إدارة تجارب العملاء
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">مراجعة والتحكم في الآراء المعروضة على الموقع</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gold-500 text-rich-black px-6 py-3 rounded-xl font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/10"
                >
                    <Plus className="w-4 h-4" />
                    <span>إضافة تجربة جديدة</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {testimonials.map((t) => (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`relative p-6 rounded-2xl border transition-all ${
                                t.isActive 
                                    ? 'bg-surface-dark border-gold-500/10' 
                                    : 'bg-surface-dark/50 border-white/5 opacity-60'
                            }`}
                        >
                            <div className="absolute top-4 left-4 flex gap-2">
                                <button
                                    onClick={() => toggleStatus(t.id, t.isActive)}
                                    className={`p-2 rounded-lg transition-colors ${
                                        t.isActive 
                                            ? 'text-green-500 hover:bg-green-500/10' 
                                            : 'text-gray-500 hover:bg-white/5'
                                    }`}
                                    title={t.isActive ? "إخفاء من الموقع" : "إظهار في الموقع"}
                                >
                                    {t.isActive ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => {
                                        setItemToDelete(t);
                                        setIsDeleteModalOpen(true);
                                    }}
                                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex gap-0.5 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${i < t.rating ? 'text-gold-500 fill-gold-500' : 'text-white/10'}`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-300 text-sm leading-relaxed mb-6 italic h-20 overflow-hidden line-clamp-3">
                                "{t.content}"
                            </p>

                            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">{t.name}</h4>
                                    <p className="text-xs text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {testimonials.length === 0 && (
                <div className="text-center py-20 bg-surface-dark/30 rounded-3xl border border-dashed border-white/5">
                    <Quote className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 italic">لا توجد تجارب لعملاء حالياً</p>
                </div>
            )}

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="حذف تجربة العميل"
                message={`هل أنت متأكد من حذف تجربة "${itemToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
            />

            {/* Add Testimonial Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface-dark border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-rich-black/50">
                                <h2 className="text-xl font-bold text-white font-almarai">إضافة تجربة جديدة</h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">اسم العميل</label>
                                    <input
                                        required
                                        type="text"
                                        value={newTestimonial.name}
                                        onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                        className="w-full bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">الدور / الوظيفة</label>
                                    <input
                                        type="text"
                                        value={newTestimonial.role}
                                        onChange={e => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                                        className="w-full bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none"
                                        placeholder="مثال: عميل مميز"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">التقييم (من 1 إلى 5)</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={newTestimonial.rating}
                                        onChange={e => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                                        className="w-full bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">محتوى التجربة</label>
                                    <textarea
                                        required
                                        value={newTestimonial.content}
                                        onChange={e => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                                        className="w-full bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none h-24 resize-none"
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-colors"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isAdding}
                                        className="flex-1 px-4 py-3 rounded-xl bg-gold-500 text-rich-black font-bold hover:bg-gold-300 transition-colors shadow-lg shadow-gold-500/10 disabled:opacity-50"
                                    >
                                        {isAdding ? 'جاري الإضافة...' : 'إضافة التجربة'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
