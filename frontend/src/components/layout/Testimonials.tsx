"use client";

import { motion } from "framer-motion";
import { Star, Quote, MessageSquarePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

const INITIAL_REVIEWS = [
    {
        name: "أحمد محمد",
        role: "عميل مميز",
        content: "جودة المنتجات فوق الخيال، والتعامل راقي جداً. تجربة شراء مميزة وسأكررها بالتأكيد.",
        rating: 5,
    },
    {
        name: "سارة علي",
        role: "عاشقة للموضة",
        content: "التصاميم فريدة وغير مكررة. الخامة ممتازة والتوصيل كان سريع جداً.",
        rating: 5,
    },
    {
        name: "محمود حسن",
        role: "عميل",
        content: "أفضل متجر تعاملت معه من حيث الجودة والخدمة. شكراً لكم على هذا المستوى الرائع.",
        rating: 5,
    },
];

export function Testimonials() {
    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({ name: "", content: "", rating: 5 });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/testimonials');
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setReviews(data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch testimonials:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReview)
            });

            if (res.ok) {
                const added = await res.json();
                setReviews([added, ...reviews]);
                setIsModalOpen(false);
                setNewReview({ name: "", content: "", rating: 5 });
                alert("شكراً لمشاركتنا رأيك! تم حفظ تجربتك بنجاح.");
            } else {
                alert("حدث خطأ أثناء حفظ التقييم. يرجى المحاولة مرة أخرى.");
            }
        } catch (err) {
            console.error(err);
            alert("فشل الاتصال بالسيرفر.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="reviews" className="py-24 bg-rich-black relative overflow-hidden border-y border-ivory/[0.04]">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-[180px]" style={{ background: 'hsla(37, 48%, 48%, 0.04)' }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[180px]" style={{ background: 'hsla(39, 52%, 68%, 0.03)' }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center mb-14 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-label"
                    >
                        آراء عملائنا
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.12 }}
                        className="section-title-editorial text-3xl md:text-5xl mb-4 font-almarai-extra-bold"
                    >
                        تجارب{" "}
                        <span className="text-metallic-gradient">حقيقية</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.12 }}
                        className="section-subtitle"
                    >
                        ثقة عملائنا هي أغلى ما نملك
                    </motion.p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2 }}
                        className="h-px w-20 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mt-5"
                    />
                </div>

                {/* Reviews Carousel */}
                <div className="relative overflow-hidden -mx-4">
                    <motion.div 
                        className="flex gap-6 px-4 w-fit h-full"
                        animate={{ x: ["-50%", "0%"] }}
                        whileHover={{ animationPlayState: "paused" }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 18,
                                ease: "linear",
                            },
                        }}
                    >
                        {[...reviews, ...reviews].map((review, idx) => (
                            <div
                                key={idx}
                                className="relative w-[360px] flex-shrink-0 p-7 glass-card-premium rounded-2xl cursor-default"
                            >
                                {/* Quote icon with glow */}
                                <div className="absolute top-5 left-5 text-gold-500/[0.06] group-hover:text-gold-500/[0.12] transition-colors duration-500">
                                    <Quote className="w-9 h-9" />
                                </div>

                                <div className="flex gap-0.5 mb-5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${i < review.rating ? 'text-gold-500 fill-gold-500' : 'text-ivory/10'}`}
                                        />
                                    ))}
                                </div>

                                <p className="text-ivory/80 leading-relaxed mb-6 font-light h-20 overflow-hidden line-clamp-3 italic text-sm">
                                    &quot;{review.content}&quot;
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl luxury-gradient flex items-center justify-center text-rich-black font-bold text-sm shadow-[0_4px_12px_hsla(37,48%,48%,0.2)]">
                                        {review.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-ivory/90 font-bold text-sm">{review.name}</h4>
                                        <p className="text-[10px] text-gold-500/90 uppercase tracking-wider">
                                            {review.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                    
                    {/* Edge fade masks */}
                    <div className="absolute top-0 left-0 w-28 h-full bg-gradient-to-r from-rich-black to-transparent z-20 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-28 h-full bg-gradient-to-l from-rich-black to-transparent z-20 pointer-events-none" />
                </div>

                {/* Add Review Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-10 text-center"
                >
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-ghost text-sm py-3 px-8"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                        شاركنا تجربتك
                    </button>
                </motion.div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="شاركنا تجربتك"
            >
                <form onSubmit={handleAddReview} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-ivory/40">الاسم</label>
                        <input 
                            required
                            value={newReview.name}
                            onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                            className="luxury-input"
                            placeholder="اسمك الكريم"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-ivory/40">التقييم</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewReview({...newReview, rating: star})}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                                        newReview.rating >= star 
                                            ? "bg-gold-500/15 border-gold-500/40 text-gold-500" 
                                            : "border-ivory/[0.06] text-ivory/20 hover:border-gold-500/30"
                                    }`}
                                >
                                    <Star className={`w-5 h-5 ${newReview.rating >= star ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-ivory/40">رأيك يهمنا</label>
                        <textarea 
                            required
                            value={newReview.content}
                            onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                            className="luxury-input min-h-[120px] resize-none"
                            placeholder="اكتب تجربتك مع منتجاتنا..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2.5 text-ivory/40 hover:text-ivory transition-colors rounded-xl"
                        >
                            إلغاء
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary text-sm py-2.5 px-8 flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            نشر الرأي
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
