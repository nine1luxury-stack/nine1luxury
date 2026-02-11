"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Search, MoreVertical, Edit, Save, RefreshCcw, CheckCircle, AlertCircle, Plus, ShoppingBag, Package } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { productsApi, Product, ProductVariant, ReturnRequest } from "@/lib/api";
import { useProducts } from "@/context/ProductContext";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";



export default function InventoryPage() {
    const [activeTab, setActiveTab] = useState<'INVENTORY' | 'RETURNS'>('INVENTORY');

    // Inventory State from Context
    const { products, loading: loadingProducts, refreshProducts, updateProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<'ALL' | 'LOW_STOCK' | 'STAGNANT'>('ALL');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Local state for Returns (since it's not in global context yet)
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [loadingReturns, setLoadingReturns] = useState(false);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [newReorderPoint, setNewReorderPoint] = useState(10);
    const [editingVariants, setEditingVariants] = useState<ProductVariant[]>([]);
    const [baseStock, setBaseStock] = useState(0);
    const [baseDamagedStock, setBaseDamagedStock] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddReturnModalOpen, setIsAddReturnModalOpen] = useState(false);

    // Form State for new Return
    const [newReturn, setNewReturn] = useState({
        orderId: '',
        productId: '',
        type: 'VALID',
        quantity: 1,
        notes: ''
    });
    const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

    const loadInventory = useCallback(async () => {
        await refreshProducts();
    }, [refreshProducts]);

    const loadReturns = useCallback(async () => {
        setLoadingReturns(true);
        try {
            const res = await fetch('/api/returns');
            if (res.ok) {
                const data = await res.json();
                setReturns(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingReturns(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'INVENTORY') {
            loadInventory();
            const interval = setInterval(loadInventory, 15000);
            return () => clearInterval(interval);
        } else {
            loadReturns();
            const interval = setInterval(loadReturns, 15000);
            return () => clearInterval(interval);
        }
    }, [activeTab, loadInventory, loadReturns]);

    const handleUpdateReturnStatus = async (id: string, status: string) => {
        const previousReturns = [...returns];
        // Optimistic update
        setReturns(prev => prev.map(r => r.id === id ? { ...r, status } : r));

        try {
            const res = await fetch(`/api/returns/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error("فشل تحديث حالة المرتجع");

            // Background sync
            loadReturns();
            if (status === 'APPROVED') {
                loadInventory();
            }
        } catch (error) {
            console.error(error);
            alert("حدث خطأ أثناء تحديث حالة المرتجع");
            setReturns(previousReturns);
        }
    };

    const handleOpenEdit = (product: Product) => {
        setSelectedProduct(product);
        setNewReorderPoint(product.reorderPoint || 10);
        const variants = product.variants ? JSON.parse(JSON.stringify(product.variants)) : [];
        setEditingVariants(variants);

        // If no variants, we might want to edit "base" stock
        if (variants.length === 0) {
            setBaseStock(0);
            setBaseDamagedStock(0);
        }

        setIsEditModalOpen(true);
        setActiveMenu(null);
    };

    const handleSaveInventory = async () => {
        if (!selectedProduct) return;
        setIsSaving(true);
        try {
            const payload: any = {
                reorderPoint: Number(newReorderPoint),
            };

            if (editingVariants && editingVariants.length > 0) {
                payload.variants = {
                    update: editingVariants.map((v) => ({
                        where: { id: v!.id },
                        data: {
                            stock: Number(v!.stock),
                            damagedStock: Number(v!.damagedStock || 0),
                            washStock: Number(v!.washStock || 0),
                            repackageStock: Number(v!.repackageStock || 0),
                        },
                    })),
                };
            } else {
                // No variants exist yet, create a default one to hold the stock
                payload.variants = {
                    create: [{
                        color: 'الأساسي',
                        size: 'الأساسي',
                        stock: Number(baseStock),
                        damagedStock: Number(baseDamagedStock),
                    }]
                };
            }

            console.log('Sending update payload:', JSON.stringify(payload, null, 2));

            // Use global context update to keep all pages synced
            await updateProduct(selectedProduct.id, payload);

            setIsEditModalOpen(false);
            // Products context will handle the state update, but we can refresh to be safe
            await refreshProducts();
        } catch (e: unknown) {
            console.error(e);
            alert(`حدث خطأ أثناء حفظ التعديلات: ${e instanceof Error ? e.message : 'Error'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleVariantStockChange = (variantId: string, field: string, value: string) => {
        setEditingVariants(prev => prev.map(v =>
            v.id === variantId ? { ...v, [field]: Number(value) } : v
        ));
    };

    const getStockLevel = (product: Product) => {
        if (product.variants && product.variants.length > 0) {
            return product.variants.reduce((acc: number, v) => acc + (v.stock || 0), 0);
        }
        return 0;
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const stock = getStockLevel(product);
        const reorderPoint = product.reorderPoint || 10;

        let matchesFilter = true;
        if (filter === 'LOW_STOCK') {
            matchesFilter = stock <= reorderPoint;
        } else if (filter === 'STAGNANT') {
            matchesFilter = stock > 50;
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">المخزن & المرتجعات</h1>
                    <p className="text-gray-400 text-sm mt-1">إدارة المخزون والمنتجات المرتجعة في مكان واحد.</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Tabs */}
                    <div className="flex bg-surface-dark border border-white/10 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('INVENTORY')}
                            className={cn(
                                "px-6 py-2 rounded-md text-sm font-bold transition-all",
                                activeTab === 'INVENTORY' ? "bg-gold-500 text-rich-black shadow-lg" : "text-gray-400 hover:text-white"
                            )}
                        >
                            المخزن العام
                        </button>
                        <button
                            onClick={() => setActiveTab('RETURNS')}
                            className={cn(
                                "px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2",
                                activeTab === 'RETURNS' ? "bg-gold-500 text-rich-black shadow-lg" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <RefreshCcw className="w-4 h-4" />
                            طلبات الاسترجاع
                        </button>
                    </div>

                    {activeTab === 'RETURNS' && (
                        <button
                            onClick={() => setIsAddReturnModalOpen(true)}
                            className="bg-gold-500 hover:bg-gold-600 text-rich-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-gold-500/10 h-[42px]"
                        >
                            <Plus className="w-4 h-4" />
                            <span>اضافة طلب استرجاع</span>
                        </button>
                    )}
                </div>
            </div>

            {activeTab === 'INVENTORY' ? (
                /* Inventory View */
                <>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                placeholder="بحث عن منتج..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-full pr-12 pl-4 py-2 text-white text-sm focus:border-gold-500 outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('ALL')}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === 'ALL' ? 'bg-gold-500 text-rich-black' : 'bg-surface-dark text-gray-400 hover:text-white'}`}
                            >
                                الكل
                            </button>
                            <button
                                onClick={() => setFilter('LOW_STOCK')}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === 'LOW_STOCK' ? 'bg-red-500 text-white' : 'bg-surface-dark text-gray-400 hover:text-white'}`}
                            >
                                نواقص
                            </button>
                            <button
                                onClick={() => setFilter('STAGNANT')}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === 'STAGNANT' ? 'bg-blue-500 text-white' : 'bg-surface-dark text-gray-400 hover:text-white'}`}
                            >
                                رواكد
                            </button>
                        </div>
                    </div>

                    {/* Inventory List */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredProducts.map((product) => {
                            const totalStock = getStockLevel(product);
                            const reorderLevel = product.reorderPoint || 10;
                            const isLowStock = totalStock <= reorderLevel;

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "group bg-surface-dark border rounded-2xl p-5 flex flex-col lg:flex-row items-center gap-6 transition-all hover:border-gold-500/30 shadow-xl",
                                        isLowStock ? 'border-rose-500/20 bg-rose-500/[0.02]' : 'border-white/5'
                                    )}
                                >
                                    <div className="relative w-24 h-28 rounded-xl overflow-hidden border border-white/10 bg-rich-black shrink-0">
                                        <Image
                                            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="flex-1 text-center lg:text-right min-w-0">
                                        <div className="flex flex-col">
                                            <h3 className="font-bold text-white text-xl group-hover:text-gold-300 transition-colors truncate">{product.name}</h3>
                                            <div className="flex items-center justify-center lg:justify-start gap-2 mt-1">
                                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 font-bold uppercase">{product.category}</span>
                                                <span className="text-[10px] text-gray-500 font-mono">ID: {product.id.slice(-8)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full lg:w-auto justify-around lg:justify-end py-4 lg:py-0 border-y lg:border-0 border-white/5">
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">المخزون الحالي</p>
                                            <div className="flex items-baseline gap-1 justify-center">
                                                <p className={cn(
                                                    "text-2xl font-bold font-mono",
                                                    isLowStock ? 'text-rose-500' : 'text-emerald-500'
                                                )}>{totalStock}</p>
                                                <p className="text-[10px] text-gray-600">قطعة</p>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">حد الطلب</p>
                                            <p className="text-2xl font-mono text-white/80">{reorderLevel}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                                        {isLowStock ? (
                                            <div className="flex bg-rose-500/10 text-rose-500 px-4 py-2 rounded-xl text-xs font-bold items-center gap-2 border border-rose-500/10">
                                                <AlertTriangle className="w-4 h-4" />
                                                مطلوب الشراء
                                            </div>
                                        ) : (
                                            <div className="flex bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-xs font-bold items-center gap-2 border border-emerald-500/10">
                                                <CheckCircle className="w-4 h-4" />
                                                متوفر بكثرة
                                            </div>
                                        )}

                                        <div className="relative">
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === product.id ? null : product.id)}
                                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {activeMenu === product.id && (
                                                <div className="absolute left-0 lg:right-auto lg:left-0 z-50 top-full mt-2 w-52 bg-surface-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                                                    <button
                                                        onClick={() => handleOpenEdit(product)}
                                                        className="w-full text-right px-5 py-4 text-sm text-gray-300 hover:bg-gold-500 hover:text-rich-black transition-all flex items-center gap-3"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        تعديل المخزون والتنبيهات
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                        {filteredProducts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4">
                                <Package className="w-16 h-16 opacity-20" />
                                <p className="text-lg">لا توجد منتجات مطابقة للبحث.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                /* Returns View */
                <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse min-w-[800px]">
                            <thead>
                                <tr className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/5">
                                    <th className="px-6 py-5">المعرف</th>
                                    <th className="px-6 py-5">المنتج</th>
                                    <th className="px-6 py-5">الحالة (المخزن)</th>
                                    <th className="px-6 py-5">حالة الطلب</th>
                                    <th className="px-6 py-5">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {loadingReturns ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <RefreshCcw className="w-8 h-8 animate-spin text-gold-500 opacity-50" />
                                                <p className="text-gray-500 text-sm">جاري تحميل المرتجعات...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : returns.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-3 text-gray-600">
                                                <ShoppingBag className="w-12 h-12 opacity-10" />
                                                <p>لا توجد مرتجعات مسجلة حالياً</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    returns.map((ret) => (
                                        <tr key={ret.id} className="group hover:bg-white/[0.01] transition-all">
                                            <td className="px-6 py-6">
                                                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">#{ret.id.slice(-8)}</span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-sm">
                                                        {ret.orderItem?.product?.name || 'منتج غير معروف'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 mt-0.5">الكمية: {ret.quantity} قطعة</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-mono">
                                                <div className={cn(
                                                    "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border",
                                                    ret.type === 'VALID' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                        ret.type === 'DAMAGED' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                                            ret.type === 'WASH' ? "bg-sky-500/10 text-sky-500 border-sky-500/20" :
                                                                "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                )}>
                                                    {ret.type === 'VALID' ? 'صالح للبيع' :
                                                        ret.type === 'DAMAGED' ? 'تالف' :
                                                            ret.type === 'WASH' ? 'يحتاج غسيل' : 'إعادة تغليف'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full ring-4 shadow-sm",
                                                        ret.status === 'APPROVED' ? "bg-emerald-500 ring-emerald-500/10" :
                                                            ret.status === 'REJECTED' ? "bg-rose-500 ring-rose-500/10" : "bg-amber-500 ring-amber-500/10"
                                                    )}></div>
                                                    <span className={cn(
                                                        "text-[10px] font-bold uppercase",
                                                        ret.status === 'APPROVED' ? "text-emerald-500" :
                                                            ret.status === 'REJECTED' ? "text-rose-500" : "text-amber-500"
                                                    )}>
                                                        {ret.status === 'APPROVED' ? 'تمت التسوية' :
                                                            ret.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                {ret.status === 'PENDING' && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleUpdateReturnStatus(ret.id, 'APPROVED')}
                                                            className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                                                            title="على الرف (صالح)"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateReturnStatus(ret.id, 'REJECTED')}
                                                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                                            title="إلغاء المرتجع"
                                                        >
                                                            <AlertCircle className="w-5 h-5" />
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
            )}

            {/* Edit Modal (Only for Inventory) */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="تعديل المخزون"
            >
                <div className="space-y-6">
                    {selectedProduct && (
                        <>
                            <div className="bg-white/5 p-4 rounded-xl flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/20">
                                    {selectedProduct.images && selectedProduct.images[0] && (
                                        <Image src={selectedProduct.images[0].url} alt={selectedProduct.name} fill className="object-cover" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">{selectedProduct.name}</h3>
                                    <p className="text-sm text-gray-400">{selectedProduct.category}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">حد الطلب (Reorder Point)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={newReorderPoint}
                                    onChange={(e) => setNewReorderPoint(Number(e.target.value))}
                                    className="w-full bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                                />
                                <p className="text-xs text-gray-500">سيظهر تنبيه عندما يقل المخزون عن هذا العدد.</p>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <h4 className="text-white font-bold mb-4">المخزون حسب المتغيرات</h4>
                                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {editingVariants.map((variant) => (
                                        <div key={variant.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-2">
                                                    {variant.color && (
                                                        <span className="px-2 py-1 bg-black/30 rounded text-xs text-gray-300 border border-white/5">
                                                            {variant.color}
                                                        </span>
                                                    )}
                                                    {variant.size && (
                                                        <span className="px-2 py-1 bg-black/30 rounded text-xs text-gray-300 border border-white/5">
                                                            {variant.size}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <label className="text-[10px] text-gray-500">صالح</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={variant.stock}
                                                        onChange={(e) => handleVariantStockChange(variant.id, 'stock', e.target.value)}
                                                        className="w-16 bg-rich-black border border-white/10 rounded-lg p-1 text-center text-white focus:border-gold-500 outline-none text-xs"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1 items-center">
                                                    <label className="text-[10px] text-red-500/70">تالف</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={variant.damagedStock || 0}
                                                        onChange={(e) => handleVariantStockChange(variant.id, 'damagedStock', e.target.value)}
                                                        className="w-16 bg-rich-black border border-white/10 rounded-lg p-1 text-center text-white focus:border-red-500 outline-none text-xs"
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                    {editingVariants.length === 0 && (
                                        <div className="bg-white/5 p-4 rounded-xl space-y-4">
                                            <p className="text-gray-400 text-xs">هذا المنتج لا يحتوي على متغيرات (ألوان/مقاسات). يمكنك ضبط المخزون العام هنا وسيتم إنشاء متغير أساسي تلقائياً.</p>
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-[10px] text-gray-500 block">الكمية الصالحة (عدد القطع)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={baseStock}
                                                        onChange={(e) => setBaseStock(Number(e.target.value))}
                                                        className="w-full bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none text-center"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-[10px] text-red-500/70 block">الكمية التالفة</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={baseDamagedStock}
                                                        onChange={(e) => setBaseDamagedStock(Number(e.target.value))}
                                                        className="w-full bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none text-center"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleSaveInventory}
                                disabled={isSaving}
                                className="w-full bg-gold-500 hover:bg-gold-600 text-rich-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5" />
                                {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                            </button>
                        </>
                    )}
                </div>
            </Modal>

            {/* Add Return Request Modal */}
            <Modal
                isOpen={isAddReturnModalOpen}
                onClose={() => setIsAddReturnModalOpen(false)}
                title="اضافة طلب استرجاع جديد"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">رقم الطلب</label>
                        <input
                            placeholder="65ba... (رقم الطلب من قائمة الطلبات)"
                            value={newReturn.orderId}
                            onChange={(e) => setNewReturn({ ...newReturn, orderId: e.target.value })}
                            className="w-full bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">المنتج</label>
                        <select
                            value={newReturn.productId}
                            onChange={(e) => setNewReturn({ ...newReturn, productId: e.target.value })}
                            className="w-full bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none appearance-none"
                        >
                            <option value="">اختر المنتج...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">الحالة</label>
                            <select
                                value={newReturn.type}
                                onChange={(e) => setNewReturn({ ...newReturn, type: e.target.value })}
                                className="w-full bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none appearance-none"
                            >
                                <option value="VALID">صالح للبيع</option>
                                <option value="DAMAGED">تالف</option>
                                <option value="WASH">يحتاج غسيل</option>
                                <option value="REPACKAGE">إعادة تغليف</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">الكمية</label>
                            <input
                                type="number"
                                min="1"
                                value={newReturn.quantity}
                                onChange={(e) => setNewReturn({ ...newReturn, quantity: Number(e.target.value) })}
                                className="w-full bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">ملاحظات</label>
                        <textarea
                            rows={3}
                            placeholder="سبب الاسترجاع أو تفاصيل إضافية..."
                            className="w-full bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={() => setIsAddReturnModalOpen(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={async () => {
                                if (!newReturn.orderId || !newReturn.productId) {
                                    alert("يرجى إدخال رقم الطلب واختيار المنتج");
                                    return;
                                }
                                setIsSubmittingReturn(true);
                                try {
                                    const res = await fetch('/api/returns', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(newReturn)
                                    });
                                    if (res.ok) {
                                        setIsAddReturnModalOpen(false);
                                        loadReturns();
                                        setNewReturn({ orderId: '', productId: '', type: 'VALID', quantity: 1, notes: '' });
                                        alert("تم إضافة طلب الاسترجاع بنجاح");
                                    } else {
                                        const err = await res.json();
                                        alert(`فشل الإضافة: ${err.message || 'Error'}`);
                                    }
                                } catch (e) {
                                    console.error(e);
                                    alert("حدث خطأ أثناء الاتصال بالخادم");
                                } finally {
                                    setIsSubmittingReturn(false);
                                }
                            }}
                            disabled={isSubmittingReturn}
                            className="bg-gold-500 hover:bg-gold-600 text-rich-black px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                        >
                            {isSubmittingReturn ? "جاري الحفظ..." : "إضافة الطلب"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
