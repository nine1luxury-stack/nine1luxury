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
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-rich-black border-l border-gold-500/20 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-gold-500" />
                                <h2 className="text-xl font-bold text-white font-playfair uppercase tracking-widest">حقيبة التسوق ({totalItems})</h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                                        <ShoppingBag className="w-10 h-10" />
                                    </div>
                                    <p className="text-gray-400 font-medium">حقيبة التسوق فارغة حالياً</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-gold-300 font-bold hover:underline"
                                    >
                                        ابدأ التسوق الآن
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 group">
                                        <div className="relative w-24 h-32 bg-surface-dark overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-white font-bold text-sm line-clamp-1">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                                                    <span>المقاس: <span className="text-gold-300">{item.size}</span></span>
                                                    <span>اللون: <span className="text-gold-300">{item.color}</span></span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center border border-white/10 rounded-sm">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item, -1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs text-white font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item, 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="text-gold-300 font-bold">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-white/5 space-y-4 bg-surface-dark/20">
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-gray-400">الإجمالي:</span>
                                    <span className="text-gold-300">{formatPrice(totalPrice)}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">التوصيل مجاني لأي مكان في مصر بمناسبة الافتتاح</p>
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="block w-full bg-gold-500 hover:bg-gold-600 text-rich-black font-bold py-4 text-center rounded-sm transition-all uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
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
