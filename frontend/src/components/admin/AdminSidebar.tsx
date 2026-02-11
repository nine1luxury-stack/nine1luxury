"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Truck,
    Banknote,
    Warehouse,
    Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { name: "لوحة التحكم", icon: LayoutDashboard, href: "/admin" },
    { name: "المنتجات", icon: Package, href: "/admin/products" },
    { name: "المخزن", icon: Warehouse, href: "/admin/inventory" },
    { name: "الطلبات", icon: ShoppingBag, href: "/admin/orders" },
    { name: "الحجوزات", icon: Calendar, href: "/admin/bookings" },
    { name: "الموردين", icon: Truck, href: "/admin/suppliers" },
    { name: "المصروفات", icon: Banknote, href: "/admin/expenses" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "bg-surface-dark border-l border-white/5 flex flex-col h-screen sticky top-0 transition-all duration-300",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-4 flex items-center justify-between border-b border-white/5 mb-2">
                {!isCollapsed && (
                    <Link href="/" className="flex items-center justify-center w-full">
                        <div className="relative w-52 h-24">
                            <Image
                                src="/logo-main.png"
                                alt="nine1luxury"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>
                )}
                <button
                    suppressHydrationWarning
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors",
                        isCollapsed && "mx-auto"
                    )}
                >
                    {isCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative",
                                isActive
                                    ? "bg-gold-500/10 text-gold-500 border border-gold-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5",
                                isCollapsed && "justify-center"
                            )}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-gold-500" : "text-gray-500 group-hover:text-white")} />
                            {!isCollapsed && <span className="text-sm font-bold whitespace-nowrap">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-white/5">
                <button
                    suppressHydrationWarning
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors",
                        isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? "تسجيل الخروج" : undefined}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="text-sm font-bold whitespace-nowrap">تسجيل الخروج</span>}
                </button>
            </div>
        </aside>
    );
}
