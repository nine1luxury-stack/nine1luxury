"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

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
    const [newReview, setNewReview] = useState({ name: "", content: "", rating: 5 });

    const handleAddReview = (e: React.FormEvent) => {
        e.preventDefault();
        setReviews([
            {
                name: newReview.name,
                role: "عميل جديد",
                content: newReview.content,
                rating: newReview.rating,
            },
            ...reviews
        ]);
        setIsModalOpen(false);
        setNewReview({ name: "", content: "", rating: 5 });
        alert("شكراً لمشاركتنا رأيك!");
    };

    return (
        <section id="reviews" className="py-24 bg-rich-black relative overflow-hidden border-y border-gold-500/10">
            {/* Background Effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-300 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center mb-16 text-center">
                    <h2 className="text-sm uppercase tracking-[0.4em] text-gold-500 font-bold mb-4">
                        آراء عملائنا
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6">
                        تجارب <span className="text-gold-300">استثنائية</span>
                    </h3>
                    <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-8" />
                    

                </div>

                <div className="relative overflow-hidden -mx-4">
                    <motion.div 
                        className="flex gap-8 px-4 w-fit h-full"
                        animate={{ x: ["-50%", "0%"] }}
                        whileHover={{ animationPlayState: "paused" }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 15,
                                ease: "linear",
                            },
                        }}
                    >
                        {[...reviews, ...reviews].map((review, idx) => (
                            <div
                                key={idx}
                                className="relative w-[380px] flex-shrink-0 p-8 bg-surface-dark/40 border border-white/5 rounded-sm hover:border-gold-500/30 transition-all duration-300 group cursor-default"
                            >
                                <div className="absolute top-6 left-6 text-gold-500/10 group-hover:text-gold-500/20 transition-colors">
                                    <Quote className="w-10 h-10" />
                                </div>

                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-600'}`}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-300 leading-relaxed mb-6 font-light h-24 overflow-hidden line-clamp-3 italic">
                                    &quot;{review.content}&quot;
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-rich-black font-bold text-lg">
                                        {review.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{review.name}</h4>
                                        <p className="text-xs text-gold-500 uppercase tracking-wider">
                                            {review.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                    
                    {/* Premium faded edges mask */}
                    <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-rich-black via-rich-black/50 to-transparent z-20 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-rich-black via-rich-black/50 to-transparent z-20 pointer-events-none" />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="شاركنا تجربتك"
            >
                <form onSubmit={handleAddReview} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">الاسم</label>
                        <input 
                            required
                            value={newReview.name}
                            onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                            className="w-full bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                            placeholder="اسمك الكريم"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">التقييم</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewReview({...newReview, rating: star})}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${
                                        newReview.rating >= star 
                                            ? "bg-gold-500/20 border-gold-500 text-gold-500" 
                                            : "border-white/10 text-gray-500 hover:border-gold-500/50"
                                    }`}
                                >
                                    <Star className={`w-5 h-5 ${newReview.rating >= star ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">رأيك يهمنا</label>
                        <textarea 
                            required
                            value={newReview.content}
                            onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                            className="w-full bg-rich-black border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none min-h-[120px]"
                            placeholder="اكتب تجربتك مع منتجاتنا..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            إلغاء
                        </button>
                        <button 
                            type="submit"
                            className="bg-gold-500 hover:bg-gold-600 text-rich-black px-8 py-2 rounded-lg font-bold transition-colors"
                        >
                            نشر الرأي
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
