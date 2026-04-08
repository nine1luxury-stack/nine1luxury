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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-rich-black border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-rich-black/95 backdrop-blur z-10">
                                <h2 className="text-xl font-playfair font-bold text-white">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
