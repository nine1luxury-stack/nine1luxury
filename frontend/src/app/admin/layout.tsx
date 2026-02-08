"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { NotificationsDropdown } from "@/components/admin/NotificationsDropdown";
import { Bell } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [user, setUser] = useState<{ name: string, role: string } | null>(null);

    useEffect(() => {
        // Dynamic import to avoid hydration mismatch if possible, or just use Cookies
        import('js-cookie').then((Cookies) => {
            const userInfo = Cookies.default.get('user_info');
            if (userInfo) {
                try {
                    setUser(JSON.parse(userInfo));
                } catch (e) {
                    console.error("Failed to parse user info", e);
                }
            }
        });
    }, []);

    const userInitials = user?.name && user.name !== 'Admin User'
        ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : 'EB';

    const displayName = user?.name === 'Admin User' ? 'Ebeed' : (user?.name || 'Ebeed');

    return (
        <div className="flex min-h-screen bg-rich-black text-white" dir="rtl">
            <AdminSidebar />

            <div className="flex-1 flex flex-col">
                {/* Admin Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-surface-dark/40 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex-1" />

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 transition-colors ${showNotifications ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full border-2 border-surface-dark animate-pulse"></span>
                            </button>

                            <NotificationsDropdown
                                isOpen={showNotifications}
                                onClose={() => setShowNotifications(false)}
                            />
                        </div>

                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex items-center gap-3">
                            <div className="text-left hidden sm:block">
                                <p className="text-xs font-bold text-white">{displayName}</p>
                                <p className="text-[10px] text-gold-300/60 uppercase tracking-widest">{user?.role === 'ADMIN' ? 'المشرف العام' : 'المشرف العام'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-rich-black font-bold">
                                {userInitials}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
