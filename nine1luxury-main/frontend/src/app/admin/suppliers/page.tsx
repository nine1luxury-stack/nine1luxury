"use client";

import { motion } from "framer-motion";
import { Truck, Plus, MoreVertical, Phone, Edit, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { suppliersApi, Supplier, SupplierStat } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";



export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [stats, setStats] = useState<SupplierStat[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', manualTotalPurchases: '', manualTotalPaid: '', description: '' });
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            const [data, statsData] = await Promise.all([
                suppliersApi.getAll(),
                suppliersApi.getStats()
            ]);
            setSuppliers(data);
            setStats(statsData);
        } catch (e) {
            console.error("SuppliersPage: Error loading data", e);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line
        loadData();
    }, [loadData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const previousSuppliers = [...suppliers];

        try {
            const payload = {
                ...formData,
                phone: formData.phone || undefined,
                manualTotalPurchases: Number(formData.manualTotalPurchases) || 0,
                manualTotalPaid: Number(formData.manualTotalPaid) || 0,
                description: formData.description || undefined
            };

            // Optimistic update for Edit
            if (editingId) {
                setSuppliers(prev => prev.map(s => s.id === editingId ? { ...s, ...payload } as any : s));
            }

            if (editingId) {
                await suppliersApi.update(editingId, payload);
            } else {
                await suppliersApi.create(payload);
            }

            setIsModalOpen(false);
            setFormData({ name: '', phone: '', manualTotalPurchases: '', manualTotalPaid: '', description: '' });
            setEditingId(null);
            loadData(); // Background sync
        } catch (e) {
            console.error(e);
            alert("حدث خطأ أثناء حفظ بيانات المورد");
            setSuppliers(previousSuppliers); // Rollback
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا المورد؟')) return;
        const previousSuppliers = [...suppliers];

        // Optimistic delete
        setSuppliers(prev => prev.filter(s => s.id !== id));

        try {
            await suppliersApi.delete(id);
            loadData(); // Background sync
        } catch (e) {
            console.error(e);
            alert("فشل حذف المورد");
            setSuppliers(previousSuppliers); // Rollback
        }
    };

    const handleEdit = (supplier: Supplier) => {
        setFormData({
            name: supplier.name,
            phone: supplier.phone || '',
            manualTotalPurchases: String(supplier.manualTotalPurchases || ''),
            manualTotalPaid: String(supplier.manualTotalPaid || ''),
            description: supplier.description || ''
        });
        setEditingId(supplier.id);
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    const downloadPDF = () => {
        const doc = new jsPDF('p', 'mm', 'a4');
        doc.setFontSize(20);
        doc.text("Suppliers Report", 105, 15, { align: "center" });
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: "center" });

        const tableData = suppliers.map(s => [
            s.name,
            s.phone || "-",
            s.description || "-",
            new Date(s.createdAt).toLocaleDateString()
        ]);

        autoTable(doc, {
            head: [['Supplier', 'Phone', 'Description', 'Joined Date']],
            body: tableData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [174, 132, 57] },
            styles: { font: "helvetica", halign: 'center' },
        });

        doc.save(`suppliers-${new Date().getTime()}.pdf`);
    };

    const openAddModal = () => {
        setFormData({ name: '', phone: '', manualTotalPurchases: '', manualTotalPaid: '', description: '' });
        setEditingId(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">الموردين</h1>
                    <p className="text-gray-400 text-sm mt-1">إدارة الموردين ومتابعة الالتزام والفواتير.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={downloadPDF}
                        className="bg-surface-dark text-white border border-white/5 px-6 py-2 rounded-xl font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-white/5 transition-all shadow-lg h-[42px]"
                    >
                        <Download className="w-4 h-4 text-gold-500" />
                        <span>تحميل PDF</span>
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-gold-500 text-rich-black px-6 py-2 rounded-xl font-bold hover:bg-gold-400 transition-colors shadow-lg h-[42px]"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة مورد
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.length > 0 && stats.map((stat) => (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface-dark border border-white/5 rounded-2xl p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Truck className="w-5 h-5" />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${stat.onTimeRate >= 90 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {stat.onTimeRate}% التزام
                            </span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">{stat.name}</h3>
                        {stat.description && (
                            <p className="text-xs text-gray-500 mb-3 truncate" title={stat.description}>{stat.description}</p>
                        )}
                        <div className="space-y-1 text-sm text-gray-400">
                            <div className="flex justify-between">
                                <span>إجمالي المشتريات:</span>
                                <span className="text-white font-mono">{Number(stat.totalSpent).toLocaleString()} ج.م</span>
                            </div>
                            <div className="flex justify-between">
                                <span>إجمالي المدفوع:</span>
                                <span className="text-green-500 font-mono">{Number(stat.totalPaid).toLocaleString()} ج.م</span>
                            </div>
                        </div>


                    </motion.div>
                ))}
            </div>

            {/* Suppliers Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-dark/40 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl overflow-visible"
            >
                <div className="overflow-x-auto no-scrollbar pb-32">
                    <table className="w-full text-right">
                        <thead className="bg-rich-black/50 border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">المورد</th>
                                <th className="px-6 py-4 font-medium">الوصف</th>
                                <th className="px-6 py-4 font-medium">الاتصال</th>
                                <th className="px-6 py-4 font-medium">تاريخ الإضافة</th>
                                <th className="px-6 py-4 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {suppliers.map((supplier, index) => (
                                <tr key={supplier.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">{supplier.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-400 truncate max-w-[200px]" title={supplier.description}>{supplier.description || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-sm text-gray-400">
                                            <div className="flex items-center gap-2 font-mono"><Phone className="w-3 h-3 text-gold-500/60" /> {supplier.phone || '-'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(supplier.createdAt).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="px-6 py-4 relative">
                                        <button
                                            onClick={() => setActiveMenu(activeMenu === supplier.id ? null : supplier.id)}
                                            className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {activeMenu === supplier.id && (
                                            <div className={`absolute left-6 w-40 bg-surface-dark border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden ${index >= suppliers.length - 2 && suppliers.length > 2 ? "bottom-full mb-2" : "top-full mt-1"
                                                }`}>
                                                <button
                                                    onClick={() => handleEdit(supplier)}
                                                    className="w-full text-right px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    تعديل
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveMenu(null);
                                                        handleDelete(supplier.id);
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "تعديل بيانات المورد" : "إضافة مورد جديد"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">اسم المورد</label>
                        <input
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required className="w-full bg-rich-black border border-white/10 rounded p-2 text-white"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">اسم الموديل</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">رقم الهاتف</label>
                        <input
                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-rich-black border border-white/10 rounded p-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">وصف المورد</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-rich-black border border-white/10 rounded p-2 text-white h-24 resize-none"
                            placeholder="اكتب وصفاً للمورد هنا..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">رصيد المشتريات (سابق)</label>
                            <input
                                type="number"
                                value={formData.manualTotalPurchases} onChange={e => setFormData({ ...formData, manualTotalPurchases: e.target.value })}
                                className="w-full bg-rich-black border border-white/10 rounded p-2 text-white"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">المدفوع (سابق)</label>
                            <input
                                type="number"
                                value={formData.manualTotalPaid} onChange={e => setFormData({ ...formData, manualTotalPaid: e.target.value })}
                                className="w-full bg-rich-black border border-white/10 rounded p-2 text-white"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-gold-500 text-rich-black py-2 rounded font-bold hover:bg-gold-400">
                        حفظ
                    </button>
                </form>
            </Modal>
        </div>
    );
}
