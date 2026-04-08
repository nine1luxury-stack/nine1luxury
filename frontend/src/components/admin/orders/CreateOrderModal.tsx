
import { useState, useEffect } from "react";
import { Search, Trash2, X } from "lucide-react";
import { productsApi, ordersApi, Product, ProductVariant } from "@/lib/api"; // Assuming these exist
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

// Duplicate of shipping rates for consistency. ideally shared.
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

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
    // const [step, setStep] = useState(1); // 1: Customer, 2: Products
    const [customer, setCustomer] = useState({
        name: '',
        phone: '',
        city: 'القاهرة',
        address: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);

    const [orderItems, setOrderItems] = useState<{
        productId: string;
        variantId: string | undefined;
        name: string;
        size: string;
        color: string;
        price: number;
        quantity: number;
        image: string;
    }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search Products
    const searchProducts = async (term: string) => {
        try {
            const allProducts = await productsApi.getAll();
            const filtered = allProducts.filter((p: Product) =>
                p.name.toLowerCase().includes(term.toLowerCase()) ||
                (p.model && p.model.toLowerCase().includes(term.toLowerCase()))
            ).slice(0, 5);
            setSearchResults(filtered);
        } catch (e) {
            console.error("Search failed", e);
        }
    };

    useEffect(() => {
        const searchTimeout = setTimeout(async () => {
            if (searchTerm.length >= 0) { // Check length >= 0 to allow empty search on initial focus if desired, or keep > 1 
                // Here we use the new helper
                searchProducts(searchTerm);
            }
        }, 500);

        return () => clearTimeout(searchTimeout);
    }, [searchTerm]);

    const handleAddProduct = () => {
        if (!selectedProduct) return;

        // If product has variants, require variant selection
        // Logic: if selectedProduct.variants.length > 0
        if (selectedProduct.variants?.length > 0 && !selectedVariant) {
            alert("يرجى اختيار المقاس/اللون");
            return;
        }

        const varId = selectedVariant?.id;
        const price = selectedProduct.price; // or variant price if exists

        // Check if exists
        const existingIdx = orderItems.findIndex(item => item.productId === selectedProduct.id && item.variantId === varId);

        if (existingIdx >= 0) {
            const newItems = [...orderItems];
            newItems[existingIdx].quantity += quantity;
            setOrderItems(newItems);
        } else {
            setOrderItems([
                ...orderItems,
                {
                    productId: selectedProduct.id,
                    variantId: varId,
                    name: selectedProduct.name,
                    size: selectedVariant?.size || '-',
                    color: selectedVariant?.color || '-',
                    price: Number(price),
                    quantity: Number(quantity),
                    image: selectedProduct.images?.[0]?.url || ''
                }
            ]);
        }

        // Reset selection
        setSelectedProduct(null);
        setSelectedVariant(null);
        setSearchTerm('');
        setQuantity(1);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...orderItems];
        newItems.splice(index, 1);
        setOrderItems(newItems);
    };

    const shippingStats = SHIPPING_RATES[customer.city] || 50;
    const subTotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subTotal + shippingStats;

    const handleSubmit = async () => {
        if (!customer.name || !customer.phone) {
            alert("يرجى إدخال بيانات العميل");
            return;
        }
        if (orderItems.length === 0) {
            alert("يرجى إضافة منتجات");
            return;
        }

        setIsSubmitting(true);
        try {
            await ordersApi.create({
                guestName: customer.name,
                guestPhone: customer.phone,
                guestCity: customer.city,
                guestAddress: customer.address,
                totalAmount: total,
                // status: 'PENDING', // handled by backend default or not in DTO interface if unnecessary
                paymentMethod: 'CASH_ON_DELIVERY',
                items: orderItems.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.price
                }))
            });
            alert("تم إنشاء الطلب بنجاح");
            onSuccess();
            onClose();
        } catch (e) {
            console.error(e);
            alert("فشل إنشاء الطلب");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface-dark w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" dir="rtl">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-rich-black">
                    <h2 className="text-xl font-bold text-white">إضافة طلب جديد</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Customer Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gold-500 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center text-xs">1</span>
                            بيانات العميل
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="اسم العميل"
                                value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                className="bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                            />
                            <input
                                placeholder="رقم الهاتف"
                                value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                className="bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none font-mono text-left"
                                dir="ltr"
                            />
                            <select
                                value={customer.city} onChange={e => setCustomer({ ...customer, city: e.target.value })}
                                className="bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                            >
                                {Object.keys(SHIPPING_RATES).map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <input
                                placeholder="العنوان بالتفصيل"
                                value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                className="bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Product Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gold-500 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center text-xs">2</span>
                            المنتجات
                        </h3>

                        <div className="bg-white/5 p-4 rounded-xl space-y-4 border border-white/5">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    placeholder="ابحث عن منتج..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    onFocus={() => { if (searchTerm.length === 0) searchProducts(''); }}
                                    className="w-full bg-rich-black border border-white/10 rounded-lg pr-10 pl-3 py-2 text-white outline-none focus:border-gold-500"
                                />
                                {(searchResults.length > 0 || searchTerm.length === 0) && !selectedProduct && (
                                    <div className="absolute top-full right-0 left-0 bg-surface-dark border border-white/10 mt-1 rounded-lg z-10 shadow-xl max-h-48 overflow-y-auto">
                                        {searchResults.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => { setSelectedProduct(p); setSearchTerm(p.name); setSearchResults([]); }}
                                                className="w-full text-right p-3 hover:bg-white/5 text-white text-sm flex items-center gap-3 border-b border-white/5 last:border-0"
                                            >
                                                {p.images?.[0] && (
                                                    <Image 
                                                        src={p.images[0].url} 
                                                        alt={p.name}
                                                        width={32}
                                                        height={32}
                                                        className="w-8 h-8 rounded object-cover" 
                                                    />
                                                )}
                                                <span>{p.name} ({formatPrice(p.price)})</span>
                                            </button>
                                        ))}
                                        {searchResults.length === 0 && searchTerm.length > 0 && (
                                            <div className="p-3 text-gray-500 text-center text-sm">لا يوجد نتائج</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Variant Selection */}
                            {selectedProduct && (
                                <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-rich-black rounded-lg border border-white/10">
                                    <div className="flex gap-4 mb-4">
                                        <div className="w-16 h-16 bg-white/5 rounded overflow-hidden relative">
                                            {selectedProduct.images?.[0] && (
                                                <Image 
                                                    src={selectedProduct.images[0].url} 
                                                    alt={selectedProduct.name}
                                                    fill
                                                    className="object-cover" 
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{selectedProduct.name}</h4>
                                            <p className="text-gold-500 font-bold">{formatPrice(selectedProduct.price)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="col-span-2">
                                            <label className="text-xs text-gray-400 block mb-1">المخزون المتوفر</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {selectedProduct.variants?.map((v: ProductVariant) => (
                                                    <button
                                                        key={v.id}
                                                        type="button"
                                                        onClick={() => setSelectedVariant(v)}
                                                        className={`p-2 rounded border text-center text-xs transition-all ${selectedVariant?.id === v.id ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                                                    >
                                                        {v.size} - {v.color}
                                                        <span className={`block font-bold ${v.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>{v.stock} قطع</span>
                                                    </button>
                                                ))}
                                                {(!selectedProduct.variants || selectedProduct.variants.length === 0) && (
                                                    <div className="col-span-3 text-gray-500 text-xs text-center py-2">لا يوجد متغيرات (منتج بسيط)</div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">الكمية</label>
                                            <input
                                                type="number" min="1"
                                                value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                                                className="w-full bg-surface-dark border border-white/10 rounded p-2 text-white"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddProduct}
                                        className="w-full bg-gold-500 text-rich-black font-bold py-2 rounded hover:bg-gold-400 disabled:opacity-50"
                                        disabled={selectedProduct.variants?.length > 0 && !selectedVariant}
                                    >
                                        إضافة للطلب
                                    </button>
                                </div>
                            )}

                            {/* Order Items Table */}
                            {orderItems.length > 0 && (
                                <div className="mt-4">
                                    <table className="w-full text-right text-sm">
                                        <thead className="text-gray-500 border-b border-white/5">
                                            <tr>
                                                <th className="pb-2">المنتج</th>
                                                <th className="pb-2">الخصائص</th>
                                                <th className="pb-2">الكمية</th>
                                                <th className="pb-2">السعر</th>
                                                <th className="pb-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {orderItems.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="py-2 text-white">{item.name}</td>
                                                    <td className="py-2 text-gray-400">{item.size} / {item.color}</td>
                                                    <td className="py-2 text-white">{item.quantity}</td>
                                                    <td className="py-2 text-gold-300">{formatPrice(item.price * item.quantity)}</td>
                                                    <td className="py-2 text-left">
                                                        <button onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:text-red-400">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="border-t border-white/10">
                                            <tr>
                                                <td colSpan={3} className="pt-2 text-gray-400">المجموع الفرعي</td>
                                                <td className="pt-2 text-white font-bold">{formatPrice(subTotal)}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} className="text-gray-400">الشحن ({customer.city})</td>
                                                <td className="text-gold-500 font-bold">{formatPrice(shippingStats)}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} className="pt-2 text-lg text-white font-bold">الإجمالي</td>
                                                <td className="pt-2 text-lg text-gold-300 font-bold">{formatPrice(total)}</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-rich-black flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 rounded text-gray-400 hover:text-white">إلغاء</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-2 bg-gold-500 text-rich-black font-bold rounded hover:bg-gold-400 disabled:opacity-50"
                    >
                        {isSubmitting ? 'جاري الحفظ...' : 'إنشاء الطلب'}
                    </button>
                </div>
            </div>
        </div>
    );
}
