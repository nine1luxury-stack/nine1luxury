"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, User, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart, removeFromCart } = useCart();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        altPhone: "",
        address: "",
        city: "القاهرة",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    const SHIPPING_RATES: Record<string, number> = {
        "القاهرة": 80,
        "الجيزة": 80,
        "الإسكندرية": 80,
        "الدقهلية": 80,
        "البحر الأحمر": 140,
        "البحيرة": 80,
        "الفيوم": 90,
        "الغربية": 80,
        "الإسماعيلية": 80,
        "المنوفية": 80,
        "المنيا": 110,
        "القليوبية": 80,
        "الوادي الجديد": 140,
        "السويس": 80,
        "أسوان": 140,
        "أسيوط": 120,
        "بني سويف": 90,
        "بورسعيد": 80,
        "دمياط": 80,
        "الشرقية": 80,
        "جنوب سيناء": 120,
        "كفر الشيخ": 80,
        "مطروح": 120,
        "الأقصر": 140,
        "قنا": 140,
        "شمال سيناء": 120,
        "سوهاج": 120
    };

    const shippingCost = SHIPPING_RATES[formData.city] || 80;
    const finalTotal = totalPrice + shippingCost;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Name validation
        if (formData.name.trim().split(/\s+/).length < 2) {
            setErrors({ name: "يرجى إدخال الاسم ثنائياً على الأقل" });
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                guestName: formData.name,
                guestPhone: formData.phone,
                guestAddress: formData.address,
                guestCity: formData.city,
                totalAmount: finalTotal,
                shippingCost: shippingCost,
                items: cart.map(item => ({
                    productId: item.id,
                    name: item.name,
                    size: item.size,
                    color: item.color,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.price,
                }))
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            clearCart();
            setIsOrderPlaced(true);

        } catch (error) {
            console.error("Checkout Error:", error);
            alert("حدث خطأ أثناء تنفيذ الطلب. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isOrderPlaced) {
        return (
            <main className="min-h-screen bg-rich-black">
                <Header />
                <div className="pt-48 pb-24 text-center container mx-auto px-4">
                    <div className="max-w-md mx-auto bg-surface-dark/40 border border-gold-500/10 p-12 rounded-2xl">
                        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Send className="w-10 h-10 text-gold-500" />
                        </div>
                        <h2 className="text-3xl font-playfair font-bold text-white mb-4">تم استلام طلبك بنجاح!</h2>
                        <p className="text-gray-400 mb-8">
                            سيتم مراجعة طلبك وإرسال تفاصيله إلى الإدارة. سنتواصل معك هاتفياً للتأكيد قريباً.
                        </p>
                        <Link href="/products" className="bg-gold-500 text-rich-black px-8 py-4 font-bold uppercase inline-block rounded-lg hover:bg-gold-300 transition-colors">
                            متابعة التسوق
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-rich-black">
                <Header />
                <div className="pt-48 pb-24 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">سلة التسوق فارغة</h2>
                    <Link href="/products" className="bg-gold-500 text-rich-black px-8 py-3 font-bold uppercase inline-block rounded-lg">تواصل للتسوق</Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-rich-black">
            <Header />

            <div className="pt-32 pb-24 container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-12 uppercase text-center">
                        إتمام الطلب
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Shipping Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-surface-dark/40 border border-gold-500/10 p-8 space-y-8"
                        >
                            <h2 className="text-xl font-bold text-gold-300 flex items-center gap-3">
                                <MapPin className="w-5 h-5" />
                                بيانات الشحن
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase font-bold">رقم الهاتف</label>
                                    <div className="relative">
                                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            dir="ltr"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-rich-black border border-white/10 px-12 py-4 text-white focus:border-gold-500 transition-colors outline-none text-right"
                                            placeholder="رقم الموبايل (واتساب)"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase font-bold">الاسم بالكامل</label>
                                    <div className="relative">
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full bg-rich-black border px-12 py-4 text-white focus:border-gold-500 transition-colors outline-none ${errors.name ? 'border-red-500' : 'border-white/10'}`}
                                            placeholder="أدخل اسمك بالكامل"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1 absolute right-0">{errors.name}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">المحافظة</label>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full bg-rich-black border border-white/10 px-4 py-4 text-white focus:border-gold-500 outline-none"
                                        >
                                            {Object.keys(SHIPPING_RATES).map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">العنوان</label>
                                        <input
                                            required
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full bg-rich-black border border-white/10 px-4 py-4 text-white focus:border-gold-500 outline-none"
                                            placeholder="العنوان بالتفصيل"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-16 bg-gold-500 text-rich-black font-bold uppercase flex items-center justify-center gap-3 hover:bg-gold-300 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>{isSubmitting ? 'جاري التنفيذ...' : 'تأكيد الطلب'}</span>
                                </button>
                            </form>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="bg-surface-dark/20 border border-gold-500/10 p-8">
                                <h2 className="text-xl font-bold text-white mb-8 border-b border-gold-500/10 pb-4">ملخص الطلب</h2>

                                <div className="space-y-6 max-h-96 overflow-y-auto pr-2 no-scrollbar">
                                    {cart.map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="relative w-20 h-24 shrink-0 bg-surface-dark">
                                                <Image
                                                    src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'}
                                                    alt={item.name}
                                                    fill
                                                    sizes="80px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1 relative">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-white font-medium line-clamp-1">{item.name}</h4>
                                                        <p className="text-xs text-gray-500 uppercase">{item.size} / {item.color}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                                                        className="text-gray-500 hover:text-red-500 transition-colors p-1"
                                                        title="حذف من السلة"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-center pt-2">
                                                    <span className="text-gray-400 text-sm">الكمية: {item.quantity}</span>
                                                    <span className="text-gold-300 font-bold">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-6 border-t border-gold-500/10 space-y-4">
                                    <div className="flex justify-between text-gray-400">
                                        <span>السعر الفرعي</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>تكلفة الشحن ({formData.city})</span>
                                        <span className="text-gold-300 font-bold">{formatPrice(shippingCost)}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-playfair font-bold text-white pt-4">
                                        <span>الإجمالي</span>
                                        <span className="text-gold-300">{formatPrice(finalTotal)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Secure Payment Note */}
                            <div className="space-y-4">
                                <div className="p-6 border border-gold-500/10 bg-gold-500/5 text-center space-y-2 rounded-lg">
                                    <p className="text-sm text-gold-300 font-bold uppercase mb-1">طريقة الدفع</p>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        يتم تحويل قيمة الشحن فقط (مقدماً) لجدية الحجز، وباقي المبلغ عند الاستلام والمعاينة.
                                    </p>
                                </div>

                                <div className="p-6 border border-white/5 bg-surface-dark/40 text-center space-y-6 rounded-lg">
                                    <div className="space-y-2">
                                        <h4 className="text-gold-400 font-bold text-lg uppercase">سياسة الاستبدال</h4>
                                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                            في حالة وجود أي مشكلة في المقاس أو الخامة، يمكنك طلب الاستبدال فوراً.
                                        </p>
                                    </div>

                                    <div className="w-1/2 mx-auto h-px bg-white/5" />

                                    <div className="space-y-2">
                                        <h4 className="text-gold-400 font-bold text-lg uppercase">مدة التوصيل</h4>
                                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                            3-4 أيام لمحافظات الوجه البحري
                                            <br />
                                            4-5 أيام لمحافظات الوجه القبلي
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>


                    </div>
                </div>
            </div>

            <Footer />
        </main >
    );
}
