"use client";

import { motion } from "framer-motion";
import { Save, Store, Globe, Bell, Mail, Type } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const router = useRouter();
    const [settings, setSettings] = useState({
        storeName: "nine1luxury",
        storeEmail: "support@nine1luxury.com",
        currency: "EGP",
        maintenanceMode: false,
        emailNotifications: true,
        orderNotifications: true,
        promoBanner: "",
        bookingBanner: ""
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (Object.keys(data).length > 0) {
                        setSettings(prev => ({
                            ...prev,
                            ...data,
                            maintenanceMode: data.maintenanceMode === 'true',
                            emailNotifications: data.emailNotifications === 'true',
                            orderNotifications: data.orderNotifications === 'true'
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to load settings:", error);
            } finally {
                setIsFetching(false);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeName: settings.storeName,
                    storeEmail: settings.storeEmail,
                    currency: settings.currency,
                    maintenanceMode: String(settings.maintenanceMode),
                    emailNotifications: String(settings.emailNotifications),
                    orderNotifications: String(settings.orderNotifications),
                    promoBanner: settings.promoBanner,
                    bookingBanner: settings.bookingBanner
                })
            });
            
            if (res.ok) {
                alert("تم حفظ الإعدادات بنجاح!");
                router.refresh();
            } else {
                alert("حدث خطأ أثناء حفظ الإعدادات");
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("حدث خطأ أثناء حفظ الإعدادات");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="text-white">جاري تحميل الإعدادات...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">الإعدادات</h1>
                    <p className="text-gray-400 text-sm mt-1">تخصيص إعدادات المتجر والتنبيهات.</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-gold-500 text-rich-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gold-300 transition-colors disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-dark border border-white/5 p-6 rounded-2xl"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Store className="w-5 h-5 text-gold-500" />
                        إعدادات المتجر العامة
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase">اسم المتجر</label>
                            <input
                                value={settings.storeName}
                                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase">البريد الإلكتروني للدعم</label>
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    value={settings.storeEmail}
                                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-12 py-3 text-white focus:border-gold-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-white/5">
                            <label className="text-xs text-gray-500 font-bold uppercase">الشريط الترويجي (الصفحة الرئيسية)</label>
                            <div className="relative">
                                <Type className="absolute right-4 top-3 w-4 h-4 text-gray-400" />
                                <textarea
                                    value={settings.promoBanner || ""}
                                    onChange={(e) => setSettings({ ...settings, promoBanner: e.target.value })}
                                    placeholder="أدخل النص الترويجي هنا ليعرض أسفل 'إصدارات مختارة'"
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-12 py-3 text-white focus:border-gold-500 outline-none min-h-[80px]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-white/5">
                            <label className="text-xs text-gray-500 font-bold uppercase">الشريط الترويجي (صفحة الحجز)</label>
                            <div className="relative">
                                <Type className="absolute right-4 top-3 w-4 h-4 text-gray-400" />
                                <textarea
                                    value={settings.bookingBanner || ""}
                                    onChange={(e) => setSettings({ ...settings, bookingBanner: e.target.value })}
                                    placeholder="أدخل النص الترويجي لصفحة الحجز"
                                    className="w-full bg-rich-black border border-white/10 rounded-xl px-12 py-3 text-white focus:border-gold-500 outline-none min-h-[80px]"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Regional Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-surface-dark border border-white/5 p-6 rounded-2xl"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gold-500" />
                        الإعدادات الإقليمية
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase">العملة الافتراضية</label>
                            <select
                                value={settings.currency}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none"
                            >
                                <option value="EGP">جنيه مصري (EGP)</option>
                                <option value="USD">دولار أمريكي (USD)</option>
                                <option value="SAR">ريال سعودي (SAR)</option>
                            </select>
                        </div>
                        <div className="pt-4 flex items-center justify-between p-4 bg-rich-black/50 rounded-xl border border-white/5">
                            <div>
                                <h4 className="text-white font-medium text-sm">وضع الصيانة</h4>
                                <p className="text-xs text-gray-500 mt-1">تفعيل صفحة &quot;قريباً&quot; للزوار</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                            </label>
                        </div>
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-surface-dark border border-white/5 p-6 rounded-2xl"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-gold-500" />
                        التنبيهات
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-rich-black/50 rounded-xl border border-white/5 hover:border-gold-500/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">تنبيهات البريد الإلكتروني</h4>
                                    <p className="text-xs text-gray-500 mt-1">استلام إشعارات عند تسجيل دخول جديد</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.emailNotifications}
                                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-rich-black/50 rounded-xl border border-white/5 hover:border-gold-500/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                    <Store className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">تنبيهات الطلبات</h4>
                                    <p className="text-xs text-gray-500 mt-1">استلام إشعار صوتي عند وصول طلب جديد</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.orderNotifications}
                                    onChange={(e) => setSettings({ ...settings, orderNotifications: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                            </label>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
