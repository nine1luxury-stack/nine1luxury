"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { motion } from "framer-motion";



import { ProductVariant } from "@/lib/api";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    discount?: number;
    image?: string;
    images?: { url: string }[];
    category: string;
    variants?: ProductVariant[];
    isActive?: boolean;
}

export function ProductCard({ id, name, price, discount, image, images, category, isActive }: ProductCardProps) {
    // Component logic


    const displayImage = image || images?.[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800';
    const discountedPrice = discount ? price * (1 - discount / 100) : price;
    const isSoldOut = isActive === false;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-surface-dark/40 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500 rounded-sm overflow-hidden"
        >
            {/* Category Tag */}


            {/* Product Image */}
            <div className="relative aspect-[3/4] overflow-hidden">
                {/* Category & Status Badges */}
                <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 items-end">
                    <Link
                        href={`/products?category=${category}`}
                        className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white tracking-wider hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-300 cursor-pointer block"
                    >
                        {category}
                    </Link>
                    
                    {/* Sold Out Badge */}
                    {isSoldOut && (
                        <div className="px-3 py-1 bg-red-600 border border-red-500 rounded-full text-[10px] font-bold text-white tracking-wider uppercase animate-pulse">
                            نفد من المخزن
                        </div>
                    )}
                </div>

                <Link href={`/products/${id}`} className="block w-full h-full relative cursor-pointer">
                    <Image
                        src={displayImage}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={cn(
                            "object-cover transition-opacity duration-700",
                            isSoldOut && "grayscale opacity-80"
                        )}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                    />
                    {/* Overlay for hover effect */}
                    <div className="absolute inset-0 bg-rich-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
            </div>

            {/* Product Info */}
            <div className="p-6 space-y-3">
                <Link href={`/products/${id}`} className="block">
                    <h3 className="text-xl font-medium text-white hover:text-gold-300 transition-colors line-clamp-1">
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        {discount && (
                            <span className="text-xs text-gray-500 line-through">
                                {formatPrice(price)}
                            </span>
                        )}
                        <span className="text-2xl font-playfair font-bold text-gold-300">
                            {formatPrice(discountedPrice)}
                        </span>
                    </div>


                </div>
            </div>

            {/* Shimmer Border on Hover */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </motion.div>
    );
}
