"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ProductVariant, ProductImage, productsApi } from "@/lib/api";
import { ShoppingBag, Eye } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    discount: number | null;
    images?: ProductImage[];
    category: string;
    variants?: ProductVariant[];
    isActive?: boolean;
    createdAt?: string;
    isNew?: boolean;
}

export function ProductCard({ id, name, price, discount, images: propImages, category, isActive, createdAt, isNew: propIsNew }: ProductCardProps) {
    const [liveImages, setLiveImages] = useState<ProductImage[]>(propImages || []);
    const [isFetchingImage, setIsFetchingImage] = useState(!propImages || propImages.length === 0);

    const displayImage = liveImages[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800';
    const discountedPrice = (discount && discount > 0) ? price * (1 - discount / 100) : price;
    const isSoldOut = isActive === false;

    useEffect(() => {
        // If images were not provided via SSR (to speed up initial load), fetch them now on the client
        if (!propImages || propImages.length === 0) {
            productsApi.getById(id)
                .then(p => {
                    if (p.images && p.images.length > 0) {
                        setLiveImages(p.images);
                    }
                })
                .catch(err => console.error("Lazy Image load error:", err))
                .finally(() => setIsFetchingImage(false));
        }
    }, [id, propImages]);

    // Check if product is new (created in last 7 days) - default to prop but fallback if not provided
    const isNew = propIsNew ?? (createdAt ? (new Date(new Date().toDateString()).getTime() - new Date(createdAt).getTime() < 7 * 24 * 60 * 60 * 1000) : false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-surface-card rounded-2xl overflow-hidden flex flex-col h-full border border-ivory/[0.04] transition-all duration-600 hover:translate-y-[-3px] hover:border-gold-500/20 hover:shadow-[0_24px_48px_rgba(0,0,0,0.25),0_0_20px_hsla(37,48%,48%,0.06)]"
        >
            {/* Image section with hover zoom */}
            <div className="relative aspect-[3.5/5] overflow-hidden bg-surface-dark">
                {/* Status Badges */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                    {isNew && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-3.5 py-1.5 bg-ivory text-rich-black text-[7px] font-black rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.3)] uppercase tracking-[0.2em] backdrop-blur-md flex items-center gap-1.5"
                        >
                            <span className="w-1 h-1 rounded-full bg-bronze animate-pulse" />
                            جديد
                        </motion.div>
                    )}
                    {discount && discount > 0 && (
                        <div className="px-3.5 py-1.5 luxury-gradient text-rich-black text-[7px] font-black rounded-full shadow-[0_8px_20px_hsla(37,48%,48%,0.3)] uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <span className="text-[9px]">↓</span>
                            -{discount}%
                        </div>
                    )}
                    {isSoldOut && (
                        <div className="px-3.5 py-1.5 bg-surface-dark/90 text-ivory/40 border border-ivory/10 text-[7px] font-black rounded-full shadow-lg uppercase tracking-[0.15em] backdrop-blur-md">
                            نفد بالكامل
                        </div>
                    )}
                </div>

                <Link href={`/products/${id}`} className="block w-full h-full relative overflow-hidden">
                    <Image
                        src={displayImage}
                        alt={name}
                        fill
                        className={cn(
                            "object-cover transition-all duration-700 ease-out group-hover:scale-108",
                            isSoldOut && "grayscale opacity-60",
                            isFetchingImage && "blur-sm animate-pulse opacity-40"
                        )}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-rich-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    {/* Centered Button on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <motion.div
                            initial={false}
                            whileHover={{ scale: 1.04 }}
                            className="bg-ivory/95 backdrop-blur-sm text-rich-black px-6 py-3 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 hover:bg-gold-500 transition-colors duration-300"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span>عرض الآن</span>
                        </motion.div>
                    </div>
                </Link>
            </div>

            {/* Product Details */}
            <div className="p-4 md:p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                    <span className="text-[8px] text-gold-500/60 font-bold uppercase tracking-[3px]">
                        {category}
                    </span>
                    <Link href={`/products/${id}`}>
                        <h3 className="text-sm md:text-base font-bold text-ivory/90 group-hover:text-gold-300 transition-colors duration-300 line-clamp-1 font-playfair tracking-wide leading-tight">
                            {name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-end justify-between pt-2">
                    <div className="flex flex-col">
                        {discount && discount > 0 && (
                            <span className="text-[10px] text-ivory/30 line-through decoration-gold-500/30 mb-0.5">
                                {formatPrice(price)}
                            </span>
                        )}
                        <span className="text-base font-bold text-ivory group-hover:text-gold-300 transition-colors">
                            {formatPrice(discountedPrice)}
                        </span>
                    </div>

                    <Link
                        href={`/products/${id}`}
                        className="w-9 h-9 rounded-full bg-white/[0.03] border border-ivory/[0.08] flex items-center justify-center hover:bg-gold-500 hover:border-gold-500 hover:text-rich-black text-ivory/50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_16px_hsla(37,48%,48%,0.25)]"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
