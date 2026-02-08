"use client";

import { useState, useEffect } from "react";
import {
    Trash2,
    Search,
    Check,
    X,
    Loader2,
    Package,
    Maximize2,
    MapPin,
    Banknote,
    Plus,
    Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { useProducts } from "@/context/ProductContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Booking {
    id: string;
    name: string;
    phone: string;
    city?: string;
    shippingAmount: number;
    productModel?: string;
    productSize?: string;
    status: string;
    notes?: string;
    createdAt: string;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        shippingAmount: '',
        productModel: '',
        productSize: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const { products } = useProducts();

    // Get unique sizes from products
    const allSizes = [...new Set(products.flatMap(p => p.variants?.map(v => v.size) || []))];

    const fetchBookings = async () => {
        try {
            const res = await fetch("/api/bookings");
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
        const interval = setInterval(fetchBookings, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        const previousBookings = [...bookings];

        // Optimistic Update
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error("Failed to update status");
        } catch (error) {
            console.error(error);
            alert("فشل تحديث حالة الحجز");
            setBookings(previousBookings);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا الحجز؟")) return;

        const previousBookings = [...bookings];
        setBookings(prev => prev.filter(b => b.id !== id));

        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete");
        } catch (error) {
            console.error(error);
            alert("فشل حذف الحجز");
            setBookings(previousBookings);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    shippingAmount: Number(formData.shippingAmount) || 0
                })
            });

            if (!res.ok) throw new Error("Failed to create booking");

            setIsModalOpen(false);
            setFormData({
                name: '',
                phone: '',
                city: '',
                shippingAmount: '',
                productModel: '',
                productSize: '',
                notes: ''
            });
            fetchBookings();
        } catch (error) {
            console.error(error);
            alert("فشل إضافة الحجز");
        } finally {
            setSubmitting(false);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF('p', 'mm', 'a4');

        // Add title
        doc.setFontSize(20);
        doc.text("Bookings Report", 105, 15, { align: "center" });
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: "center" });

        const tableData = filteredBookings.map(b => [
            b.name,
            b.phone,
            b.productModel || "-",
            b.productSize || "-",
            b.city || "-",
            `${b.shippingAmount} EGP`,
            getStatusLabel(b.status)
        ]);

        autoTable(doc, {
            head: [['Customer', 'Phone', 'Model', 'Size', 'City', 'Shipping', 'Status']],
            body: tableData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [174, 132, 57] }, // gold-500 equivalent
            styles: { font: "helvetica", halign: 'center' },
        });

        doc.save(`bookings-${new Date().getTime()}.pdf`);
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.phone.includes(searchQuery) ||
            booking.productModel?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "CANCELLED": return "text-red-500 bg-red-500/10 border-red-500/20";
            default: return "text-gold-500 bg-gold-500/10 border-gold-500/20";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "تم التأكيد";
            case "CANCELLED": return "ملغي";
            default: return "قيد الانتظار";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">إدارة طلبات الحجز</h1>
                    <p className="text-gray-400">تابع طلبات حجز الموديلات الفاخرة</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={downloadPDF}
                        className="bg-surface-dark text-white border border-white/5 px-6 py-3 rounded-xl font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-white/5 transition-all shadow-lg"
                    >
                        <Download className="w-4 h-4 text-gold-500" />
                        <span>تحميل PDF</span>
                    </button>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gold-500 text-rich-black px-6 py-3 rounded-xl font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/10"
                    >
                        <Plus className="w-4 h-4" />
                        <span>إضافة حجز</span>
                    </button>

                    <div className="flex bg-surface-dark border border-white/5 rounded-2xl p-2">
                        <div className="flex bg-rich-black rounded-xl p-1">
                            {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === status
                                        ? "bg-gold-500 text-rich-black shadow-lg"
                                        : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {status === "ALL" ? "الكل" : getStatusLabel(status)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="ابحث باسم العميل، الموديل، أو رقم الهاتف..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface-dark border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white focus:border-gold-500 outline-none transition-all shadow-xl"
                    />
                </div>
                <div className="bg-surface-dark border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">إجمالي الحجوزات</p>
                        <p className="text-2xl font-bold text-white">{filteredBookings.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center">
                        <Package className="text-gold-500 w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-surface-dark border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-white/5">
                                <th className="px-6 py-5">العميل</th>
                                <th className="px-6 py-5">الموديل والمقاس</th>
                                <th className="px-6 py-5">الموقع والشحن</th>
                                <th className="px-6 py-5">الملاحظات</th>
                                <th className="px-6 py-5">الحالة</th>
                                <th className="px-6 py-5">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filteredBookings.map((booking) => (
                                    <motion.tr
                                        key={booking.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold">
                                                    {booking.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{booking.name}</p>
                                                    <p className="text-gray-500 text-sm font-mono">{booking.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold flex items-center gap-2">
                                                    <Package className="w-3 h-3 text-gold-500" />
                                                    {booking.productModel || "-"}
                                                </span>
                                                <span className="text-gray-500 text-xs flex items-center gap-2">
                                                    <Maximize2 className="w-3 h-3" />
                                                    المقاس: {booking.productSize || "-"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-white flex items-center gap-2">
                                                    <MapPin className="w-3 h-3 text-gold-500" />
                                                    {booking.city || "-"}
                                                </span>
                                                <span className="text-gold-500 text-xs font-bold flex items-center gap-2">
                                                    <Banknote className="w-3 h-3" />
                                                    {booking.shippingAmount} ج.م
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 max-w-xs">
                                            <p className="text-gray-500 text-sm truncate" title={booking.notes}>
                                                {booking.notes || "-"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(booking.status)}`}>
                                                {getStatusLabel(booking.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {booking.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                                                            disabled={updatingId === booking.id}
                                                            className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-lg"
                                                            title="تأكيد"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                                            disabled={updatingId === booking.id}
                                                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                                            title="إلغاء"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(booking.id)}
                                                    className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Booking Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة حجز جديد">
                <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">اسم العميل *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-rich-black border border-white/10 rounded-xl p-3 text-white focus:border-gold-500 outline-none"
                                placeholder="أدخل اسم العميل"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">رقم الهاتف *</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-rich-black border border-white/10 rounded-xl p-3 text-white focus:border-gold-500 outline-none"
                                placeholder="01xxxxxxxxx"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">المدينة</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full bg-rich-black border border-white/10 rounded-xl p-3 text-white focus:border-gold-500 outline-none"
                                placeholder="القاهرة"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">قيمة الشحن (ج.م)</label>
                            <input
                                type="number"
                                value={formData.shippingAmount}
                                onChange={(e) => setFormData({ ...formData, shippingAmount: e.target.value })}
                                className="w-full bg-rich-black border border-white/10 rounded-xl p-3 text-white focus:border-gold-500 outline-none"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">الموديل</label>
                            <select
                                value={formData.productModel}
                                onChange={(e) => setFormData({ ...formData, productModel: e.target.value })}
                                className="w-full bg-rich-black border border-white/10 rounded-xl p-3 text-white focus:border-gold-500 outline-none"
                            >
                                <option value="">اختر الموديل</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.name}>{product.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">المقاس</label>
                            <select
                                value={formData.productSize}
                                onChange={(e) => setFormData({ ...formData, productSize: e.target.value })}
                                className="w-full bg-rich-black border border-white/10 rounded-xl p-3 text-white focus:border-gold-500 outline-none"
                            >
                                <option value="">اختر المقاس</option>
                                {allSizes.map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">ملاحظات</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full bg-rich-black border border-white/10 rounded-xl p-3 text-white focus:border-gold-500 outline-none resize-none"
                            rows={3}
                            placeholder="أي ملاحظات إضافية..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gold-500 text-rich-black py-4 rounded-xl font-bold hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                جاري الإضافة...
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                إضافة الحجز
                            </>
                        )}
                    </button>
                </form>
            </Modal>
        </div>
    );
}

