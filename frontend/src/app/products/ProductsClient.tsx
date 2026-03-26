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
    console.log(`PUBLIC PROPS: received ${initialProducts?.length} products`);
    const products = initialProducts || [];
    const dbCategories = initialCategories || [];
    const searchParams = useSearchParams();

    const [selectedCategory, setSelectedCategory] = useState("جميع المنتجات");
    const [priceRange, setPriceRange] = useState(100000); // Increased default price range to 100k
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    useEffect(() => {
        console.log(`CLIENT MOUNT: products list length is ${products.length}`);
    }, [products.length]);

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
        return products
            .filter((product) => {
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
    }, [products, selectedCategory, priceRange, selectedSizes]);

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
                                    max="10000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                    className="w-full accent-gold-500 bg-surface-dark h-1 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>0 ج.م</span>
                                    <span className="text-gold-300 font-bold">{priceRange} ج.م</span>
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
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product) => (
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

                        {filteredProducts.length === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-gold-500/20 rounded-sm mt-8">
                                <X className="w-12 h-12 text-gold-500/20" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">لا توجد منتجات تطابق اختياراتك</h3>
                                    <p className="text-gray-500">جرب تغيير فلاتر البحث للحصول على نتائج أفضل</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("جميع المنتجات");
                                        setPriceRange(10000);
                                        setSelectedSizes([]);
                                    }}
                                    className="text-gold-300 underline underline-offset-4 hover:text-gold-500 transition-colors"
                                >
                                    إعادة ضبط الفلاتر
                                </button>
                            </div>
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
