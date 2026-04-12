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
    Quote
} from "lucide-react";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

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
        </div>
    );
}
