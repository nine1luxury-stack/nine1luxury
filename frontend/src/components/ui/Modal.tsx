"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-rich-black/85 backdrop-blur-md z-50 transition-all duration-500"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-surface-dark border border-ivory/[0.08] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] pointer-events-auto flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-ivory/[0.04] bg-surface-dark/95 backdrop-blur-md z-10">
                                <h2 className="text-xl font-playfair font-bold text-ivory tracking-wide">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-ivory/20 hover:text-gold-300 hover:bg-white/[0.04] rounded-xl transition-all duration-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-7 overflow-y-auto custom-scrollbar">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
