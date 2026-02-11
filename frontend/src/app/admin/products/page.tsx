"use client";

import { useState, useMemo } from "react";
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
    Settings
} from "lucide-react";
import Image from "next/image";
import { useProducts } from "@/context/ProductContext";
import { formatPrice, cn } from "@/lib/utils";
import { Product, ProductVariant } from "@/lib/api";

export default function AdminProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("الكل");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Use Global Context
    const {
        products, addProduct, deleteProduct, updateProduct,
        categories: dbCategories, addCategory, updateCategory, deleteCategory
    } = useProducts();

    const categories = useMemo(() => {
        const base = ["الكل", "هوديز", "تيشرتات", "بناطيل", "سويت شيرتات"];
        const fromDb = dbCategories.map(c => c.name);
        const fromProducts = products.map(p => p.category);
        return Array.from(new Set([...base, ...fromDb, ...fromProducts]));
    }, [products, dbCategories]);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryInput, setCategoryInput] = useState("");
    const [editingCatId, setEditingCatId] = useState<string | null>(null);

    const [showCategoryInput, setShowCategoryInput] = useState(false);

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
        setEditingProduct(product);

        // Extract unique sizes and colors from variants
        const sizes = Array.from(new Set(product.variants?.map((v: ProductVariant) => v.size) || [])) as string[];
        const colorNames = Array.from(new Set(product.variants?.map((v: ProductVariant) => v.color) || []));

        // Map color names/hex from variants
        const colors = colorNames.map(name => {
            const variant = product.variants?.find((v: ProductVariant) => v.color === name);
            return {
                name: name as string,
                hex: variant?.colorHex || ((name as string).startsWith('#') ? name as string : '#000000')
            };
        });

        setNewProduct({
            name: product.name,
            model: product.model || '',
            price: product.price.toString(),
            category: product.category,
            description: product.description,
            image: product.images?.[0]?.url || product.image || '',
            sizes: sizes,
            colors: colors
        });

        // Pre-fill gallery from existing product images
        const initialGallery = product.images?.map((img: any) => img.url) || [];
        setProductGallery(initialGallery);

        // Pre-fill size chart image if exists
        setSizeChartImage(product.sizeChartImage || null);

        setIsAddModalOpen(true);
    };

    const handleViewClick = (product: Product) => {
        setViewingProduct(product);
        setIsViewModalOpen(true);
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            // 1. Process images from productGallery state (assuming URLs now)
            const finalGalleryUrls: string[] = productGallery.filter(item => typeof item === 'string') as string[];

            // 2. Process size chart image (assuming URL now)
            let finalSizeChartUrl: string | null = typeof sizeChartImage === 'string' ? sizeChartImage : null;

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
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gold-500 text-rich-black px-6 py-3 rounded-xl font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/10"
                >
                    <Plus className="w-4 h-4" />
                    <span>إضافة منتج جديد</span>
                </button>
            </div>

            {/* Premium Filters & Search Toolbar */}
            <div className="bg-surface-dark/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none" />

                <div className="flex flex-col xl:flex-row gap-6 items-stretch xl:items-center relative z-10">
                    {/* Search Component */}
                    <div className="relative group flex-1">
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-gold-500/10 rounded-lg group-focus-within:bg-gold-500 transition-all duration-300">
                            <Search className="w-4 h-4 text-gold-500 group-focus-within:text-rich-black" />
                        </div>
                        <input
                            type="text"
                            placeholder="ابحث بالاسم، الموديل، أو الكود..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-rich-black/50 border border-white/10 rounded-2xl pr-14 pl-5 py-4 text-sm text-white placeholder:text-gray-600 focus:border-gold-500/50 focus:bg-rich-black outline-none transition-all shadow-inner focus:ring-1 focus:ring-gold-500/20"
                        />
                    </div>

                    {/* Quick Category Stats/Filter Label */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold whitespace-nowrap">إجمالي المنتجات:</span>
                        <span className="text-sm font-bold text-gold-500 font-mono">{filteredProducts.length}</span>
                    </div>

                    {/* Manage Categories Action */}
                    <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-gold-500/5 border border-gold-500/20 rounded-2xl text-gold-500 hover:bg-gold-500 hover:text-rich-black transition-all duration-300 font-bold text-sm"
                    >
                        <Settings className="w-4 h-4 animate-spin-slow" />
                        <span className="whitespace-nowrap">إدارة الأقسام</span>
                    </button>
                </div>

                {/* Horizontal Category Scroll */}
                <div className="relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-surface-dark/0 via-surface-dark/0 to-transparent z-10 pointer-events-none" />
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-6 py-3 rounded-2xl text-xs font-bold transition-all duration-300 whitespace-nowrap border relative overflow-hidden group/btn",
                                    selectedCategory === cat
                                        ? "bg-gold-500 border-gold-500 text-rich-black shadow-lg shadow-gold-500/20 scale-105"
                                        : "bg-surface-dark border-white/5 text-gray-500 hover:border-white/20 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <span className="relative z-10">{cat}</span>
                                {selectedCategory === cat && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gold-300 pointer-events-none mix-blend-overlay opacity-50"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Table Wrapper */}
            <div className="bg-surface-dark/60 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                <th className="px-8 py-6">المنتج</th>
                                <th className="px-8 py-6 text-center">الموديل</th>
                                <th className="px-8 py-6 text-center">القسم</th>
                                <th className="px-8 py-6 text-center">السعر</th>
                                <th className="px-8 py-6 text-center">المخزون</th>
                                <th className="px-8 py-6 text-center">الحالة</th>
                                <th className="px-8 py-6 text-left">الإجراءات</th>
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
                                                        <p className="text-[10px] text-gray-500 mt-0.5 tracking-widest uppercase">ID: {product.id.slice(0, 8)}</p>
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">القسم</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCategoryInput(!showCategoryInput)}
                                                    className="text-[10px] text-gold-500 hover:text-gold-300 underline"
                                                >
                                                    {showCategoryInput ? 'اختيار من القائمة' : 'إضافة قسم جديد'}
                                                </button>
                                            </div>
                                            {showCategoryInput ? (
                                                <input
                                                    type="text"
                                                    value={newProduct.category}
                                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                                    className="w-full bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none"
                                                    placeholder="اسم القسم الجديد..."
                                                />
                                            ) : (
                                                <select
                                                    value={newProduct.category}
                                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                                    className="w-full bg-rich-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none appearance-none"
                                                >
                                                    {categories.filter(c => c !== 'الكل').map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>

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
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                    {productGallery.map((img, idx) => (
                                        <div key={idx} className="relative aspect-[3/4] bg-rich-black rounded-xl overflow-hidden border border-white/10 group">
                                            <Image
                                                src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                                alt={`Gallery ${idx}`}
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setProductGallery(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}

                                    <label className="relative aspect-[3/4] bg-rich-black/50 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500/50 transition-all group">
                                        <Upload className="w-8 h-8 text-gray-600 group-hover:text-gold-500 transition-colors" />
                                        <span className="text-[10px] text-gray-600 mt-2 group-hover:text-gold-500 transition-colors font-bold uppercase">إضافة صورة</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                files.forEach(file => {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        const base64String = reader.result as string;
                                                        setProductGallery(prev => [...prev, base64String]);
                                                    };
                                                    reader.readAsDataURL(file);
                                                });
                                            }}
                                        />
                                    </label>
                                </div>

                                {/* Size Chart Image */}
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">رابط صورة جدول المقاسات (اختياري)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="أدخل رابط جدول المقاسات (URL)..."
                                            className="flex-1 bg-rich-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold-500 outline-none text-sm"
                                            value={typeof sizeChartImage === 'string' ? sizeChartImage : ''}
                                            onChange={(e) => setSizeChartImage(e.target.value)}
                                        />
                                    </div>
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
                            </div>
                        </form>
                    </motion.div>
                </div>
    )
}
        </AnimatePresence >

    {/* View Product Modal */ }
    <AnimatePresence>
{
    isViewModalOpen && viewingProduct && (
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
                        <div className="relative w-24 h-32 bg-rich-black rounded-lg overflow-hidden shrink-0 border border-white/10">
                            <Image
                                src={viewingProduct.images?.[0]?.url || ''}
                                alt={viewingProduct.name}
                                fill
                                className="object-cover"
                            />
                        </div>
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
    )
}
        </AnimatePresence >

    {/* Category Management Modal */ }
    <AnimatePresence>
{
    isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-surface-dark border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] relative"
            >
                {/* Decorative Header Gradient */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50" />

                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-playfair tracking-tight">إدارة الأقسام</h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">تنسيق وهيكلة متجرك الخاص</p>
                    </div>
                    <button onClick={() => {
                        setIsCategoryModalOpen(false);
                        setEditingCatId(null);
                        setCategoryInput("");
                    }} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Enhanced Add/Edit Form */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pr-2">
                            {editingCatId ? "تعديل اسم القسم" : "إضافة قسم جديد"}
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                placeholder="مثال: مجموعات شتوية..."
                                className="flex-1 bg-rich-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:border-gold-500 outline-none shadow-inner focus:bg-rich-black transition-all"
                            />
                            <button
                                onClick={async () => {
                                    if (!categoryInput.trim()) return;
                                    try {
                                        if (editingCatId) {
                                            await updateCategory(editingCatId, categoryInput);
                                        } else {
                                            await addCategory(categoryInput);
                                        }
                                        setCategoryInput("");
                                        setEditingCatId(null);
                                    } catch (err: any) {
                                        alert(err.message);
                                    }
                                }}
                                className="bg-gold-500 text-rich-black px-8 py-4 rounded-2xl font-black text-xs hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/10 active:scale-95 whitespace-nowrap"
                            >
                                {editingCatId ? "حفظ التغييرات" : "إضافة للكل"}
                            </button>
                        </div>
                        {editingCatId && (
                            <button
                                onClick={() => { setEditingCatId(null); setCategoryInput(""); }}
                                className="text-[10px] text-gray-500 hover:text-white underline pr-2"
                            >
                                إلغاء التعديل
                            </button>
                        )}
                    </div>

                    {/* Categories Scrollable List */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pr-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">الأقسام الحالية</label>
                            <span className="text-[10px] text-gold-500 font-bold">{dbCategories.length} أقسام</span>
                        </div>
                        <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                            {dbCategories.map(cat => (
                                <motion.div
                                    layout
                                    key={cat.id}
                                    className="group flex items-center justify-between bg-white/2 p-4 rounded-2xl border border-white/5 hover:border-gold-500/20 hover:bg-white/5 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500/40 group-hover:bg-gold-500 transition-colors" />
                                        <span className="text-sm font-medium text-white/90 group-hover:text-white">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingCatId(cat.id);
                                                setCategoryInput(cat.name);
                                            }}
                                            className="p-2.5 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                                            title="تعديل"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (confirm("هل أنت متأكد من حذف هذا القسم؟ سيتم حذف التصنيف من المنتجات المرتبطة.")) {
                                                    try {
                                                        await deleteCategory(cat.id);
                                                    } catch (err: any) {
                                                        alert(err.message);
                                                    }
                                                }
                                            }}
                                            className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                            title="حذف"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            {dbCategories.length === 0 && (
                                <div className="text-center py-12 bg-white/2 rounded-3xl border border-dashed border-white/10">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Settings className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <p className="text-gray-500 text-xs font-medium">قائمة الأقسام فارغة حالياً.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
        </AnimatePresence >
    </div >
);
}
