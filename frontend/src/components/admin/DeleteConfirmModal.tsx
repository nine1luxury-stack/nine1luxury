"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    isLoading?: boolean;
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "هل أنت متأكد؟",
    message = "لا يمكن التراجع عن هذا الإجراء بمجرد إتمامه.",
    isLoading = false
}: DeleteConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="relative w-full max-w-md bg-surface-dark border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                        dir="rtl"
                    >
                        {/* Decorative Background Glow */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-[80px]" />
                        
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 left-6 p-2 text-gray-500 hover:text-white bg-white/5 rounded-full transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-6">
                            {/* Icon */}
                            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 relative">
                                <AlertTriangle className="w-10 h-10 text-rose-500 animate-pulse" />
                                <div className="absolute inset-0 rounded-full bg-rose-500/5 blur-xl group-hover:bg-rose-500/10 transition-all" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-playfair font-bold text-white tracking-wide">
                                    {title}
                                </h2>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            <div className="flex flex-col w-full gap-3 pt-4">
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-rose-500/20 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span>تأكيد الحذف</span>
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-2xl transition-all"
                                >
                                    تراجع
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
