"use client";

import { motion } from "framer-motion";
import { Plus, Calendar, TrendingDown, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { expensesApi, Expense, ExpenseStats } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [stats, setStats] = useState<ExpenseStats | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        category: 'OTHER',
        description: '',
        date: new Date().toISOString().slice(0, 10)
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [data, statsData] = await Promise.all([
                expensesApi.getAll(),
                expensesApi.getStats()
            ]);
            setExpenses(data);
            setStats(statsData);
        } catch (e) {
            console.error("Failed to load expenses:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const previousExpenses = [...expenses];
        const previousStats = stats;

        try {
            const payload = {
                ...formData,
                description: formData.description || undefined,
                amount: Number(formData.amount)
            };

            // Optimistic update for Edit
            if (editingId) {
                setExpenses(prev => prev.map(ex => ex.id === editingId ? { ...ex, ...payload, amount: Number(payload.amount), date: new Date(payload.date) } as any : ex));
            }

            if (editingId) {
                await expensesApi.update(editingId, payload);
            } else {
                await expensesApi.create(payload);
            }

            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ amount: '', category: 'OTHER', description: '', date: new Date().toISOString().slice(0, 10) });
            loadData(); // Sync with server
        } catch (e) {
            console.error("Failed to save expense:", e);
            alert("حدث خطأ أثناء الحفظ");
            setExpenses(previousExpenses); // Rollback
            setStats(previousStats);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا المصروف؟')) return;

        const previousExpenses = [...expenses];
        const previousStats = stats;

        // Optimistic delete
        setExpenses(prev => prev.filter(e => e.id !== id));

        try {
            await expensesApi.delete(id);
            loadData(); // Sync stats & list
        } catch (e) {
            console.error("Failed to delete expense:", e);
            alert("فشل حذف المصروف");
            setExpenses(previousExpenses); // Rollback
            setStats(previousStats);
        }
    };

    const handleEdit = (expense: Expense) => {
        setFormData({
            amount: String(expense.amount),
            category: expense.category,
            description: expense.description || '',
            date: new Date(expense.date).toISOString().slice(0, 10)
        });
        setEditingId(expense.id);
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    const openAddModal = () => {
        setFormData({ amount: '', category: 'OTHER', description: '', date: new Date().toISOString().slice(0, 10) });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const downloadPDF = () => {
        const doc = new jsPDF('p', 'mm', 'a4');

        doc.setFontSize(20);
        doc.text("Expenses Report", 105, 15, { align: "center" });
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: "center" });

        const tableData = expenses.map(e => [
            e.description || "No description",
            getCategoryName(e.category),
            `${Number(e.amount).toLocaleString()} EGP`,
            new Date(e.date).toLocaleDateString()
        ]);

        autoTable(doc, {
            head: [['Description', 'Category', 'Amount', 'Date']],
            body: tableData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [174, 132, 57] },
            styles: { font: "helvetica", halign: 'center' },
        });

        doc.save(`expenses-${new Date().getTime()}.pdf`);
    };

    const categories = [
        { id: 'SALARY', name: 'رواتب' },
        { id: 'RENT', name: 'إيجار' },
        { id: 'UTILITIES', name: 'مرافق' },
        { id: 'MARKETING', name: 'تسويق' },
        { id: 'SUPPLIES', name: 'خامات' },
        { id: 'SHIPPING', name: 'شحن' },
        { id: 'OTHER', name: 'أخرى' }
    ];

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;

    const totalExpenses = stats?.total || 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider text-right">المصروفات</h1>
                    <p className="text-gray-400 text-sm mt-1">تتبع وإدارة نفقات المتجر التشغيلية.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={downloadPDF}
                        className="bg-surface-dark text-white border border-white/5 px-6 py-3 rounded-xl font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-white/5 transition-all shadow-lg"
                    >
                        <Download className="w-4 h-4 text-gold-500" />
                        <span>تحميل PDF</span>
                    </button>
                    <button
                        onClick={openAddModal}
                        className="bg-gold-500 text-rich-black px-6 py-3 rounded-xl font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/10"
                    >
                        <Plus className="w-4 h-4" />
                        <span>تسجيل مصروف</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-surface-dark border border-white/5 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <TrendingDown className="w-5 h-5" />
                            </div>
                            <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">إجمالي المصروفات</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white font-mono mb-2">
                            {totalExpenses.toLocaleString()} <span className="text-lg font-sans text-gray-500">ج.م</span>
                        </h2>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-surface-dark border border-white/5 p-6 rounded-2xl shadow-xl space-y-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">توزيع المصروفات حسب الفئة</h3>
                    {stats?.byCategory && Object.entries(stats.byCategory).map(([cat, amount]) => {
                        const percent = ((amount as number) / (totalExpenses || 1)) * 100;
                        return (
                            <div key={cat}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300">{getCategoryName(cat)}</span>
                                    <span className="text-white font-mono">{Number(amount).toLocaleString()} ج.م ({Math.round(percent)}%)</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        className="h-full bg-gold-500"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-surface-dark/40 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl overflow-visible">
                <div className="overflow-x-auto no-scrollbar pb-32">
                    <table className="w-full text-right border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/5">
                                <th className="px-6 py-5">الوصف</th>
                                <th className="px-6 py-5">الفئة</th>
                                <th className="px-6 py-5">المبلغ</th>
                                <th className="px-6 py-5">التاريخ</th>
                                <th className="px-6 py-5">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">جاري التحميل...</td>
                                </tr>
                            ) : expenses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">لا توجد مصروفات مسجلة</td>
                                </tr>
                            ) : (
                                expenses.map((expense, index) => (
                                    <tr key={expense.id} className="group hover:bg-white/[0.01] transition-all">
                                        <td className="px-6 py-5">
                                            <span className="text-sm text-white font-bold block">{expense.description || 'بدون وصف'}</span>
                                            <span className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">ID: {String(expense.id)}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-400">
                                                {getCategoryName(expense.category)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-base font-bold text-rose-500 font-mono">
                                                -{Number(expense.amount).toLocaleString()} <span className="text-[10px] font-sans">ج.م</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar className="w-3 h-3 text-gold-500/50" />
                                                <span className="text-xs">{new Date(expense.date).toLocaleDateString('ar-EG')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 relative">
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === expense.id ? null : expense.id)}
                                                className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {activeMenu === expense.id && (
                                                <div className={`absolute left-6 w-40 bg-surface-dark border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden ${index >= expenses.length - 2 && expenses.length > 2 ? "bottom-full mb-2" : "top-full mt-1"
                                                    }`}>
                                                    <button
                                                        onClick={() => handleEdit(expense)}
                                                        className="w-full text-right px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setActiveMenu(null);
                                                            handleDelete(expense.id);
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
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "تعديل المصروف" : "تسجيل مصروف جديد"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">المبلغ (ج.م)</label>
                        <input
                            type="number"
                            value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            required className="w-full bg-rich-black border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">الفئة</label>
                        <select
                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-rich-black border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none"
                        >
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">الوصف</label>
                        <input
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-rich-black border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none"
                            placeholder="مثال: فاتورة الكهرباء"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">التاريخ</label>
                        <input
                            type="date"
                            value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-rich-black border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full bg-gold-500 text-rich-black py-4 rounded-xl font-bold hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 active:scale-95 mt-4">
                        {editingId ? "تحديث البيانات" : "حفظ المصروف"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
