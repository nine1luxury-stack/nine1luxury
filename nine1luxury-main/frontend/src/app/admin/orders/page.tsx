"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Plus,
    Search,
    Eye,
    MessageCircle,
    Printer,
    Download,
    RefreshCcw,
    Trash2,
    Loader2,
    CheckCircle
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { ordersApi, Order, OrderItem } from "@/lib/api";
import { CreateOrderModal } from "@/components/admin/orders/CreateOrderModal";
import { createArabicPDF, reshapeArabic, autoTable } from "@/lib/pdf-utils";



export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Return Modal State
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [itemToReturn, setItemToReturn] = useState<OrderItem | null>(null);
    const [returnQuantity, setReturnQuantity] = useState(1);
    const [returnType, setReturnType] = useState('VALID'); // VALID, DAMAGED, WASH, REPACKAGE
    const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleOpenReturnModal = (item: OrderItem) => {
        setItemToReturn(item);
        setReturnQuantity(1);
        setReturnType('VALID');
        setIsReturnModalOpen(true);
    };

    const handleSubmitReturn = async () => {
        if (!itemToReturn || !selectedOrder) return;
        setIsSubmittingReturn(true);

        try {
            const res = await fetch('/api/returns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: selectedOrder.id,
                    orderItemId: itemToReturn.id,
                    variantId: itemToReturn.variantId,
                    productId: itemToReturn.productId,
                    quantity: Number(returnQuantity),
                    type: returnType,
                    status: 'PENDING' // Explicitly set pending waiting for inventory approval
                })
            });

            if (res.ok) {
                alert("تم إنشاء طلب الاسترجاع بنجاح");
                setIsReturnModalOpen(false);
                // Optionally refresh orders or mark item as returned
            } else {
                const err = await res.json();
                alert(`فشل إنشاء الطلب: ${err.message || 'Error'}`);
            }
        } catch (e) {
            console.error(e);
            alert("حدث خطأ أثناء الاتصال بالخادم");
        } finally {
            setIsSubmittingReturn(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const headers = ["Order ID", "Customer Name", "Phone", "Total", "Status", "Date"];
        const rows = orders.map(order => [
            order.id,
            order.guestName || "N/A",
            order.guestPhone || "N/A",
            order.totalAmount,
            order.status,
            new Date(order.createdAt).toLocaleDateString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers, ...rows].map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadPDF = () => {
        const doc = createArabicPDF();
        doc.setFontSize(22);
        doc.text(reshapeArabic("تقرير الطلبات"), 105, 15, { align: "center" });
        doc.setFontSize(10);
        doc.text(reshapeArabic(`تاريخ الإنشاء: ${new Date().toLocaleString('ar-EG')}`), 105, 22, { align: "center" });

        const tableData = filteredOrders.map(o => [
            String(o.id).substring(0, 8),
            reshapeArabic(o.guestName || "غير مسجل"),
            o.guestPhone || "N/A",
            `${o.totalAmount} ج.م`,
            reshapeArabic(o.status === 'PENDING' ? 'معلق' : o.status === 'CONFIRMED' ? 'مؤكد' : o.status === 'SHIPPED' ? 'مشحون' : o.status === 'DELIVERED' ? 'تم التوصيل' : 'ملغي'),
            new Date(o.createdAt).toLocaleDateString('ar-EG')
        ]);

        autoTable(doc, {
            head: [[reshapeArabic('المعرف'), reshapeArabic('العميل'), reshapeArabic('الهاتف'), reshapeArabic('الإجمالي'), reshapeArabic('الحالة'), reshapeArabic('التاريخ')]],
            body: tableData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [174, 132, 57], font: 'Amiri', halign: 'center' },
            styles: { font: "Amiri", halign: 'center' },
        });

        doc.save(`orders-${new Date().getTime()}.pdf`);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };
        fetchOrders();

        // Polling for real-time updates every 10 seconds
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
        // Optimistic Update
        const previousOrders = [...orders];
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                throw new Error("فشل تحديث الحالة");
            }
        } catch (e) {
            console.error(e);
            alert("حدث خطأ أثناء تحديث الحالة");
            setOrders(previousOrders); // Rollback
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.")) return;

        // Optimistic Update
        const previousOrders = [...orders];
        setOrders(prev => prev.filter(o => o.id !== orderId));
        setDeletingId(orderId);

        try {
            await ordersApi.delete(orderId);
            alert("تم حذف الطلب بنجاح");
        } catch (error) {
            console.error("Failed to delete order", error);
            alert("فشل حذف الطلب");
            setOrders(previousOrders); // Rollback
        } finally {
            setDeletingId(null);
        }
    };

    // Filter orders based on search term (searching by ID, name, or phone)
    const filteredOrders = orders.filter(order =>
        String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.guestName && order.guestName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.guestPhone && order.guestPhone.includes(searchTerm))
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-wider">الطلبات</h1>
                    <p className="text-gray-400 text-sm mt-1">إحصائيات ومتابعة جميع طلبات العملاء وحالات الشحن.</p>
                </div>
                {/* Actions (Printer/Download) - Keeping for visual consistency but they are placeholders */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-3 bg-gold-500 text-rich-black font-bold rounded-xl hover:bg-gold-400 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>إضافة طلب</span>
                    </button>
                    <button
                        onClick={handlePrint}
                        className="p-3 bg-surface-dark border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all"
                        title="طباعة"
                    >
                        <Printer className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="p-3 bg-surface-dark border border-white/5 rounded-xl text-gray-400 hover:text-gold-500 hover:bg-white/5 transition-all"
                        title="تصدير PDF"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-3 bg-surface-dark border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all hidden sm:block"
                        title="تصدير CSV"
                    >
                        <RefreshCcw className="w-5 h-5 rotate-90" />
                    </button>
                </div>
            </div>

            {/* Statistics & Quick Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Orders Overview */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { label: "كل الطلبات", count: orders.length, active: true },
                        { label: "تم التأكيد", count: orders.filter(o => o.status === 'CONFIRMED').length },
                        { label: "تم التوصيل", count: orders.filter(o => o.status === 'DELIVERED').length },
                    ].map((filter) => (
                        <div
                            key={filter.label}
                            className={cn(
                                "p-6 rounded-2xl border transition-all text-right group",
                                filter.active
                                    ? "bg-gold-500/10 border-gold-500/40"
                                    : "bg-surface-dark border-white/5 hover:border-white/10"
                            )}
                        >
                            <p className={cn("text-xs font-bold uppercase tracking-widest", filter.active ? "text-gold-300" : "text-gray-500")}>{filter.label}</p>
                            <h4 className="text-3xl font-bold text-white mt-2">{filter.count}</h4>
                        </div>
                    ))}
                </div>

                {/* Top Cities */}
                <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xs font-bold text-gold-500 uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">المحافظات الأكثر طلباً</h3>
                    <div className="space-y-4">
                        {Object.entries(
                            orders.reduce((acc: Record<string, number>, order) => {
                                const city = order.guestCity || 'غير محدد';
                                acc[city] = (acc[city] || 0) + 1;
                                return acc;
                            }, {})
                        )
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 5)
                            .map(([city, count], index) => (
                                <div key={city} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-gray-600">0{index + 1}</span>
                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{city}</span>
                                    </div>
                                    <span className="text-xs bg-white/5 px-2 py-1 rounded-md text-gold-400 font-bold">{count} طلب</span>
                                </div>
                            ))}
                        {orders.length === 0 && (
                            <p className="text-xs text-gray-600 text-center py-4">لا توجد بيانات متاحة</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full lg:w-auto">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="ابحث برقم الطلب، اسم العميل، أو الهاتف..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-rich-black border border-white/5 rounded-xl pr-12 pl-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-20 bg-surface-dark rounded-2xl border border-white/5">
                            <Plus className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">لا توجد طلبات حتى الآن</p>
                        </div>
                    ) : (
                        <table className="w-full text-right border-collapse min-w-[800px]">
                            <thead>
                                <tr className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/5">
                                    <th className="px-6 py-5">رقم الطلب</th>
                                    <th className="px-6 py-5">العميل</th>
                                    <th className="px-6 py-5">الإجمالي</th>
                                    <th className="px-6 py-5 text-center">الحالة</th>
                                    <th className="px-6 py-5">التاريخ</th>
                                    <th className="px-6 py-5 text-left">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-white/[0.01] transition-all cursor-pointer" onClick={() => handleViewOrder(order)}>
                                        <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                                            <span className="text-xs text-gray-500 font-mono group-hover:text-gold-500/80 transition-colors uppercase">
                                                {String(order.id)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 font-playfair transition-all">
                                            <div className="flex flex-col">
                                                <span className="text-base text-white font-bold group-hover:text-gold-300 transition-colors">
                                                    {order.guestName || 'عميل مجهول'}
                                                </span>
                                                <span className="text-[10px] text-gray-600 font-mono mt-0.5">{order.guestPhone || 'بدون رقم'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-gold-400 font-bold text-base">{formatPrice(order.totalAmount)}</span>
                                                <span className="text-[9px] text-gray-600 uppercase tracking-tighter">{order.paymentMethod === 'CASH_ON_DELIVERY' ? 'دفع عند الاستلام' : 'دفع أونلاين'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                                                className={cn(
                                                    "text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase cursor-pointer outline-none border transition-all text-center mx-auto block min-w-[110px]",
                                                    order.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20' :
                                                        order.status === 'CONFIRMED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500 hover:bg-blue-500/20' :
                                                            order.status === 'SHIPPED' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500 hover:bg-purple-500/20' :
                                                                order.status === 'DELIVERED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20' :
                                                                    'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'
                                                )}
                                            >
                                                <option value="PENDING" className="bg-rich-black text-gray-300">قيد الانتظار</option>
                                                <option value="CONFIRMED" className="bg-rich-black text-blue-300">تم التأكيد</option>
                                                <option value="SHIPPED" className="bg-rich-black text-purple-300">تم الشحن</option>
                                                <option value="DELIVERED" className="bg-rich-black text-green-300">تم التوصيل</option>
                                                <option value="CANCELLED" className="bg-rich-black text-red-300">ملغي</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-[13px] text-gray-500 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-left" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-3">
                                                {order.guestPhone && (
                                                    <a
                                                        href={`https://wa.me/20${order.guestPhone.startsWith('0') ? order.guestPhone.slice(1) : order.guestPhone}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
                                                        title="واتساب"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleViewOrder(order)}
                                                    className="p-2 text-gray-500 hover:text-gold-400 hover:bg-gold-400/10 rounded-xl transition-all"
                                                    title="تفاصيل"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    disabled={deletingId === order.id}
                                                    className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                                    title="حذف"
                                                >
                                                    {deletingId === order.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-gold-500" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`تفاصيل الطلب #${selectedOrder?.id}`}
            >
                {selectedOrder && (
                    <div className="space-y-8" dir="rtl">
                        {/* Customer Info */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <h3 className="text-sm font-bold text-gold-500 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">بيانات العميل</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">الاسم</p>
                                    <p className="text-white font-medium">{selectedOrder.guestName || 'غير مسجل'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">رقم الهاتف</p>
                                    <p className="text-white font-medium font-mono dir-ltr text-right">{selectedOrder.guestPhone}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-400 text-xs mb-1">العنوان</p>
                                    <p className="text-white font-medium">
                                        {[
                                            selectedOrder.guestCity,
                                            selectedOrder.guestAddress
                                        ].filter(Boolean).join(' - ')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="text-sm font-bold text-gold-500 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">المنتجات ({selectedOrder.items?.length || 0})</h3>
                            <div className="space-y-3">
                                {selectedOrder.items?.map((item: OrderItem, index: number) => (
                                    <div key={index} className="flex gap-4 bg-white/5 rounded-xl p-3 border border-white/5 items-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            {/* Placeholder for image if not available */}
                                            {item.product?.images?.[0] ? (
                                                <Image
                                                    src={typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0].url}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold text-sm">{item.product?.name}</h4>
                                            <div className="flex gap-3 mt-1 text-xs text-gray-400">
                                                {item.variant?.color && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: item.variant.color }}></span>
                                                        {item.variant.color}
                                                    </span>
                                                )}
                                                {item.variant?.size && <span>المقاس: {item.variant.size}</span>}
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-gold-300 font-bold text-sm">{formatPrice(item.price)}</p>
                                                <p className="text-gray-400 text-xs">الكمية: {item.quantity}</p>
                                            </div>
                                        </div>

                                        {/* Return Action */}
                                        <button
                                            onClick={() => handleOpenReturnModal(item)}
                                            className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                        >
                                            <RefreshCcw className="w-3 h-3" />
                                            استرجاع
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gold-500/10 rounded-xl p-4 border border-gold-500/20">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400 text-sm">الإجمالي الفرعي</span>
                                <span className="text-white font-medium">{formatPrice(selectedOrder.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400 text-sm">الشحن ({selectedOrder.guestCity})</span>
                                <span className="text-white font-medium">{formatPrice(selectedOrder.shippingCost || 0)}</span>
                            </div>
                            <div className="border-t border-white/10 my-2 pt-2 flex justify-between items-center">
                                <span className="text-gold-500 font-bold">الإجمالي الكلي</span>
                                <span className="text-gold-300 font-bold text-lg">{formatPrice(selectedOrder.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create Return Modal */}
            {itemToReturn && (
                <Modal
                    isOpen={isReturnModalOpen}
                    onClose={() => setIsReturnModalOpen(false)}
                    title="إنشاء طلب استرجاع"
                >
                    <div className="space-y-6" dir="rtl">
                        <div className="bg-white/5 p-4 rounded-xl flex items-start gap-4 border border-white/5">
                            <div className="w-20 h-24 bg-black/20 rounded-lg overflow-hidden shrink-0 border border-white/10 relative">
                                {itemToReturn.product?.images?.[0] && (
                                    <Image
                                        src={typeof itemToReturn.product.images[0] === 'string' ? itemToReturn.product.images[0] : itemToReturn.product.images[0].url}
                                        alt={itemToReturn.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-white font-bold text-base">{itemToReturn.product?.name}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {itemToReturn.variant?.size && (
                                        <span className="px-2 py-1 bg-white/10 rounded text-xs text-white border border-white/10">
                                            المقاس: <span className="font-bold text-gold-500">{itemToReturn.variant.size}</span>
                                        </span>
                                    )}
                                    {itemToReturn.variant?.color && (
                                        <span className="px-2 py-1 bg-white/10 rounded text-xs text-white border border-white/10 flex items-center gap-2">
                                            اللون:
                                            <span className="flex items-center gap-1 font-bold text-gold-500">
                                                <span
                                                    className="w-3 h-3 rounded-full border border-white/20"
                                                    style={{ backgroundColor: itemToReturn.variant.colorHex || itemToReturn.variant.color }}
                                                />
                                                {itemToReturn.variant.color}
                                            </span>
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                    SKU: {itemToReturn.variant?.sku || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">الكمية المسترجعة (المتاح: {itemToReturn.quantity})</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setReturnQuantity(1)}
                                        className={`px-3 py-2 rounded text-xs font-bold transition-all border ${returnQuantity === 1 ? 'border-gold-500 text-gold-500 bg-gold-500/10' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                                    >
                                        قطعة واحدة
                                    </button>
                                    <button
                                        onClick={() => setReturnQuantity(itemToReturn.quantity)}
                                        className={`px-3 py-2 rounded text-xs font-bold transition-all border ${returnQuantity === itemToReturn.quantity ? 'border-gold-500 text-gold-500 bg-gold-500/10' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                                    >
                                        الكل ({itemToReturn.quantity})
                                    </button>
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    max={itemToReturn.quantity}
                                    value={returnQuantity}
                                    onChange={(e) => setReturnQuantity(Math.min(Math.max(1, Number(e.target.value)), itemToReturn.quantity))}
                                    className="w-full mt-2 bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 block mb-2">حالة المنتج عند الاستلام</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'VALID', label: 'صالح للبيع', color: 'bg-green-500/20 text-green-500' },
                                        { id: 'DAMAGED', label: 'تالف', color: 'bg-red-500/20 text-red-500' },
                                        { id: 'WASH', label: 'يحتاج غسيل', color: 'bg-blue-500/20 text-blue-500' },
                                        { id: 'REPACKAGE', label: 'إعادة تغليف', color: 'bg-yellow-500/20 text-yellow-500' }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setReturnType(type.id)}
                                            className={cn(
                                                "p-3 rounded-xl text-xs font-bold transition-all border",
                                                returnType === type.id
                                                    ? `${type.color} border-white/20`
                                                    : "bg-surface-dark text-gray-400 border-white/5 hover:bg-white/5"
                                            )}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmitReturn}
                            disabled={isSubmittingReturn}
                            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmittingReturn ? "جاري الإنشاء..." : "تأكيد واسترجاع"}
                        </button>
                    </div>
                </Modal>
            )}
            {/* Create Order Modal */}
            <CreateOrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    // Refresh orders
                    const fetchOrders = async () => {
                        try {
                            const res = await fetch('/api/orders');
                            if (res.ok) {
                                const data = await res.json();
                                setOrders(data);
                            }
                        } catch (error) {
                            console.error("Failed to fetch orders", error);
                        }
                    };
                    fetchOrders();
                }}
            />
        </div>
    );
}
