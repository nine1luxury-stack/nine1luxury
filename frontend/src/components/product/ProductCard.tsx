"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ProductVariant, ProductImage } from "@/lib/api";
import { ShoppingBag, Eye } from "lucide-react";

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

export function ProductCard({ id, name, price, discount, images, category, isActive, createdAt, isNew: propIsNew }: ProductCardProps) {
    const displayImage = images?.[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800';
    const discountedPrice = (discount && discount > 0) ? price * (1 - discount / 100) : price;
    const isSoldOut = isActive === false;

    // Check if product is new (created in last 7 days) - default to prop but fallback if not provided
    const isNew = propIsNew ?? (createdAt ? (new Date(new Date().toDateString()).getTime() - new Date(createdAt).getTime() < 7 * 24 * 60 * 60 * 1000) : false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-[#0A0A0A] border border-white/5 hover:border-gold-500/40 transition-all duration-700 rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
        >
            {/* Image section with hover zoom and CTA */}
            <div className="relative aspect-[3.5/5] overflow-hidden bg-[#0A0A0A]">
                {/* Status Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {isNew && (
                        <div className="px-3 py-1 bg-white text-black text-[9px] font-black rounded-full shadow-lg uppercase tracking-widest">
                            جديد
                        </div>
                    )}
                    {discount && discount > 0 && (
                        <div className="px-3 py-1 bg-gold-500 text-rich-black text-[9px] font-black rounded-full shadow-lg shadow-gold-500/30 uppercase tracking-widest">
                            -{discount}%
                        </div>
                    )}
                    {isSoldOut && (
                        <div className="px-3 py-1 bg-red-600/90 backdrop-blur-sm text-[9px] font-black text-white rounded-full uppercase tracking-widest">
                            مباع
                        </div>
                    )}
                </div>

                <Link href={`/products/${id}`} className="block w-full h-full relative overflow-hidden">
                    <Image
                        src={displayImage}
                        alt={name}
                        fill
                        className={cn(
                            "object-cover transition-all duration-1000 group-hover:scale-110 group-hover:blur-[2px] group-hover:opacity-40",
                            isSoldOut && "grayscale opacity-80"
                        )}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                    />
                    
                    {/* Centered Button on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                        <div className="bg-white text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 hover:bg-gold-500 transition-colors">
                            <Eye className="w-4 h-4" />
                            <span>عرض الآن</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Product Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between relative bg-gradient-to-b from-transparent to-black/40">
                <div className="space-y-1">
                    <span className="text-[10px] text-gold-500 font-bold uppercase tracking-[3px] opacity-70">
                        {category}
                    </span>
                    <Link href={`/products/${id}`}>
                        <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors duration-300 line-clamp-1 font-playfair tracking-wide leading-tight">
                            {name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-end justify-between pt-2">
                    <div className="flex flex-col">
                        {discount && discount > 0 && (
                            <span className="text-[10px] text-gray-500 line-through decoration-gold-500/40 mb-0.5">
                                {formatPrice(price)}
                            </span>
                        )}
                        <span className="text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                            {formatPrice(discountedPrice)}
                        </span>
                    </div>

                    <div className="group/btn relative">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/btn:bg-gold-500 group-hover/btn:text-black transition-all duration-500 hover:scale-110 cursor-pointer">
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Shimmer Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 pointer-events-none" />
        </motion.div>
    );
}
