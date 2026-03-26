"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { PromoBanner } from "@/components/layout/PromoBanner";

const MAX_PRICE = 100000;

function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[3/4] bg-white/5 rounded-sm mb-3" />
            <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
            <div className="h-4 bg-white/5 rounded w-1/2" />
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

export default function ProductsClient({ initialProducts, initialCategories }: { initialProducts: any[], initialCategories: any[] }) {
    const products = initialProducts || [];
    const dbCategories = initialCategories || [];
    const searchParams = useSearchParams();
    const [isMounted, setIsMounted] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("جميع المنتجات");
    const [priceRange, setPriceRange] = useState(MAX_PRICE);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [displayLimit, setDisplayLimit] = useState(8); 
    const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");

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

        // Sort results
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

    return (
        <main className="min-h-screen bg-rich-black">
            <Header />

            <div className="pt-32 pb-24 container mx-auto px-4">
                <div className="flex flex-col items-center justify-center text-center mb-12 space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-white uppercase">
                        المتجر الكامل
                    </h1>
                    <p className="text-gold-300/60 uppercase font-medium">
                        تصفح مجموعتنا الحصرية من الملابس الفاخرة
                    </p>
                </div>

                <div className="mb-12">
                    <PromoBanner />
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-6">
                        <button
                            onClick={() => {
                                document.getElementById('mobile-filters')?.classList.remove('translate-x-full');
                                document.getElementById('filters-overlay')?.classList.remove('hidden');
                            }}
                            className="w-full bg-rich-black border border-white/10 p-4 rounded-xl flex items-center justify-between text-white hover:border-gold-500 transition-colors"
                        >
                            <span className="font-bold uppercase flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-gold-500" />
                                الفلترة والتصنيف
                            </span>
                            <span className="bg-gold-500 text-rich-black text-xs font-bold px-2 py-1 rounded">
                                {selectedCategory !== "جميع المنتجات" || priceRange !== 10000 || selectedSizes.length > 0 ? "نشط" : "عادي"}
                            </span>
                        </button>
                    </div>

                    {/* Filter Sidebar */}
                    <aside
                        id="mobile-filters"
                        className={cn(
                            "fixed inset-y-0 right-0 z-50 w-80 bg-rich-black border-l border-white/10 p-8 transform translate-x-full transition-transform duration-300 lg:translate-x-0 lg:static lg:w-72 lg:p-0 lg:border-none lg:block shrink-0 overflow-y-auto lg:overflow-visible"
                        )}
                    >
                        <div className="flex justify-between items-center mb-8 lg:hidden">
                            <h2 className="text-xl font-bold text-white font-playfair uppercase">الفلترة</h2>
                            <button
                                onClick={() => {
                                    document.getElementById('mobile-filters')?.classList.add('translate-x-full');
                                    document.getElementById('filters-overlay')?.classList.add('hidden');
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Categories */}
                        <div className="space-y-6 mb-10">
                            <h3 className="text-white font-black uppercase tracking-[0.3em] text-[10px] border-b border-white/5 pb-4">التصنيفات</h3>
                            <div className="flex flex-col gap-1">
                                {categories.map((cat) => {
                                    const count = products.filter(p => cat === "جميع المنتجات" || p.category === cat).length;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={cn(
                                                "flex justify-between items-center px-4 py-3 transition-all duration-300 rounded-xl group",
                                                selectedCategory === cat
                                                    ? "bg-gold-500 text-rich-black font-bold shadow-lg shadow-gold-500/20"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <span className="text-sm font-bold">{cat}</span>
                                            <span className={cn(
                                                "text-[10px] font-black px-2 py-1 rounded-lg",
                                                selectedCategory === cat ? "bg-black/20 text-black" : "bg-white/5 text-gray-500 group-hover:bg-white/10"
                                            )}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-4 mb-8">
                            <h3 className="text-gold-300 font-bold uppercase tracking-widest text-sm border-b border-gold-500/10 pb-2">السعر</h3>
                            <div className="space-y-2">
                                <input
                                    type="range"
                                    min="0"
                                    max={MAX_PRICE}
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                    className="w-full accent-gold-500 bg-surface-dark h-1 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>0 ج.م</span>
                                    <span className="text-gold-300 font-bold">{priceRange >= MAX_PRICE ? 'الكل' : `${priceRange} ج.م`}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="space-y-4 mb-8">
                            <h3 className="text-gold-300 font-bold uppercase tracking-widest text-sm border-b border-gold-500/10 pb-2">المقاس</h3>
                            <div className="flex flex-wrap gap-2">
                                {FILTERS_BASE.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        className={cn(
                                            "w-10 h-10 border transition-all flex items-center justify-center font-bold text-xs uppercase",
                                            selectedSizes.includes(size)
                                                ? "bg-gold-500 border-gold-500 text-rich-black"
                                                : "border-gold-500/20 text-gray-400 hover:border-gold-500 hover:text-gold-300"
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                document.getElementById('mobile-filters')?.classList.add('translate-x-full');
                                document.getElementById('filters-overlay')?.classList.add('hidden');
                            }}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl lg:hidden"
                        >
                            إظهار النتائج
                        </button>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-2">
                             <div className="flex items-center gap-3">
                                <span className="text-white/40 text-[10px] uppercase tracking-widest font-black">عدد المنتجات</span>
                                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white text-xs font-bold leading-none">
                                    {filteredProducts.length}
                                </span>
                             </div>

                             <div className="flex items-center gap-4 w-full sm:w-auto">
                                <span className="hidden sm:block text-white/40 text-[10px] uppercase tracking-widest font-black">ترتيب حسب</span>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="bg-rich-black border border-white/10 text-white text-xs font-bold py-2.5 px-4 pr-10 rounded-xl focus:border-gold-500/50 outline-none transition-all cursor-pointer appearance-none hover:bg-white/5 w-full sm:w-48"
                                    style={{ 
                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'gold\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
                                        backgroundPosition: 'left 12px center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '16px'
                                    }}
                                >
                                    <option value="newest">الأحدث وصولاً</option>
                                    <option value="price-low">السعر من الأقل للأعلى</option>
                                    <option value="price-high">السعر من الأعلى للأقل</option>
                                </select>
                             </div>
                        </div>

                        {!isMounted ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                                    <AnimatePresence mode="popLayout">
                                        {filteredProducts.slice(0, displayLimit).map((product) => (
                                            <motion.div
                                                key={product.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <ProductCard {...product} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {filteredProducts.length >= displayLimit && (
                                    <div className="flex justify-center mt-12 mb-8">
                                        <button 
                                            onClick={() => setDisplayLimit(prev => prev + 12)}
                                            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gold-500 transition-all shadow-xl shadow-white/5"
                                        >
                                            تحميل المزيد من المنتجات
                                        </button>
                                    </div>
                                )}

                                {filteredProducts.length === 0 && products.length > 0 && (
                                    <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-gold-500/20 rounded-sm mt-8">
                                        <X className="w-12 h-12 text-gold-500/20" />
                                        <div>
                                            <h3 className="text-xl font-bold text-white">لا توجد منتجات تطابق اختياراتك</h3>
                                            <p className="text-gray-500">جرب تغيير فلاتر البحث للحصول على نتائج أفضل</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedCategory("جميع المنتجات");
                                                setPriceRange(MAX_PRICE);
                                                setSelectedSizes([]);
                                            }}
                                            className="text-gold-300 underline underline-offset-4 hover:text-gold-500 transition-colors"
                                        >
                                            إعادة ضبط الفلاتر
                                        </button>
                                    </div>
                                )}

                                {filteredProducts.length === 0 && products.length === 0 && (
                                    <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-gold-500/20 rounded-sm mt-8">
                                        <X className="w-12 h-12 text-gold-500/20" />
                                        <div>
                                            <h3 className="text-xl font-bold text-white">لا توجد منتجات متاحة حالياً</h3>
                                            <p className="text-gray-500">يرجى المحاولة مرة أخرى لاحقاً</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Overlay for mobile drawer */}
                <div
                    id="filters-overlay"
                    className="fixed inset-0 bg-black/50 z-40 hidden lg:hidden backdrop-blur-sm"
                    onClick={() => {
                        document.getElementById('mobile-filters')?.classList.add('translate-x-full');
                        document.getElementById('filters-overlay')?.classList.add('hidden');
                    }}
                />
            </div>

            <Footer />
        </main>
    );
}
