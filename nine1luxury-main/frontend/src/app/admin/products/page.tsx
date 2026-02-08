"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    Upload,
    ChevronRight,
    ChevronLeft,
    X,
    Download
} from "lucide-react";
import Image from "next/image";
import { useProducts } from "@/context/ProductContext";
import { Product, ProductVariant } from "@/lib/api";
import { createArabicPDF, reshapeArabic, autoTable } from "@/lib/pdf-utils";

export default function AdminProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("الكل");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Use Global Context
    const { products, addProduct, deleteProduct, updateProduct } = useProducts();

    const categories = ["الكل", "هوديز", "تيشرتات", "بناطيل", "سويت شيرتات"];
    const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    // availableColors removed in favor of dynamic hex input

    const [isUploading, setIsUploading] = useState(false);

    const [newProduct, setNewProduct] = useState<{
        name: string;
        model: string;
        price: string;
        category: string;
        description: string;
        image: string;
        sizes: string[];
        colors: { name: string; hex: string }[];
    }>({
        name: '',
        model: '',
        price: '',
        category: 'تيشرتات',
        description: '',
        image: '',
        sizes: [],
        colors: []
    });

    // State for all product images: Array of File objects or URL strings
    const [productGallery, setProductGallery] = useState<(File | string)[]>([]);

    // State for size chart image
    const [sizeChartImage, setSizeChartImage] = useState<File | string | null>(null);

    // Edit & View State
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

    // Color Input State
    const [colorInput, setColorInput] = useState("");


    const toggleSize = (size: string) => {
        setNewProduct(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleEditClick = (product: Product) => {
        try {
            setEditingProduct(product);

            // Extract unique sizes and colors from variants, filtering out null/undefined
            const sizesSet = new Set<string>();
            const colorNamesSet = new Set<string>();

            if (product.variants && Array.isArray(product.variants)) {
                product.variants.forEach(v => {
                    if (v.size) sizesSet.add(v.size);
                    if (v.color) colorNamesSet.add(v.color);
                });
            }

            const sizes = Array.from(sizesSet);
            const colorNames = Array.from(colorNamesSet);

            // Map color names/hex from variants safely
            const colors = colorNames.map(name => {
                const variant = product.variants?.find((v: ProductVariant) => v.color === name);
                const safeName = name || ''; // Should not happen due to Set filtering, but safety first
                return {
                    name: safeName,
                    hex: variant?.colorHex || (safeName.startsWith('#') ? safeName : '#000000')
                };
            });

            // Handle legacy image field if images array is empty
            const mainImage = product.images?.[0]?.url || (product as any).image || '';

            setNewProduct({
                name: product.name || '',
                model: product.model || '',
                price: product.price != null ? product.price.toString() : '0',
                category: product.category || 'تيشرتات',
                description: product.description || '',
                image: mainImage,
                sizes: sizes,
                colors: colors
            });

            // Pre-fill gallery from existing product images
            const initialGallery = product.images?.map((img: any) => img.url).filter((url: string) => url) || [];

            // If we have a main image but gallery is empty (legacy data), add it
            if (mainImage && initialGallery.length === 0) {
                initialGallery.push(mainImage);
            }

            setProductGallery(initialGallery);

            // Pre-fill size chart image if exists
            setSizeChartImage(product.sizeChartImage || null);

            setIsAddModalOpen(true);
        } catch (error) {
            console.error("Error opening edit modal:", error);
            alert("حدث خطأ غير متوقع أثناء فتح نافذة التعديل.");
        }
    };

    const handleViewClick = (product: Product) => {
        setViewingProduct(product);
        setIsViewModalOpen(true);
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            // 1. Upload all new images from productGallery state
            const finalGalleryUrls: string[] = [];

            const uploadPromises = productGallery.map(async (fileOrUrl) => {
                if (fileOrUrl instanceof File) {
                    const formData = new FormData();
                    formData.append('file', fileOrUrl);

                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    const uploadData = await uploadRes.json();
                    if (uploadData.success) {
                        finalGalleryUrls.push(uploadData.url);
                    } else {
                        throw new Error(uploadData.message || `Failed to upload image`);
                    }
                } else {
                    // It's already a URL string
                    finalGalleryUrls.push(fileOrUrl as string);
                }
            });

            await Promise.all(uploadPromises);

            // 2. Upload size chart image if provided
            let finalSizeChartUrl: string | null = null;
            if (sizeChartImage) {
                if (sizeChartImage instanceof File) {
                    const formData = new FormData();
                    formData.append('file', sizeChartImage);

                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    const uploadData = await uploadRes.json();
                    if (uploadData.success) {
                        finalSizeChartUrl = uploadData.url;
                    } else {
                        throw new Error(uploadData.message || 'Failed to upload size chart image');
                    }
                } else {
                    // It's already a URL string
                    finalSizeChartUrl = sizeChartImage as string;
                }
            }

            // 3. Determine main image (use first color's image or fallback)
            // If we have colors, picking the first one as "main" if newProduct.image is empty or needs update


            // Create a basic product object for the UI/Context
            const productForUI: Partial<Product> = {
                name: newProduct.name,
                model: newProduct.model,
                description: newProduct.description,
                price: Number(newProduct.price),
                category: newProduct.category,
                featured: false,
                sizeChartImage: finalSizeChartUrl || undefined,
                // These will be properly populated by the backend
                variants: newProduct.colors.flatMap(color =>
                    newProduct.sizes.map(size => ({
                        color: color.name,
                        colorHex: color.hex,
                        size: size,
                        stock: 0,
                    } as ProductVariant))
                ),
                // Construct images array
                images: finalGalleryUrls.map((url, index) => ({
                    id: 'temp-' + index,
                    url: url,
                })),
                isActive: editingProduct ? editingProduct.isActive : true
            };

            // Update Global State
            if (editingProduct) {
                await updateProduct(editingProduct.id, productForUI);
                alert('تم تحديث المنتج بنجاح!');
            } else {
                await addProduct(productForUI);
                alert('تمت إضافة المنتج بنجاح!');
            }

            setIsAddModalOpen(false);
            setEditingProduct(null);
            setNewProduct({ name: '', model: '', price: '', category: 'تيشرتات', description: '', image: '', sizes: [], colors: [] });
            setProductGallery([]);
            setSizeChartImage(null);
        } catch (error: any) {
            console.error('Product save error:', error);
            const errorMessage = error?.message || 'حدث خطأ أثناء حفظ المنتج';
            alert(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const downloadPDF = () => {
        const doc = createArabicPDF();
        doc.setFontSize(22);
        doc.text(reshapeArabic("تقرير المنتجات"), 105, 15, { align: "center" });
        doc.setFontSize(10);
        doc.text(reshapeArabic(`تاريخ الإنشاء: ${new Date().toLocaleString('ar-EG')}`), 105, 22, { align: "center" });

        const tableData = filteredProducts.map(p => [
            reshapeArabic(p.name),
            p.model || "-",
            reshapeArabic(p.category),
            `${p.price} ج.م`,
            p.variants?.reduce((acc: number, v: ProductVariant) => acc + (v.stock || 0), 0) || 0,
            reshapeArabic(p.isActive !== false ? "نشط" : "غير نشط")
        ]);

        autoTable(doc, {
            head: [[reshapeArabic('المنتج'), reshapeArabic('الموديل'), reshapeArabic('القسم'), reshapeArabic('السعر'), reshapeArabic('المخزون'), reshapeArabic('الحالة')]],
            body: tableData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [174, 132, 57], font: 'Amiri', halign: 'center' },
            styles: { font: "Amiri", halign: 'center' },
        });

        doc.save(`products-${new Date().getTime()}.pdf`);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "الكل" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">إدارة المنتجات</h1>
                    <p className="text-gray-400 text-sm mt-1">عرض وتعديل وإضافة منتجات جديدة للمتجر.</p>
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
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-gold-500 text-rich-black px-6 py-3 rounded-xl font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/10"
                    >
                        <Plus className="w-4 h-4" />
                        <span>إضافة منتج جديد</span>
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-4 bg-surface-dark/50 border border-white/5 p-4 rounded-3xl">
                <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="ابحث باسم المنتج فقط..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-rich-black border border-white/5 rounded-full pr-12 pl-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-6 py-3 rounded-full text-xs font-bold transition-all border",
                                selectedCategory === cat
                                    ? "bg-gold-500 border-gold-500 text-rich-black"
                                    : "bg-rich-black border-white/5 text-gray-400 hover:border-gold-500/30"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                                <th className="px-6 py-5">المنتج</th>
                                <th className="px-6 py-5">الموديل</th>
                                <th className="px-6 py-5">القسم</th>
                                <th className="px-6 py-5">السعر</th>
                                <th className="px-6 py-5">المخزون</th>
                                <th className="px-6 py-5">الحالة</th>
                                <th className="px-6 py-5 text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-12 h-14 bg-rich-black rounded-lg overflow-hidden shrink-0">
                                                        <Image
                                                            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white group-hover:text-gold-300 transition-colors">{product.name}</p>
                                                        <p className="text-[10px] text-gray-500 mt-0.5 tracking-widest uppercase">ID: {String(product.id)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-mono text-gray-300">{product.model || '-'}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 font-bold uppercase">{product.category}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">{formatPrice(product.price * (product.discount ? (1 - product.discount / 100) : 1))}</span>
                                                    {product.discount && <span className="text-[10px] text-gray-500 line-through">{formatPrice(product.price)}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="w-24 bg-rich-black h-1 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-gold-500 h-full transition-all duration-500"
                                                            style={{ width: `${Math.min(((product.variants?.reduce((acc: number, v: ProductVariant) => acc + (v.stock || 0), 0) || 0) / 50) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-gray-500 font-bold">
                                                        {product.variants?.reduce((acc: number, v: ProductVariant) => acc + (v.stock || 0), 0) || 0} قطعة متاحة
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await updateProduct(product.id, { ...product, isActive: !product.isActive });
                                                        } catch {
                                                            alert('فشل تحديث الحالة');
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                                >
                                                    <span className={cn(
                                                        "w-1.5 h-1.5 rounded-full ring-4",
                                                        product.isActive !== false ? "bg-green-500 ring-green-500/10" : "bg-red-500 ring-red-500/10"
                                                    )}></span>
                                                    <span className={cn(
                                                        "text-[10px] font-bold uppercase",
                                                        product.isActive !== false ? "text-green-500" : "text-red-500"
                                                    )}>
                                                        {product.isActive !== false ? "موجود بالمخزن" : "نفد من المخزن"}
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="px-6 py-5 text-left">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewClick(product)}
                                                        className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                        title="عرض"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(product)}
                                                        className="p-2 text-gray-500 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-all"
                                                        title="تعديل"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                                                                deleteProduct(product.id);
                                                            }
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                        title="حذف"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <Search className="w-8 h-8 text-gray-600" />
                                                <p className="text-gray-500 font-medium">لا توجد نتائج مطابقة للبحث</p>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 bg-white/2 flex items-center justify-between border-t border-white/5">
                    <p className="text-xs text-gray-500">عرض {filteredProducts.length} منتج</p>
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent" disabled><ChevronRight className="w-4 h-4" /></button>
                        <button className="w-8 h-8 rounded-lg bg-gold-500 text-rich-black flex items-center justify-center text-xs font-bold">1</button>
                        <button className="p-2 text-gray-500 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface-dark border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-rich-black/50">
                                <h2 className="text-xl font-bold text-white font-playfair">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddProduct} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">اسم المنتج</label>
                                    <input
                                        required
                                        type="text"
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none"
                                        placeholder="مثال: تيشرت بريميوم"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">كود الموديل</label>
                                    <input
                                        type="text"
                                        value={newProduct.model}
                                        onChange={e => setNewProduct({ ...newProduct, model: e.target.value })}
                                        className="w-full bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none"
                                        placeholder="مثال: A-101"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">السعر</label>
                                        <input
                                            required
                                            type="number"
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                            className="w-full bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">القسم</label>
                                        <select
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                            className="w-full bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none appearance-none"
                                        >
                                            {categories.filter(c => c !== 'الكل').map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Sizes */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">المقاسات المتاحة</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleSize(size)}
                                                className={cn(
                                                    "w-10 h-10 rounded-lg text-xs font-bold transition-all border",
                                                    newProduct.sizes.includes(size)
                                                        ? "bg-gold-500 border-gold-500 text-rich-black"
                                                        : "bg-rich-black border-white/10 text-gray-400 hover:border-gold-500/50"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">الألوان المتاحة</label>

                                    <div className="bg-rich-black/50 border border-white/5 p-4 rounded-xl space-y-4">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                {/* Circular Color Picker */}
                                                <div className="relative group shrink-0">
                                                    <input
                                                        type="color"
                                                        id="colorPicker"
                                                        value={/^#[0-9A-F]{6}$/i.test(colorInput) ? colorInput : '#000000'}
                                                        className="w-12 h-12 rounded-full cursor-pointer overflow-hidden border-2 border-white/10 p-0 bg-transparent transition-transform hover:scale-105 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full"
                                                        onChange={(e) => setColorInput(e.target.value)}
                                                    />
                                                </div>

                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        placeholder="اسم اللون (مثال: أحمر)"
                                                        id="colorNameInput"
                                                        className="w-full bg-rich-black border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-gold-500/50 outline-none transition-all placeholder:text-gray-600"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="#000000"
                                                        value={colorInput}
                                                        onChange={(e) => setColorInput(e.target.value)}
                                                        className="w-full bg-rich-black border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm uppercase font-mono focus:border-gold-500/50 outline-none transition-all placeholder:text-gray-600"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    let val = colorInput.trim();
                                                    if (!val.startsWith('#')) val = '#' + val;
                                                    const nameInput = document.querySelector('#colorNameInput') as HTMLInputElement;
                                                    const name = nameInput?.value?.trim() || val;

                                                    if (/^#[0-9A-F]{6}$/i.test(val)) {
                                                        if (!newProduct.colors.some(c => c.hex === val)) {
                                                            setNewProduct(prev => ({
                                                                ...prev,
                                                                colors: [...prev.colors, { name, hex: val }]
                                                            }));
                                                            setColorInput('');
                                                            if (nameInput) nameInput.value = '';
                                                        }
                                                    } else {
                                                        alert('يرجى إدخال كود لون صحيح (HEX)');
                                                    }
                                                }}
                                                className="w-full bg-gold-500 text-rich-black py-3 rounded-lg text-sm font-bold hover:bg-gold-300 transition-colors shadow-lg shadow-gold-500/10"
                                            >
                                                إضافة اللون
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {newProduct.colors.map(color => (
                                            <button
                                                key={color.hex}
                                                type="button"
                                                onClick={() => {
                                                    setNewProduct(prev => ({
                                                        ...prev,
                                                        colors: prev.colors.filter(c => c.hex !== color.hex)
                                                    }));
                                                }}
                                                className="group relative w-10 h-10 rounded-full border border-white/10 transition-all hover:scale-110"
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            >
                                                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 text-white rounded-full text-[10px] break-words p-1 leading-none text-center">{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">صور المنتج</label>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {productGallery.map((img, idx) => (
                                            <div key={idx} className="relative aspect-[3/4] bg-rich-black rounded-xl overflow-hidden border border-white/10 group">
                                                <Image
                                                    src={img instanceof File ? URL.createObjectURL(img) : img}
                                                    alt={`Product ${idx}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newGallery = [...productGallery];
                                                        newGallery.splice(idx, 1);
                                                        setProductGallery(newGallery);
                                                    }}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}

                                        <label className="relative aspect-[3/4] bg-rich-black/50 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500/50 transition-all group">
                                            <Upload className="w-8 h-8 text-gray-600 group-hover:text-gold-500 transition-colors" />
                                            <span className="text-xs text-gray-600 mt-2 group-hover:text-gold-500 transition-colors">إضافة صورة</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files || []);
                                                    setProductGallery(prev => [...prev, ...files]);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Size Chart Image */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">صورة جدول المقاسات (اختياري)</label>

                                    {sizeChartImage ? (
                                        <div className="relative aspect-video bg-rich-black rounded-xl overflow-hidden border border-white/10 group">
                                            <Image
                                                src={sizeChartImage instanceof File ? URL.createObjectURL(sizeChartImage) : sizeChartImage}
                                                alt="Size Chart"
                                                fill
                                                className="object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setSizeChartImage(null)}
                                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="relative aspect-video bg-rich-black/50 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500/50 transition-all group">
                                            <Upload className="w-8 h-8 text-gray-600 group-hover:text-gold-500 transition-colors" />
                                            <span className="text-xs text-gray-600 mt-2 group-hover:text-gold-500 transition-colors">رفع صورة جدول المقاسات</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setSizeChartImage(file);
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">وصف المنتج</label>
                                    <textarea
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                        className="w-full bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none h-24 resize-none"
                                        placeholder="وصف مختصر للمنتج..."
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-colors"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="flex-1 px-4 py-3 rounded-xl bg-gold-500 text-rich-black font-bold hover:bg-gold-300 transition-colors shadow-lg shadow-gold-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? 'جاري الحفظ...' : (editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* View Product Modal */}
            <AnimatePresence>
                {isViewModalOpen && viewingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface-dark border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-rich-black/50">
                                <h2 className="text-xl font-bold text-white font-playfair">تفاصيل المنتج</h2>
                                <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                <div className="flex gap-4">
                                    <Image
                                        src={viewingProduct.images?.[0]?.url || ''}
                                        alt={viewingProduct.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{viewingProduct.name}</h3>
                                        <p className="text-xs text-gray-500 font-mono mt-1">{viewingProduct.model}</p>
                                        <span className="inline-block mt-2 text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 font-bold uppercase">{viewingProduct.category}</span>
                                        <p className="text-gold-500 font-bold mt-2">{formatPrice(viewingProduct.price)}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">الألوان والمقاسات</h4>
                                    <div className="bg-rich-black border border-white/5 rounded-xl p-4">
                                        {/* Group variants by color */}
                                        {viewingProduct.variants && Object.entries(viewingProduct.variants.reduce((acc: Record<string, ProductVariant[]>, v: ProductVariant) => {
                                            if (!acc[v.color]) acc[v.color] = [];
                                            acc[v.color].push(v);
                                            return acc;
                                        }, {})).map(([color, variants]) => (
                                            <div key={color} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                                                <div className="w-20 text-sm text-gray-400">{color}</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {(variants as ProductVariant[]).map((v) => (
                                                        <span key={v.size} className="text-xs bg-white/5 px-2 py-1 rounded text-white font-mono">
                                                            {v.size} ({v.stock})
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">الوصف</h4>
                                    <p className="text-sm text-gray-300 leading-relaxed bg-rich-black border border-white/5 rounded-xl p-4">
                                        {viewingProduct.description || 'لا يوجد وصف'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );

}
