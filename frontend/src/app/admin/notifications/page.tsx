"use client";

import { useNotifications } from "@/context/NotificationContext";
import { CheckCheck, Trash2, ShoppingBag, User, Info, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPage() {
    const { 
        notifications, 
        markAsRead, 
        markAllAsRead, 
        clearNotifications 
    } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <ShoppingBag className="w-5 h-5" />;
            case 'user': return <User className="w-5 h-5" />;
            case 'system': return <Info className="w-5 h-5" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'order': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'user': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'system': return 'bg-gold-500/10 text-gold-500 border-gold-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <Bell className="w-6 h-6 text-gold-500" />
                        مركز الإشعارات
                    </h1>
                    <p className="text-gray-400 text-sm">إدارة ومتابعة جميع تنبيهات النظام</p>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={markAllAsRead}
                        className="px-4 py-2 bg-surface-dark border border-white/5 rounded-lg text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                        <CheckCheck className="w-4 h-4" />
                        تحديد الكل كمقروء
                    </button>
                    <button 
                        onClick={clearNotifications}
                        className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        مسح الكل
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {notifications.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-surface-dark/40 border border-white/5 rounded-2xl p-12 text-center"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">لا توجد إشعارات</h3>
                            <p className="text-gray-500">أنت مطلع على كل شيء! لا توجد تنبيهات جديدة في الوقت الحالي.</p>
                        </motion.div>
                    ) : (
                        notifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onClick={() => markAsRead(notification.id)}
                                className={`
                                    relative p-5 rounded-xl border transition-all cursor-pointer group
                                    ${notification.read 
                                        ? 'bg-surface-dark border-white/5 opacity-70 hover:opacity-100' 
                                        : 'bg-surface-dark border-gold-500/20 shadow-[0_0_15px_rgba(234,179,8,0.05)]'
                                    }
                                `}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border shrink-0 ${getColor(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`font-bold text-lg ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs text-gray-500 whitespace-nowrap dir-ltr">
                                                {/* Fallback to 'time' string if timestamp is invalid or use simple time string from context */}
                                                {/* To be safe with hydration, we might want to stick to the static string if client-side rendering of relative dates causes mismatches, 
                                                    but since we are 'use client', it should be fine mostly. Let's stick to the static 'time' from context for stability, 
                                                    or perform calc if we trust hydration. Let's use the static string 'time' provided by context for now as it's safe. */}
                                                {notification.time}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {notification.description}
                                        </p>
                                    </div>
                                    
                                    {!notification.read && (
                                        <div className="absolute top-5 left-5 w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
