"use client";

import { motion } from "framer-motion";
import { User, Search, ShoppingBag, Plus, Loader2, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { formatPrice } from "@/lib/utils";
import { Customer } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import { createArabicPDF, reshapeArabic, autoTable } from "@/lib/pdf-utils";
import { Download } from "lucide-react";

export default function AdminCustomersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCustomers = useCallback(async () => {
        try {
            const res = await fetch('/api/customers');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
        const interval = setInterval(fetchCustomers, 15000);
        return () => clearInterval(interval);
    }, [fetchCustomers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/customers/${editingId}` : '/api/customers';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ name: '', phone: '' });
                setEditingId(null);
                fetchCustomers();
                alert(editingId ? "تم تحديث بيانات العميل" : "تم إضافة العميل بنجاح");
            } else {
                const err = await res.json();
                alert(`فشل العملية: ${err.error || 'Error'}`);
            }
        } catch (error) {
            console.error(error);
            alert("حدث خطأ أثناء الاتصال بالخادم");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;

        try {
            const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCustomers();
            } else {
                const err = await res.json();
                alert(err.error || "فشل الحذف");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (customer: Customer) => {
        setFormData({ name: customer.name, phone: customer.phone || '' });
        setEditingId(String(customer.id));
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    const openAddModal = () => {
        setFormData({ name: '', phone: '' });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const downloadPDF = () => {
        const doc = createArabicPDF();
        doc.setFontSize(22);
        doc.text(reshapeArabic("تقرير العملاء"), 105, 15, { align: "center" });
        doc.setFontSize(10);
        doc.text(reshapeArabic(`تاريخ الإنشاء: ${new Date().toLocaleString('ar-EG')}`), 105, 22, { align: "center" });

        // Reverse column order for RTL: Total Spent, Orders, Phone, Customer
        const tableData = filteredCustomers.map(c => [
            `${c.totalSpent} ج.م`,
            c.totalOrders,
            c.phone || "-",
            reshapeArabic(c.name)
        ]);

        autoTable(doc, {
            head: [[reshapeArabic('إجمالي المشتريات'), reshapeArabic('الطلبات'), reshapeArabic('الهاتف'), reshapeArabic('العميل')]],
            body: tableData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [174, 132, 57], font: 'Amiri', halign: 'right' },
            bodyStyles: { font: 'Amiri', halign: 'right' },
            styles: { font: "Amiri", halign: 'right' },
        });

        doc.save(`customers-${new Date().getTime()}.pdf`);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">العملاء</h1>
                    <p className="text-gray-400 text-sm mt-1">عرض قائمة العملاء وإحصائيات طلباتهم.</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={downloadPDF}
                        className="bg-surface-dark text-white border border-white/5 px-6 py-2.5 rounded-xl font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-white/5 transition-all shadow-lg"
                    >
                        <Download className="w-4 h-4 text-gold-500" />
                        <span>تحميل PDF</span>
                    </button>
                    <button
                        onClick={openAddModal}
                        className="bg-gold-500 text-rich-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        <span>إضافة عميل</span>
                    </button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-dark border border-white/5 rounded-2xl shadow-2xl"
            >
                <div className="p-6 border-b border-white/5">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="ابحث باسم العميل أو رقم الهاتف..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-rich-black border border-white/5 rounded-xl pr-12 pl-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar pb-32">
                    <table className="w-full text-right border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/5">
                                <th className="px-6 py-5">العميل</th>
                                <th className="px-6 py-5">الهاتف</th>
                                <th className="px-6 py-5 text-center">عدد الطلبات</th>
                                <th className="px-6 py-5">إجمالي المشتريات</th>
                                <th className="px-6 py-5">آخر نشاط</th>
                                <th className="px-6 py-5">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-500">لا يوجد عملاء</td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer: Customer, index: number) => (
                                    <tr key={customer.id} className="group hover:bg-white/[0.02] transition-all">
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold">
                                                    {customer.name.substring(0, 1).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-base text-white font-bold group-hover:text-gold-300 transition-colors">
                                                        {customer.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mt-0.5">
                                                        ID: {customer.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-gray-400 font-mono text-sm">{customer.phone || '-'}</span>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                                <ShoppingBag className="w-3.5 h-3.5 text-gold-500" />
                                                <span className="text-white font-bold font-mono">{customer.totalOrders}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex flex-col">
                                                <span className="text-gold-400 font-bold text-base">{formatPrice(customer.totalSpent)}</span>
                                                <span className="text-[9px] text-gray-600 uppercase tracking-tighter">إجمالي المدفوعات</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 text-sm font-medium">
                                                    {customer.lastOrderDate
                                                        ? new Date(customer.lastOrderDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })
                                                        : 'لا يوجد'}
                                                </span>
                                                <span className="text-[10px] text-gray-600 uppercase mt-0.5">آخر نشاط</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 relative">
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === String(customer.id) ? null : String(customer.id))}
                                                className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {activeMenu === String(customer.id) && (
                                                <div className={`absolute left-6 w-40 bg-surface-dark border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden ${index >= filteredCustomers.length - 2 && filteredCustomers.length > 2 ? "bottom-full mb-2" : "top-full mt-1"
                                                    }`}>
                                                    <button
                                                        onClick={() => handleEdit(customer)}
                                                        className="w-full text-right px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setActiveMenu(null);
                                                            handleDelete(String(customer.id));
                                                        }}
                                                        className="w-full text-right px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        حذف
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modal for Add/Edit */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-bold">الاسم</label>
                        <input
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none"
                            placeholder="اسم العميل"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-bold">رقم الهاتف</label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-rich-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none"
                            placeholder="01xxxxxxxxx"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gold-500 text-rich-black font-bold py-4 rounded-xl hover:bg-gold-300 transition-colors mt-4 disabled:opacity-50"
                    >
                        {isSubmitting ? 'جاري الحفظ...' : editingId ? 'تحديث البيانات' : 'حفظ العميل'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
