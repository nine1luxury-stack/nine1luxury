"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice, cn } from "@/lib/utils";
import { productsApi, Product } from "@/lib/api";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import {
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    X,
    Maximize2,
    Ruler,
    Truck,
    RotateCcw,
    ShieldCheck,
    Star
} from "lucide-react";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const idString = Array.isArray(id) ? id[0] : id;
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

    useEffect(() => {
        if (!idString) return;
        setLoading(true);
        productsApi.getById(idString)
            .then(data => {
                setProduct(data);
                setLoading(false);
                if (data.variants && data.variants.length > 0) {
                    const uniqueColors = Array.from(new Set(data.variants.map(v => v.color)));
                    if (uniqueColors.length > 0) setSelectedColor(uniqueColors[0]);
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [idString]);

    const availableColors = useMemo(() => {
        if (!product?.variants) return [];
        const uniqueColors = Array.from(new Set(product.variants.map(v => v.color)));
        return uniqueColors.map(color => ({
            name: color,
            hex: product.variants?.find(v => v.color === color)?.colorHex || '#808080'
        }));
    }, [product]);

    const availableSizes = useMemo(() => {
        if (!product?.variants || !selectedColor) return [];
        return Array.from(new Set(
            product.variants
                .filter(v => v.color === selectedColor)
                .map(v => v.size)
        ));
    }, [product, selectedColor]);

    useEffect(() => {
        if (selectedSize && availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
            setSelectedSize("");
        }
    }, [availableSizes, selectedSize]);

    const isSoldOut = useMemo(() => {
        if (!product || !selectedColor || !selectedSize) return false;
        const variant = product.variants?.find(v => v.color === selectedColor && v.size === selectedSize);
        return variant ? variant.stock <= 0 : false;
    }, [product, selectedColor, selectedSize]);

    const discountedPrice = product ? (product.discount ? product.price * (1 - product.discount / 100) : product.price) : 0;

    const handleAddToCart = () => {
        if (!product || !selectedSize || !selectedColor || isSoldOut) return;
        const selectedVariant = product.variants?.find(v => v.color === selectedColor && v.size === selectedSize);
        
        addToCart({
            id: product.id,
            name: product.name,
            price: discountedPrice,
            image: product.images?.[0]?.url || '',
            quantity,
            size: selectedSize,
            color: selectedColor,
            variantId: selectedVariant?.id
        });
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-rich-black">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
                    <div className="w-16 h-16 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
                    <p className="text-ivory/20 font-bold uppercase tracking-[0.3em] text-xs">جاري جلب الفخامة...</p>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-rich-black">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8">
                    <h2 className="text-4xl font-playfair font-bold text-ivory">المنتج غائب عن المجموعة</h2>
                    <button onClick={() => router.push("/products")} className="btn-ghost text-sm">العودة للمتجر</button>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-rich-black">
            <Header />

            <div className="pt-32 pb-24 container mx-auto px-6 max-w-[1500px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* Left: Imagery (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex flex-col-reverse md:flex-row gap-6">
                            {/* Thumbnails */}
                            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar shrink-0">
                                {product.images?.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={cn(
                                            "relative w-20 h-28 rounded-xl overflow-hidden border-2 transition-all duration-300",
                                            activeImage === idx ? "border-gold-500" : "border-transparent opacity-40 hover:opacity-100"
                                        )}
                                    >
                                        <Image src={img.url} alt={product.name} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Main Display */}
                            <div className="flex-1 relative aspect-[3/4] rounded-3xl overflow-hidden bg-surface-dark group border border-ivory/[0.04]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative w-full h-full"
                                    >
                                        <Image
                                            src={product.images?.[activeImage]?.url || ''}
                                            alt={product.name}
                                            fill
                                            priority
                                            className="object-cover"
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                <button 
                                    onClick={() => setIsZoomOpen(true)}
                                    className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-rich-black/40 backdrop-blur-md border border-ivory/[0.1] flex items-center justify-center text-ivory/80 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-gold-500 hover:text-rich-black"
                                >
                                    <Maximize2 className="w-5 h-5" />
                                </button>
                                
                                {product.discount && (
                                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-gold-500 text-rich-black font-black text-xs rounded-full shadow-xl">
                                        خصم {product.discount}%
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Navigation Arrows */}
                        <div className="flex lg:hidden items-center justify-center gap-6 pt-2">
                             <button onClick={() => setActiveImage(prev => prev === 0 ? product.images!.length - 1 : prev - 1)} className="w-10 h-10 rounded-full border border-ivory/10 flex items-center justify-center text-ivory/30">
                                <ChevronLeft className="w-5 h-5" />
                             </button>
                             <span className="text-[10px] font-black text-ivory/20 tracking-[0.3em]">{activeImage + 1} / {product.images?.length}</span>
                             <button onClick={() => setActiveImage(prev => prev === product.images!.length - 1 ? 0 : prev + 1)} className="w-10 h-10 rounded-full border border-ivory/10 flex items-center justify-center text-ivory/30">
                                <ChevronRight className="w-5 h-5" />
                             </button>
                        </div>
                    </div>

                    {/* Right: Info (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col space-y-10">
                        {/* Title & Price */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-3">
                                <span className="text-gold-500/60 font-black uppercase tracking-[0.4em] text-[10px]">
                                    {product.category}
                                </span>
                                <h1 className="text-4xl md:text-6xl font-playfair font-bold text-ivory leading-tight">
                                    {product.name}
                                </h1>
                            </div>

                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-playfair font-bold text-champagne">
                                    {formatPrice(discountedPrice)}
                                </span>
                                {product.discount && (
                                    <span className="text-xl text-ivory/20 line-through decoration-gold-500/20">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-ivory/40 leading-[2.2] text-lg font-light border-y border-ivory/[0.04] py-8">
                            {product.description}
                        </p>

                        {/* Selections */}
                        <div className="space-y-10">
                            {/* Colors */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-ivory/20 font-black uppercase tracking-[0.2em] text-[10px]">اختيار اللون</h3>
                                    <span className="text-xs text-gold-500/80 font-bold">{selectedColor}</span>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {availableColors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={cn(
                                                "w-12 h-12 rounded-full border-2 transition-all p-1.5",
                                                selectedColor === color.name ? "border-gold-500 scale-110 shadow-lg shadow-gold-500/20" : "border-ivory/[0.1] hover:border-ivory/[0.3]"
                                            )}
                                        >
                                            <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: color.hex }} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-ivory/20 font-black uppercase tracking-[0.2em] text-[10px]">مقاسك المفضل</h3>
                                    <button 
                                        onClick={() => setIsSizeChartOpen(true)}
                                        className="text-[10px] text-gold-500/60 hover:text-gold-500 uppercase tracking-widest font-black flex items-center gap-2 transition-colors"
                                    >
                                        <Ruler className="w-3.5 h-3.5" />
                                        دليل المقاسات
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "h-14 rounded-2xl border font-black text-sm transition-all flex items-center justify-center uppercase tracking-widest",
                                                selectedSize === size
                                                    ? "bg-ivory text-rich-black border-ivory"
                                                    : "border-ivory/[0.08] text-ivory/30 hover:border-gold-500/30 hover:text-gold-500"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center bg-white/[0.03] border border-ivory/[0.08] rounded-2xl h-16 px-4">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center text-ivory/20 hover:text-gold-500 transition-colors">-</button>
                                    <span className="w-12 text-center text-ivory font-bold text-lg">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-full flex items-center justify-center text-ivory/20 hover:text-gold-500 transition-colors">+</button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!selectedSize || isSoldOut}
                                    className="flex-1 btn-primary h-16 text-sm tracking-[0.2em] justify-center disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                >
                                    <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                                    <span>{isSoldOut ? "المخزون غير متوفر" : "حجز المنتج الآن"}</span>
                                </button>
                            </div>
                        </div>

                        {/* Benefits Icons */}
                        <div className="grid grid-cols-3 gap-8 pt-10 border-t border-ivory/[0.04]">
                             <div className="flex flex-col items-center gap-4 text-center group">
                                <div className="w-12 h-12 rounded-2xl bg-gold-500/[0.05] flex items-center justify-center text-gold-500/40 group-hover:bg-gold-500 group-hover:text-rich-black transition-all">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <p className="text-[10px] text-ivory/30 font-black uppercase tracking-widest leading-relaxed">توصيل سريع</p>
                             </div>
                             <div className="flex flex-col items-center gap-4 text-center group">
                                <div className="w-12 h-12 rounded-2xl bg-gold-500/[0.05] flex items-center justify-center text-gold-500/40 group-hover:bg-gold-500 group-hover:text-rich-black transition-all">
                                    <RotateCcw className="w-5 h-5" />
                                </div>
                                <p className="text-[10px] text-ivory/30 font-black uppercase tracking-widest leading-relaxed">استبدال سهل</p>
                             </div>
                             <div className="flex flex-col items-center gap-4 text-center group">
                                <div className="w-12 h-12 rounded-2xl bg-gold-500/[0.05] flex items-center justify-center text-gold-500/40 group-hover:bg-gold-500 group-hover:text-rich-black transition-all">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <p className="text-[10px] text-ivory/30 font-black uppercase tracking-widest leading-relaxed">جودة مضمونة</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} title="معاينة فنية للمنتج">
                 <div className="relative aspect-[4/5] w-full max-h-[80vh] bg-surface-dark rounded-2xl overflow-hidden">
                    <Image src={product.images?.[activeImage]?.url || ''} alt={product.name} fill className="object-contain" />
                 </div>
                 <div className="flex justify-center gap-4 mt-8">
                    {product.images?.map((img, idx) => (
                        <button key={idx} onClick={() => setActiveImage(idx)} className={cn("w-14 h-20 rounded-lg overflow-hidden border-2", activeImage === idx ? "border-gold-500" : "border-transparent opacity-40")}>
                            <Image src={img.url} alt="thumbnail" fill className="object-cover" />
                        </button>
                    ))}
                 </div>
            </Modal>

            <Modal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} title="دليل المقاسات - Nine1Luxury">
                <div className="space-y-8">
                    {product.sizeChartImage && (
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-ivory/[0.08]">
                            <Image src={product.sizeChartImage} alt="Size Chart" fill className="object-contain" />
                        </div>
                    )}
                    
                    <div className="overflow-x-auto rounded-3xl border border-ivory/[0.08] bg-white/[0.01]">
                        <table className="w-full text-right text-sm">
                            <thead>
                                <tr className="bg-gold-500/[0.05] border-b border-ivory/[0.08]">
                                    <th className="p-5 text-champagne font-black uppercase tracking-widest">المقاس</th>
                                    <th className="p-5 text-champagne font-black uppercase tracking-widest">الصدر (سم)</th>
                                    <th className="p-5 text-champagne font-black uppercase tracking-widest">الطول (سم)</th>
                                </tr>
                            </thead>
                            <tbody className="text-ivory/40">
                                <tr className="border-b border-ivory/[0.04] hover:bg-white/[0.02]">
                                    <td className="p-5 font-bold">Small (S)</td>
                                    <td className="p-5">90 - 95</td>
                                    <td className="p-5">68 - 70</td>
                                </tr>
                                <tr className="border-b border-ivory/[0.04] hover:bg-white/[0.02]">
                                    <td className="p-5 font-bold">Medium (M)</td>
                                    <td className="p-5">96 - 101</td>
                                    <td className="p-5">71 - 73</td>
                                </tr>
                                <tr className="border-b border-ivory/[0.04] hover:bg-white/[0.02]">
                                    <td className="p-5 font-bold">Large (L)</td>
                                    <td className="p-5">102 - 107</td>
                                    <td className="p-5">74 - 76</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02]">
                                    <td className="p-5 font-bold">X-Large (XL)</td>
                                    <td className="p-5">108 - 113</td>
                                    <td className="p-5">77 - 79</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>

            <Footer />
        </main>
    );
}
