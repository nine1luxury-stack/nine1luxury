"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, cn } from "@/lib/utils";
import { productsApi, Product } from "@/lib/api";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    X,
    ZoomIn
} from "lucide-react";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const idString = Array.isArray(id) ? id[0] : id;
    const router = useRouter();
    const { addToCart } = useCart();
    const { products } = useProducts();

    const [localProduct, setLocalProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const product = useMemo(() => {
        const inContext = products.find(p => p.id === idString);
        return inContext || localProduct;
    }, [idString, products, localProduct]);

    useEffect(() => {
        if (!idString) return;
        
        const inContext = products.find(p => p.id === idString);
        if (inContext) {
            setLoading(false);
            return;
        }

        setLoading(true);
        productsApi.getById(idString)
            .then(data => {
                setLocalProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [idString, products]);

    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
    const [isSizeChartTableOpen, setIsSizeChartTableOpen] = useState(false);

    // Extract unique colors from variants
    const availableColors = useMemo(() => {
        if (!product?.variants) return [];
        const uniqueColors = Array.from(new Set(product.variants.map(v => v.color)));
        return uniqueColors.map(color => ({
            name: color,
            // If color is a valid hex, use it. Else check if it's a known legacy name or fallback to black/gray.
            // Since we are migrating, new ones are Hex. Old ones are names.
            // Basic check: starts with #
            // Use colorHex if available, otherwise check if name is hex, otherwise fallback
            hex: (product.variants.find(v => v.color === color)?.colorHex) || (color.startsWith('#') ? color : '#808080')
        }));
    }, [product]);

    // Extract sizes for selected color
    const availableSizes = useMemo(() => {
        if (!product?.variants || !selectedColor) return [];
        return Array.from(new Set(
            product.variants
                .filter(v => v.color === selectedColor)
                .map(v => v.size)
        ));
    }, [product, selectedColor]);

    // Initialize selections when product loads
    useEffect(() => {
        if (!product) return;

        if (availableColors.length > 0 && !selectedColor) {
            setSelectedColor(availableColors[0].name);
        }
    }, [product, availableColors, selectedColor]);

    useEffect(() => {
        if (!product) return;

        if (selectedSize && availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
            setSelectedSize("");
        }
    }, [product, availableSizes, selectedSize]);

    // Sync image with selected color
    useEffect(() => {
        if (selectedColor && product?.images) {
            const imageIndex = product.images.findIndex(img =>
                img.color === selectedColor ||
                img.color?.trim() === selectedColor.trim()
            );

            if (imageIndex !== -1) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setActiveImage(imageIndex);
            }
        }
    }, [selectedColor, product]);

    // Keyboard navigation for zoom modal
    useEffect(() => {
        if (!isZoomOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsZoomOpen(false);
            } else if (e.key === 'ArrowLeft') {
                setActiveImage(prev => (prev === 0 ? (product?.images?.length || 1) - 1 : prev - 1));
            } else if (e.key === 'ArrowRight') {
                setActiveImage(prev => (prev === (product?.images?.length || 1) - 1 ? 0 : prev + 1));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isZoomOpen, product]);

    // Keyboard navigation for size chart modal
    useEffect(() => {
        if (!isSizeChartOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsSizeChartOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSizeChartOpen]);

    // Keyboard navigation for size chart table modal
    useEffect(() => {
        if (!isSizeChartTableOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsSizeChartTableOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSizeChartTableOpen]);

    // Prevent body scroll when zoom or size chart is open
    useEffect(() => {
        if (isZoomOpen || isSizeChartOpen || isSizeChartTableOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isZoomOpen, isSizeChartOpen, isSizeChartTableOpen]);

    const isSoldOut = useMemo(() => {
        if (!product) return true;
        if (!selectedColor || !selectedSize) return false;
        const variant = product.variants?.find(v => v.color === selectedColor && v.size === selectedSize);
        return variant ? variant.stock <= 0 : true;
    }, [product, selectedColor, selectedSize]);

    if (loading) {
        return (
            <main className="min-h-screen bg-rich-black flex items-center justify-center">
                <Header />
                <div className="text-gold-500 animate-pulse text-xl font-bold uppercase tracking-widest">
                    جاري التحميل...
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-rich-black">
                <Header />
                <div className="min-h-screen bg-rich-black flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl text-white font-bold">المنتج غير موجود</h2>
                        <button
                            onClick={() => router.push("/products")}
                            className="text-gold-300 underline"
                        >
                            العودة للمتجر
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    const currentImageIndex = Math.min(activeImage, (product.images?.length || 1) - 1);

    const handleBooking = () => {
        if (!selectedSize || !selectedColor || isSoldOut) return;

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

    return (
        <main className="min-h-screen bg-rich-black">
            <Header />

            <div className="pt-32 pb-32 container mx-auto px-6 max-w-[1400px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

                    {/* Left side: Scrolling Image Gallery (lg:col-span-7) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex flex-col gap-6">
                            {(product.images && product.images.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800' }]).map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="relative aspect-[4/5] bg-surface-dark overflow-hidden rounded-[2.5rem] border border-ivory/[0.05] group cursor-zoom-in"
                                    onClick={() => {
                                        setActiveImage(idx);
                                        setIsZoomOpen(true);
                                    }}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`${product.name} ${idx}`}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-rich-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <div className="bg-ivory/20 backdrop-blur-xl p-4 rounded-full border border-ivory/20">
                                            <ZoomIn className="w-6 h-6 text-ivory" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right side: Sticky Product Info (lg:col-span-5) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-12">
                        <div className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4"
                            >
                                <span className="h-[1px] w-8 bg-gold-500/40" />
                                <span className="text-gold-300 uppercase tracking-[0.4em] text-[10px] font-black">
                                    {product.category}
                                </span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-almarai font-black text-ivory leading-[1.1]"
                            >
                                {product.name}
                            </motion.h1>

                            {isSoldOut && (
                                <div className="inline-flex items-center gap-3 px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                    نفد من المخزن
                                </div>
                            )}
                        </div>

                        <div className="flex items-baseline gap-6 border-b border-ivory/5 pb-10">
                            <span className="text-5xl font-almarai font-black text-gold-300 drop-shadow-2xl">
                                {formatPrice(discountedPrice)}
                            </span>
                            {product.discount && product.discount > 0 && (
                                <span className="text-2xl text-ivory/20 line-through font-almarai">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-gold-500/60 font-black uppercase tracking-[0.3em] text-[10px]">نظرة عامة</h3>
                            <p className="text-ivory/60 leading-relaxed text-lg font-medium max-w-xl">
                                {product.description}
                            </p>
                        </div>

                        {/* Options */}
                        <div className="space-y-10 pt-4">
                            {/* Color Selection */}
                            {availableColors.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-gold-500/60 font-black uppercase tracking-[0.3em] text-[10px]">اللون المختار</h3>
                                        <span className="text-ivory font-black text-[10px] uppercase tracking-widest">{selectedColor}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                disabled={isSoldOut}
                                                className={cn(
                                                    "w-12 h-12 rounded-full border-2 transition-all p-1 flex items-center justify-center relative group",
                                                    isSoldOut && "opacity-30 cursor-not-allowed",
                                                    selectedColor === color.name ? "border-gold-500 scale-110 shadow-[0_0_20px_hsla(37,48%,48%,0.3)]" : "border-white/5 hover:border-white/20"
                                                )}
                                                title={color.name}
                                            >
                                                <div
                                                    className="w-full h-full rounded-full"
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {availableSizes.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-gold-500/60 font-black uppercase tracking-[0.3em] text-[10px]">المقاس المتاح</h3>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (product.sizeChartImage) setIsSizeChartOpen(true);
                                                else setIsSizeChartTableOpen(true);
                                            }}
                                            className="text-[9px] text-champagne/40 uppercase tracking-[0.2em] font-black hover:text-gold-300 transition-colors border-b border-champagne/10 pb-1"
                                        >
                                            جدول المقاسات الفني
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {availableSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                disabled={isSoldOut}
                                                className={cn(
                                                    "min-w-[64px] h-16 border-2 transition-all duration-500 flex items-center justify-center font-black text-xs tracking-widest rounded-2xl",
                                                    isSoldOut && "opacity-30 cursor-not-allowed",
                                                    selectedSize === size
                                                        ? "bg-ivory border-ivory text-rich-black shadow-2xl"
                                                        : "border-ivory/5 text-ivory/20 hover:border-gold-500/30 hover:text-gold-300"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity & Add to Cart */}
                            <div className="flex flex-col gap-6 pt-6">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center bg-white/5 border border-white/5 h-16 rounded-2xl overflow-hidden shrink-0">
                                        <button
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            disabled={isSoldOut}
                                            className="w-14 h-full flex items-center justify-center text-ivory/40 hover:text-ivory transition-colors disabled:opacity-30 text-xl font-bold"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center text-ivory font-black text-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            disabled={isSoldOut}
                                            className="w-14 h-full flex items-center justify-center text-ivory/40 hover:text-ivory transition-colors disabled:opacity-30 text-xl font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                    
                                    <button
                                        onClick={handleBooking}
                                        disabled={!selectedSize || isSoldOut}
                                        className={cn(
                                            "flex-1 h-16 flex items-center justify-center gap-4 font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-2xl text-[11px] shadow-2xl relative overflow-hidden group/btn",
                                            (selectedSize && !isSoldOut)
                                                ? "luxury-gradient text-rich-black hover:scale-[1.02] active:scale-[0.98]"
                                                : "bg-white/5 text-ivory/20 cursor-not-allowed border border-white/5"
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 opacity-0 group-hover/btn:opacity-100" />
                                        <ShoppingBag className="w-5 h-5 z-10" />
                                        <span className="z-10">{isSoldOut ? "نفد من المخزن" : "إضافة إلى الحقيبة"}</span>
                                    </button>
                                </div>
                                
                                <p className="text-[10px] text-ivory/20 text-center uppercase tracking-[0.2em] font-medium">
                                    توصيل مجاني لجميع دول الخليج • استبدال خلال ١٤ يوم
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Zoom Modal */}
            <AnimatePresence>
                {isZoomOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsZoomOpen(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsZoomOpen(false)}
                            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold z-10">
                            {activeImage + 1} / {product.images?.length || 1}
                        </div>

                        {/* Main Zoomed Image */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-full h-full max-w-6xl max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={product.images?.[activeImage]?.url || product.images?.[0]?.url || ''}
                                alt={product.name}
                                fill
                                unoptimized
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Navigation Arrows */}
                        {product.images && product.images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImage(prev => (prev === 0 ? product.images!.length - 1 : prev - 1));
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImage(prev => (prev === product.images!.length - 1 ? 0 : prev + 1));
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        {/* Thumbnails */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImage(idx);
                                    }}
                                    className={cn(
                                        "relative w-16 h-16 flex-shrink-0 border-2 transition-all overflow-hidden rounded-lg",
                                        currentImageIndex === idx ? "border-gold-500 scale-110" : "border-white/20 opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`${product.name} ${idx}`}
                                        fill
                                        unoptimized
                                        className="object-contain"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Hint Text */}
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 text-xs text-center">
                            اضغط ESC للإغلاق • استخدم الأسهم للتنقل
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Size Chart Modal */}
            <AnimatePresence>
                {isSizeChartOpen && product.sizeChartImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsSizeChartOpen(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsSizeChartOpen(false)}
                            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Title */}
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold z-10">
                            جدول المقاسات
                        </div>

                        {/* Size Chart Image - Full and Zoomable */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-full h-full max-w-6xl max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={product.sizeChartImage}
                                alt="Size Chart"
                                fill
                                unoptimized
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Hint Text */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs text-center">
                            اضغط ESC للإغلاق • يمكنك أخذ سكرين شوت للصورة
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Size Chart Table Modal */}
            <AnimatePresence>
                {isSizeChartTableOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsSizeChartTableOpen(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsSizeChartTableOpen(false)}
                            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Title */}
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold z-10">
                            جدول المقاسات
                        </div>

                        {/* Size Chart Table */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-full max-w-4xl bg-rich-black border border-gold-500/20 rounded-2xl p-8 overflow-auto max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">جدول المقاسات</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-white border-collapse">
                                    <thead>
                                        <tr className="border-b border-gold-500/30">
                                            <th className="py-4 px-6 text-right font-bold text-gold-300">المقاس</th>
                                            <th className="py-4 px-6 text-center font-bold text-gold-300">الصدر (سم)</th>
                                            <th className="py-4 px-6 text-center font-bold text-gold-300">الخصر (سم)</th>
                                            <th className="py-4 px-6 text-center font-bold text-gold-300">الطول (سم)</th>
                                            <th className="py-4 px-6 text-center font-bold text-gold-300">الكتف (سم)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-white/10 hover:bg-gold-500/5 transition-colors">
                                            <td className="py-4 px-6 text-right font-bold">S</td>
                                            <td className="py-4 px-6 text-center text-gray-300">90-95</td>
                                            <td className="py-4 px-6 text-center text-gray-300">75-80</td>
                                            <td className="py-4 px-6 text-center text-gray-300">68-70</td>
                                            <td className="py-4 px-6 text-center text-gray-300">42-44</td>
                                        </tr>
                                        <tr className="border-b border-white/10 hover:bg-gold-500/5 transition-colors">
                                            <td className="py-4 px-6 text-right font-bold">M</td>
                                            <td className="py-4 px-6 text-center text-gray-300">96-101</td>
                                            <td className="py-4 px-6 text-center text-gray-300">81-86</td>
                                            <td className="py-4 px-6 text-center text-gray-300">71-73</td>
                                            <td className="py-4 px-6 text-center text-gray-300">45-47</td>
                                        </tr>
                                        <tr className="border-b border-white/10 hover:bg-gold-500/5 transition-colors">
                                            <td className="py-4 px-6 text-right font-bold">L</td>
                                            <td className="py-4 px-6 text-center text-gray-300">102-107</td>
                                            <td className="py-4 px-6 text-center text-gray-300">87-92</td>
                                            <td className="py-4 px-6 text-center text-gray-300">74-76</td>
                                            <td className="py-4 px-6 text-center text-gray-300">48-50</td>
                                        </tr>
                                        <tr className="border-b border-white/10 hover:bg-gold-500/5 transition-colors">
                                            <td className="py-4 px-6 text-right font-bold">XL</td>
                                            <td className="py-4 px-6 text-center text-gray-300">108-113</td>
                                            <td className="py-4 px-6 text-center text-gray-300">93-98</td>
                                            <td className="py-4 px-6 text-center text-gray-300">77-79</td>
                                            <td className="py-4 px-6 text-center text-gray-300">51-53</td>
                                        </tr>
                                        <tr className="hover:bg-gold-500/5 transition-colors">
                                            <td className="py-4 px-6 text-right font-bold">XXL</td>
                                            <td className="py-4 px-6 text-center text-gray-300">114-119</td>
                                            <td className="py-4 px-6 text-center text-gray-300">99-104</td>
                                            <td className="py-4 px-6 text-center text-gray-300">80-82</td>
                                            <td className="py-4 px-6 text-center text-gray-300">54-56</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Note */}
                            <div className="mt-6 p-4 bg-gold-500/10 border border-gold-500/20 rounded-lg">
                                <p className="text-gold-300 text-sm text-center">
                                    📏 القياسات تقريبية وقد تختلف قليلاً حسب نوع القماش
                                </p>
                            </div>

                            {/* Hint Text */}
                            <div className="mt-4 text-white/60 text-xs text-center">
                                اضغط ESC للإغلاق
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
