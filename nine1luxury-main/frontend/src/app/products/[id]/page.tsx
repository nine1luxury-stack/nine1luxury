"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, cn } from "@/lib/utils";
import { Product, ProductVariant, ProductImage } from "@/lib/api";
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
    const { products, loading: contextLoading } = useProducts();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to find in context first
        const foundProduct = products.find(p => String(p.id) === String(id));
        if (foundProduct) {
            setProduct(foundProduct);
            setLoading(false);
        } else if (!contextLoading) {
            // If not in context and context finished loading, try fetching directly
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`/api/products/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setProduct(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch product", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, products, contextLoading]);

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
        const variants = product.variants as ProductVariant[];
        const uniqueColors = Array.from(new Set(variants.map((v: ProductVariant) => v.color)));
        return uniqueColors.map(color => ({
            name: color,
            hex: (variants.find((v: ProductVariant) => v.color === color)?.colorHex) || (color.startsWith('#') ? color : '#808080')
        }));
    }, [product]);

    // Extract sizes for selected color
    const availableSizes = useMemo(() => {
        if (!product?.variants || !selectedColor) return [];
        const variants = product.variants as ProductVariant[];
        return Array.from(new Set(
            variants
                .filter((v: ProductVariant) => v.color === selectedColor)
                .map((v: ProductVariant) => v.size)
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
            const images = product.images as ProductImage[];
            const imageIndex = images.findIndex((img: ProductImage) =>
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
        const variants = product.variants as ProductVariant[];
        const variant = variants?.find((v: ProductVariant) => v.color === selectedColor && v.size === selectedSize);
        return variant ? variant.stock <= 0 : true;
    }, [product, selectedColor, selectedSize]);

    if (loading) {
        return (
            <main className="min-h-screen bg-rich-black">
                <Header />
                <div className="min-h-screen bg-rich-black flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
                        <p className="text-gray-400 font-medium">جاري تحميل بيانات المنتج...</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-rich-black">
                <Header />
                <div className="min-h-[70vh] flex items-center justify-center">
                    <div className="text-center space-y-6 px-4">
                        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto">
                            <X className="w-10 h-10 text-gold-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">المنتج غير موجود</h2>
                            <p className="text-gray-500 max-w-xs mx-auto">يبدو أن المنتج الذي تبحث عنه غير متوفر حالياً أو تم حذفه.</p>
                        </div>
                        <button
                            onClick={() => router.push("/products")}
                            className="bg-gold-500 text-rich-black px-8 py-3 rounded-full font-bold hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/10"
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
        const variants = product!.variants as ProductVariant[];
        const selectedVariant = variants?.find((v: ProductVariant) => v.color === selectedColor && v.size === selectedSize);

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

                        <div className="grid grid-cols-4 gap-4">
                            {(product.images as ProductImage[])?.map((img: ProductImage, idx: number) => (
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
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (product.sizeChartImage) {
                                                    setIsSizeChartOpen(true);
                                                } else {
                                                    setIsSizeChartTableOpen(true);
                                                }
                                            }}
                                            className="text-sm font-bold text-gold-500 hover:text-gold-300 underline underline-offset-4"
                                        >
                                            جدول المقاسات
                                        </button>
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

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                            {(product.images as ProductImage[])?.map((img: ProductImage, idx: number) => (
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
