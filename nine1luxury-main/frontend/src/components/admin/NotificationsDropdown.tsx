"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Package, User, AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/context/NotificationContext";

interface NotificationsDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
    const { notifications, unreadCount, markAsRead } = useNotifications();

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
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Dropdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-4 w-96 bg-surface-dark border border-gold-500/20 rounded-sm shadow-2xl shadow-black/50 z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Bell className="w-4 h-4 text-gold-500" />
                                الإشعارات
                                {unreadCount > 0 && (
                                    <span className="bg-gold-500 text-rich-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    لا توجد إشعارات جديدة
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => markAsRead(notification.id)}
                                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group relative ${!notification.read ? 'bg-gold-500/5' : ''}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                                            ${notification.type === 'order' ? 'bg-blue-500/10 text-blue-500' :
                                                    notification.type === 'user' ? 'bg-green-500/10 text-green-500' :
                                                        'bg-red-500/10 text-red-500'}`}
                                            >
                                                {notification.type === 'order' && <Package className="w-5 h-5" />}
                                                {notification.type === 'user' && <User className="w-5 h-5" />}
                                                {notification.type === 'system' && <AlertCircle className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-gray-400'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-500">{notification.time}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                                    {notification.description}
                                                </p>
                                            </div>
                                        </div>

                                        {!notification.read && (
                                            <div className="absolute top-4 left-4 w-2 h-2 bg-gold-500 rounded-full" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-white/5 bg-white/5 text-center">
                            <Link
                                href="/admin/notifications"
                                className="text-xs text-gold-300 hover:text-white transition-colors uppercase tracking-wider font-bold"
                                onClick={onClose}
                            >
                                عرض كل الإشعارات
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
