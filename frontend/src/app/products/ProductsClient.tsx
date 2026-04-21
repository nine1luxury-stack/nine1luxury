"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { X, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { PromoBanner } from "@/components/layout/PromoBanner";

const MAX_PRICE = 10000;

function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[3/5] bg-ivory/[0.03] rounded-2xl mb-4 border border-ivory/[0.04]" />
            <div className="h-4 bg-ivory/[0.03] rounded-full mb-2 w-3/4" />
            <div className="h-4 bg-ivory/[0.03] rounded-full w-1/2" />
        </div>
    );
}

const FILTERS_BASE = {
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
        { name: "أسود", hex: "#000000" },
        { name: "ذهبي", hex: "#AE8439" },
        { name: "أبيض", hex: "#FFFFFF" },
        { name: "رمادي", hex: "#4B5563" },
    ],
};

export default function ProductsClient({ initialProducts, initialCategories, error }: { initialProducts: any[], initialCategories: any[], error?: string }) {
    const products = initialProducts || [];
    const dbCategories = initialCategories || [];
    const searchParams = useSearchParams();
    const [isMounted, setIsMounted] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("جميع المنتجات");
    const [priceRange, setPriceRange] = useState(MAX_PRICE);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [displayLimit, setDisplayLimit] = useState(10); 
    const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const categories = useMemo(() => {
        const base = ["جميع المنتجات", "تيشرتات", "هوديز", "بناطيل", "سويت شيرتات"];
        const fromDb = dbCategories.map(c => c.name);
        const fromProducts = products.map(p => p.category);
        return Array.from(new Set([...base, ...fromDb, ...fromProducts]));
    }, [products, dbCategories]);

    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam && categories.includes(categoryParam)) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams, categories]);

    const filteredProducts = useMemo(() => {
        let result = products.filter((product) => {
            const categoryMatch = selectedCategory === "جميع المنتجات" || product.category === selectedCategory;
            const currentPrice = product.discount
                ? product.price * (1 - product.discount / 100)
                : product.price;
            const priceMatch = currentPrice <= priceRange;
            const sizeMatch = selectedSizes.length === 0 ||
                (product.variants && product.variants.some((variant: any) =>
                    selectedSizes.includes(variant.size)
                ));
            return categoryMatch && priceMatch && sizeMatch;
        });

        if (sortBy === "price-low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            result.sort((a, b) => b.price - a.price);
        } else {
            result.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        }

        return result;
    }, [products, selectedCategory, priceRange, selectedSizes, sortBy]);

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const activeFilterCount = (selectedCategory !== "جميع المنتجات" ? 1 : 0) + (priceRange < MAX_PRICE ? 1 : 0) + selectedSizes.length;

    return (
        <main className="min-h-screen bg-rich-black pt-32 pb-24">

            <div className="container mx-auto px-6 max-w-[1600px]">
                {/* Section Header */}
                <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="section-label"
                    >
                        مجموعتنا المختارة
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.02 }}
                        className="section-title text-3xl md:text-5xl font-almarai font-extrabold tracking-tight"
                    >
                        المتجر الرئيسي
                    </motion.h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.04 }}
                        className="h-px w-20 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"
                    />
                </div>

                <div className="mb-14">
                    <PromoBanner />
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-10 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between gap-4"
                    >
                        <p className="text-red-400 font-bold text-sm">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="text-xs bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all"
                        >
                            تحديث الصفحة
                        </button>
                    </motion.div>
                )}

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-6 flex gap-3">
                        <button
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="flex-1 bg-surface-card/80 backdrop-blur-xl border border-ivory/[0.08] p-4 rounded-2xl flex items-center justify-between text-ivory hover:border-gold-500/40 transition-all active:scale-[0.98] shadow-2xl"
                        >
                            <span className="font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-gold-500" />
                                الفلترة والتصنيف
                            </span>
                            {activeFilterCount > 0 && (
                                <span className="w-5 h-5 luxury-gradient text-rich-black text-[10px] font-black rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filter Sidebar */}
                    <aside className="hidden lg:block w-80 shrink-0 space-y-12 glass-card-premium p-10 rounded-[3rem] sticky top-16 h-fit">
                        {/* Categories */}
                        <div className="space-y-8">
                            <h3 className="text-gold-500 font-bold uppercase tracking-[0.4em] text-[10px] px-2 flex items-center justify-between font-almarai">
                                التصنيفات
                                <div className="h-[1px] flex-1 bg-gold-500/20 mr-4" />
                            </h3>
                            <div className="flex flex-col gap-1.5">
                                {categories.map((cat) => {
                                    const count = products.filter(p => cat === "جميع المنتجات" || p.category === cat).length;
                                    const isActive = selectedCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={cn(
                                                "w-full flex justify-between items-center px-4 py-4 transition-all duration-500 rounded-xl group relative overflow-hidden",
                                                isActive
                                                    ? "bg-ivory text-rich-black font-bold shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
                                                    : "text-ivory/30 hover:text-ivory/80 hover:bg-white/[0.03]"
                                            )}
                                        >
                                            <span className="text-[12px] uppercase tracking-[0.1em] z-10 font-almarai">{cat}</span>
                                            <span className={cn(
                                                "text-[10px] font-bold min-w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors z-10",
                                                isActive ? "bg-rich-black/20 text-rich-black" : "bg-white/[0.04] text-ivory/30 group-hover:bg-gold-500/10 group-hover:text-gold-500"
                                            )}>
                                                {count}
                                            </span>
                                            {isActive && (
                                                <motion.div 
                                                    layoutId="active-cat"
                                                    className="absolute inset-0 bg-ivory"
                                                    transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-6">
                            <h3 className="text-gold-500/60 font-black uppercase tracking-[0.3em] text-[10px] px-2 flex items-center justify-between">
                                السعر
                                <div className="h-[1px] flex-1 bg-gold-500/10 mr-4" />
                            </h3>
                            <div className="px-2 space-y-4">
                                <div className="relative h-2 bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.04]">
                                    <div 
                                        className="absolute top-0 right-0 h-full bg-gold-500/40"
                                        style={{ width: `${(priceRange / MAX_PRICE) * 100}%` }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max={MAX_PRICE}
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-ivory/20 font-bold uppercase">بحد أقصى</span>
                                    <span className="text-sm text-gold-500 font-playfair font-bold">
                                        {priceRange >= MAX_PRICE ? `${MAX_PRICE}+ ج.م` : `${priceRange} ج.م`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="space-y-6">
                            <h3 className="text-gold-500/60 font-black uppercase tracking-[0.3em] text-[10px] px-2 flex items-center justify-between">
                                المقاس
                                <div className="h-[1px] flex-1 bg-gold-500/10 mr-4" />
                            </h3>
                            <div className="grid grid-cols-3 gap-2 px-1">
                                {FILTERS_BASE.sizes.map((size) => {
                                    const isActive = selectedSizes.includes(size);
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={cn(
                                                "h-11 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center uppercase tracking-widest",
                                                isActive
                                                    ? "bg-ivory text-rich-black border-ivory shadow-lg"
                                                    : "border-ivory/[0.06] text-ivory/20 hover:border-gold-500/30 hover:text-gold-300"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reset All */}
                        {activeFilterCount > 0 && (
                            <button
                                onClick={() => {
                                    setSelectedCategory("جميع المنتجات");
                                    setPriceRange(MAX_PRICE);
                                    setSelectedSizes([]);
                                }}
                                className="w-full text-[9px] uppercase tracking-[0.2em] font-black text-gold-500/40 hover:text-gold-500 py-4 transition-colors"
                            >
                                إزالة جميع المرشحات
                            </button>
                        )}
                    </aside>

                    {/* Product Grid Area */}
                    <div className="flex-1 space-y-10">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 px-2">
                             <div className="flex items-center gap-3">
                                <p className="text-ivory/20 text-[10px] uppercase tracking-widest font-black">إجمالي المنتجات</p>
                                <span className="bg-white/[0.03] border border-ivory/[0.06] px-4 py-1.5 rounded-full text-gold-300 text-[10px] font-black">
                                    {filteredProducts.length}
                                </span>
                             </div>

                             <div className="flex items-center gap-3 w-full sm:w-auto relative group">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="luxury-input text-[10px] py-3 pr-10 pl-12 bg-white/[0.02] border-ivory/[0.08] text-ivory/60 hover:border-gold-500/30 transition-all font-bold tracking-widest cursor-pointer w-full sm:w-64"
                                >
                                    <option className="bg-rich-black py-4" value="newest">الأحدث وصولاً</option>
                                    <option className="bg-rich-black py-4" value="price-low">السعر: من الأقل</option>
                                    <option className="bg-rich-black py-4" value="price-high">السعر: من الأعلى</option>
                                </select>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold-500/40">
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </div>
                             </div>
                        </div>

                        {/* Actual Grid */}
                        <div className="relative">
                                <>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
                                        <AnimatePresence mode="popLayout">
                                            {filteredProducts.slice(0, displayLimit).map((product) => (
                                                <motion.div
                                                    key={product.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.98 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.98 }}
                                                    transition={{ duration: 0.06 }}
                                                >
                                                    <ProductCard {...product} />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Empty States */}
                                    {filteredProducts.length === 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-96 flex flex-col items-center justify-center text-center space-y-6 bg-surface-dark/10 rounded-3xl border border-dashed border-ivory/[0.04]"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center text-ivory/10">
                                                <SlidersHorizontal className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-playfair font-bold text-ivory mb-2">لا توجد منتجات مطابقة</h3>
                                                <p className="text-ivory/20 text-sm">جرب استخدام فلاتر مختلفة أو تصفح قسم آخر</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory("جميع المنتجات");
                                                    setPriceRange(MAX_PRICE);
                                                    setSelectedSizes([]);
                                                }}
                                                className="btn-ghost text-xs"
                                            >
                                                مسح الفلاتر والبدء من جديد
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Load More */}
                                    {filteredProducts.length > displayLimit && (
                                        <div className="flex justify-center mt-20">
                                            <button 
                                                onClick={() => setDisplayLimit(prev => prev + 10)}
                                                className="btn-ghost flex items-center gap-4 text-xs tracking-[0.3em]"
                                            >
                                                اكتشف المزيد من الملابس
                                                <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
                                                    <ChevronDown className="w-3 h-3" />
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 z-[100] bg-rich-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 35, stiffness: 350 }}
                            className="fixed inset-y-0 right-0 z-[110] w-[90%] max-w-sm bg-surface-dark p-10 flex flex-col shadow-[-40px_0_80px_rgba(0,0,0,0.8)] border-l border-ivory/5"
                        >
                            <div className="flex justify-between items-center mb-14">
                                <h2 className="text-2xl font-playfair font-black text-ivory tracking-widest">الفلاتر</h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-3 bg-white/5 rounded-full text-ivory/40">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto space-y-14 pr-2 custom-scrollbar">
                                <div className="space-y-8">
                                    <h3 className="text-gold-500/60 font-black uppercase tracking-[0.4em] text-[9px] px-2">التصنيفات</h3>
                                    <div className="flex flex-col gap-3">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={cn(
                                                    "w-full text-right p-5 rounded-2xl border transition-all duration-500 text-[11px] uppercase tracking-widest relative overflow-hidden",
                                                    selectedCategory === cat 
                                                        ? "bg-ivory text-rich-black border-ivory font-black shadow-xl" 
                                                        : "bg-white/[0.02] border-ivory/[0.04] text-ivory/40"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="space-y-8">
                                    <h3 className="text-gold-500/60 font-black uppercase tracking-[0.4em] text-[9px] px-2">المقاسات المختارة</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {FILTERS_BASE.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => toggleSize(size)}
                                                className={cn(
                                                    "h-14 rounded-2xl border transition-all duration-500 flex items-center justify-center font-black text-[10px] tracking-widest",
                                                    selectedSizes.includes(size) 
                                                        ? "bg-ivory text-rich-black border-ivory shadow-lg" 
                                                        : "bg-white/[0.02] border-ivory/[0.04] text-ivory/20"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-ivory/[0.06]">
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="btn-primary w-full justify-center py-5 rounded-2xl shadow-[0_20px_40px_hsla(37,48%,48%,0.2)]"
                                >
                                    إظهار النتائج ({filteredProducts.length})
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("جميع المنتجات");
                                        setPriceRange(MAX_PRICE);
                                        setSelectedSizes([]);
                                    }}
                                    className="w-full text-[9px] uppercase tracking-[0.3em] font-black text-ivory/20 mt-6 hover:text-gold-500 transition-colors"
                                >
                                    تصفير جميع الفلاتر
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>


        </main>
    );
}
