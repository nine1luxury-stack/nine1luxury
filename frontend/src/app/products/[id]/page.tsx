"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, cn } from "@/lib/utils";
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
    const router = useRouter();
    const { addToCart } = useCart();
    const { products } = useProducts();

    const product = useMemo(() =>
        products.find(p => p.id === id),
        [id, products]);

    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

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
        if (availableColors.length > 0 && !selectedColor) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedColor(availableColors[0].name);
        }
    }, [availableColors, selectedColor]);

    useEffect(() => {
        if (availableSizes.length > 0 && selectedSize && !availableSizes.includes(selectedSize)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedSize("");
        }
    }, [availableSizes, selectedSize]);

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

    // Prevent body scroll when zoom or size chart is open
    useEffect(() => {
        if (isZoomOpen || isSizeChartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isZoomOpen, isSizeChartOpen]);

    const isSoldOut = useMemo(() => {
        if (!product) return true;
        return product.isActive === false;
    }, [product]);

    if (!product) {
        return (
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
        );
    }

    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

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

            <div className="pt-32 pb-24 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Product Images Section */}
                    <div className="space-y-6">
                        <div
                            className="relative aspect-[4/5] lg:aspect-auto lg:h-[500px] bg-surface-dark overflow-hidden group rounded-2xl border border-white/5 cursor-zoom-in"
                            onClick={() => setIsZoomOpen(true)}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src={product.images?.[activeImage]?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'}
                                        alt={product.name}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                        priority
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImage(prev => (prev === 0 ? product.images!.length - 1 : prev - 1));
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-rich-black/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImage(prev => (prev === product.images!.length - 1 ? 0 : prev + 1));
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-rich-black/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-4">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={cn(
                                        "relative aspect-square border-2 transition-all overflow-hidden",
                                        activeImage === idx ? "border-gold-500" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`${product.name} ${idx}`}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <span className="text-gold-300 uppercase tracking-[0.3em] text-xs font-bold">
                                {product.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white leading-tight">
                                {product.name}
                                {isSoldOut && (
                                    <span className="block mt-2 text-sm bg-red-600/20 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-full w-fit uppercase tracking-widest animate-pulse font-bold">
                                        نفد من المخزن
                                    </span>
                                )}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-playfair font-bold text-gold-300">
                                {formatPrice(discountedPrice)}
                            </span>
                            {product.discount && (
                                <span className="text-xl text-gray-500 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                            {product.discount && (
                                <span className="bg-gold-500 text-rich-black px-2 py-1 text-xs font-bold rounded-sm">
                                    خصم {product.discount}%
                                </span>
                            )}
                        </div>

                        <p className="text-gray-400 leading-relaxed text-lg">
                            {product.description}
                        </p>

                        {/* Options */}
                        <div className="space-y-6">
                            {/* Color Selection */}
                            {availableColors.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-white font-bold uppercase tracking-widest text-sm">اللون: <span className="text-gold-300">{selectedColor || "اختر اللون"}</span></h3>
                                    <div className="flex flex-wrap gap-3">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                disabled={isSoldOut}
                                                className={cn(
                                                    "w-10 h-10 rounded-full border-2 transition-all p-1",
                                                    isSoldOut && "opacity-30 cursor-not-allowed",
                                                    selectedColor === color.name ? "border-gold-500 scale-110" : "border-white/10 hover:border-white/30"
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
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <h3 className="text-white font-bold uppercase tracking-widest text-sm">المقاس: <span className="text-gold-300">{selectedSize || "اختر المقاس"}</span></h3>
                                        {product.sizeChartImage && (
                                            <button
                                                type="button"
                                                onClick={() => setIsSizeChartOpen(true)}
                                                className="text-[10px] text-gold-300/60 uppercase tracking-widest hover:text-gold-300 underline"
                                            >
                                                جدول المقاسات
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {availableSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                disabled={isSoldOut}
                                                className={cn(
                                                    "w-12 h-12 border transition-all flex items-center justify-center font-bold text-sm",
                                                    isSoldOut && "opacity-30 cursor-not-allowed",
                                                    selectedSize === size
                                                        ? "bg-gold-500 border-gold-500 text-rich-black"
                                                        : "border-white/10 text-gray-400 hover:border-gold-500/50 hover:text-gold-300"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity & Add to Cart */}
                            <div className="flex flex-col gap-4 pt-4">
                                <div className="flex items-center justify-center border border-white/10 h-14 w-full sm:w-auto sm:max-w-[180px]">
                                    <button
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        disabled={isSoldOut}
                                        className="flex-1 sm:w-14 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-30 text-xl font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="flex-1 sm:w-14 text-center text-white font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(prev => prev + 1)}
                                        disabled={isSoldOut}
                                        className="flex-1 sm:w-14 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-30 text-xl font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={handleBooking}
                                    disabled={!selectedSize || isSoldOut}
                                    className={cn(
                                        "w-full h-14 flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all rounded-lg text-sm",
                                        (selectedSize && !isSoldOut)
                                            ? "bg-gold-500 text-rich-black hover:bg-gold-300"
                                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                    )}
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>{isSoldOut ? "نفد من المخزن" : "حجز المنتج الآن"}</span>
                                </button>
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
                                        activeImage === idx ? "border-gold-500 scale-110" : "border-white/20 opacity-50 hover:opacity-100"
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

            <Footer />
        </main>
    );
}
