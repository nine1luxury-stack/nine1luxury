"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
    const { cart, removeFromCart, addToCart, totalPrice, totalItems, isCartOpen, setIsCartOpen } = useCart();

    const handleUpdateQuantity = (item: CartItem, delta: number) => {
        if (item.quantity + delta > 0) {
            addToCart({ ...item, quantity: delta });
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 z-[60] bg-rich-black/85 backdrop-blur-md"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-surface-dark border-l border-ivory/[0.06] shadow-[-20px_0_60px_rgba(0,0,0,0.6)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-ivory/[0.04] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-gold-500" />
                                <h2 className="text-lg font-bold text-ivory font-playfair uppercase tracking-wider">حقيبة التسوق ({totalItems})</h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 text-ivory/30 hover:text-ivory hover:bg-white/[0.03] rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-18 h-18 rounded-2xl bg-white/[0.03] flex items-center justify-center text-ivory/15">
                                        <ShoppingBag className="w-9 h-9" />
                                    </div>
                                    <p className="text-ivory/30 font-medium">حقيبة التسوق فارغة حالياً</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-gold-300 font-bold hover:underline text-sm"
                                    >
                                        ابدأ التسوق الآن
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 group">
                                        <div className="relative w-22 h-28 bg-surface-card rounded-xl overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-ivory/85 font-bold text-sm line-clamp-1">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                                                        className="text-ivory/15 hover:text-red-400 transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <div className="flex gap-2 text-[9px] text-ivory/20 font-bold uppercase tracking-tight">
                                                    <span>المقاس: <span className="text-champagne/60">{item.size}</span></span>
                                                    <span>اللون: <span className="text-champagne/60">{item.color}</span></span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center border border-ivory/[0.06] rounded-lg">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item, -1)}
                                                        className="w-7 h-7 flex items-center justify-center text-ivory/30 hover:text-ivory transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-7 text-center text-xs text-ivory font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item, 1)}
                                                        className="w-7 h-7 flex items-center justify-center text-ivory/30 hover:text-ivory transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="text-champagne font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-ivory/[0.04] space-y-4 bg-surface-card/30">
                                <div className="flex justify-between text-base font-bold">
                                    <span className="text-ivory/40">الإجمالي:</span>
                                    <span className="text-champagne">{formatPrice(totalPrice)}</span>
                                </div>
                                <p className="text-[9px] text-ivory/15 text-center uppercase tracking-[0.15em]">التوصيل مجاني لأي مكان في مصر بمناسبة الافتتاح</p>
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="btn-primary w-full justify-center tracking-[0.15em]"
                                >
                                    إتمام الطلب
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
