"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/layout/Hero";
import { ProductCard } from "@/components/product/ProductCard";
import { Testimonials } from "@/components/layout/Testimonials";
import { motion } from "framer-motion";

import Link from "next/link";
import { PromoBanner } from "@/components/layout/PromoBanner";

import { productsApi, Product } from "@/lib/api";
import { useState, useEffect } from "react";
import { ShoppingBag, ArrowLeft, Loader2, Truck, Shield, Headphones, Sparkles, Crown, Star, ArrowRight } from "lucide-react";

function Starfield() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const arr = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 2,
    }));
    setStars(arr);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rich-black via-[#050B14] to-rich-black opacity-80" />
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            boxShadow: `0 0 ${s.size * 2}px hsla(0, 0%, 100%, 0.8)`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsApi.getAll({ featured: true, limit: 12 }),
      fetch('/api/offers').then(res => res.json())
    ])
    .then(([productsData, offersData]) => {
      setDisplayProducts(productsData);
      setOffers(offersData.filter((o: any) => o.isActive).slice(0, 3));
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const whyUs = [
    { icon: Sparkles, title: "جودة فائقة", desc: "أجود الخامات المستوردة لضمان منتجات تدوم طويلاً", accent: "from-gold-500/20 to-gold-700/10" },
    { icon: Truck, title: "توصيل مجاني", desc: "شحن مجاني لكل مكان في مصر بمناسبة الافتتاح", accent: "from-champagne/20 to-bronze/10" },
    { icon: Shield, title: "ضمان الجودة", desc: "استبدال واسترجاع خلال 14 يوم من الاستلام", accent: "from-gold-400/20 to-gold-600/10" },
    { icon: Headphones, title: "دعم متواصل", desc: "فريق خدمة العملاء متاح على مدار الساعة", accent: "from-champagne/15 to-gold-500/10" },
  ];

  const categories = [
    { name: "تيشيرتات", slug: "تيشرتات" },
    { name: "بناطيل", slug: "بنطلون" },
    { name: "أحذية", slug: "أحذية" },
    { name: "إكسسوارات", slug: "اكسسوار" },
  ];

  return (
    <main className="min-h-screen bg-rich-black relative">
      <Starfield />
      
      <Hero />

      {/* ═══ Trending Categories — Horizontal Glass Scroll ═══ */}
      <section className="py-12 bg-transparent relative overflow-hidden" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-4 justify-center flex-wrap">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
              >
                <Link
                  href={`/products?category=${encodeURIComponent(cat.slug)}`}
                  className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white/[0.02] border border-ivory/[0.06] hover:border-gold-500/30 hover:bg-gold-500/[0.06] transition-all duration-500 whitespace-nowrap hover:shadow-[0_8px_32px_hsla(37,48%,48%,0.1)]"
                >
                  <span className="text-sm font-bold text-ivory/90 group-hover:text-gold-300 transition-colors duration-300">{cat.name}</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-ivory/40 group-hover:text-gold-500 transition-all duration-300 group-hover:-translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ Offers Section ═══ */}
      <section className="py-20 md:py-28 bg-transparent overflow-hidden relative" dir="rtl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[180px] -z-10" style={{ background: 'hsla(37, 48%, 48%, 0.04)' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center text-center mb-14 gap-6">
            <div className="flex flex-col items-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-label"
              >
                فرص حصرية
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.12 }}
                className="section-title-editorial text-3xl md:text-5xl font-almarai-extra-bold"
              >
                أحدث{" "}
                <span className="text-metallic-gradient">العروض</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.12 }}
                className="section-subtitle mt-3 text-center mx-auto"
              >
                عروض محدودة الوقت — لا تفوت الفرصة
              </motion.p>
            </div>
            <Link href="/offers" className="px-7 py-2.5 bg-white/[0.03] border border-ivory/[0.08] rounded-full text-ivory/70 font-bold hover:bg-gold-500 hover:text-rich-black transition-all duration-400 hover:border-gold-500 text-sm hover:shadow-[0_8px_24px_hsla(37,48%,48%,0.2)]">
              عرض جميع العروض
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {offers.length > 0 ? (
              offers.map((offer, idx) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.15, delay: idx * 0.03 }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                  }}
                  className="group relative h-64 rounded-[2.5rem] overflow-hidden glass-card-premium luxury-shadow-lg border-ivory/[0.05] hover:border-gold-500/30 transition-all duration-700"
                >
                  {/* Dynamic Mouse Glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), hsla(37, 48%, 48%, 0.12), transparent 40%)`
                    }}
                  />

                  {/* Mesh Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/[0.03] via-transparent to-rose-500/[0.02] opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Subtle Top-Right Ambient Glow */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] bg-gold-500/[0.08] group-hover:bg-gold-500/[0.15] transition-all duration-1000 animate-pulse" />

                  <div className="relative h-full p-8 flex flex-col justify-center items-center text-center">
                    {/* Title with Metallic Gradient and Editorial Font */}
                    <h4 className="text-2xl md:text-3xl font-almarai-extra-bold-straight text-metallic-gradient mb-8 transition-transform duration-500 group-hover:scale-110">
                      {offer.title}
                    </h4>

                    {/* Glass Capsule Button */}
                    <Link
                      href={`/products?category=${encodeURIComponent(offer.link)}`}
                      className="group/btn relative flex items-center gap-3 px-8 py-3 rounded-full bg-white/[0.03] border border-ivory/[0.08] hover:border-gold-500/40 transition-all duration-500 overflow-hidden"
                    >
                      {/* Button Inner Shine */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                      
                      <span className="relative text-[10px] font-black uppercase tracking-[0.3em] text-ivory/60 group-hover/btn:text-gold-300 transition-colors">
                        تسوق الآن
                      </span>
                      <ArrowLeft className="relative w-3.5 h-3.5 text-gold-500 transition-transform group-hover/btn:-translate-x-1.5" />
                    </Link>

                    {/* Decorative Bottom Line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-ivory/60">
                لا توجد عروض نشطة حالياً
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ Featured Products ═══ */}
      <section className="pt-16 pb-28 bg-transparent relative">
        {/* Watermark */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.012] flex items-center justify-center">
          <span className="text-[20vw] font-playfair font-bold whitespace-nowrap">NINE 1 LUXURY</span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center mb-16 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-label"
            >
              إصدارات مختارة
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.12 }}
              className="section-title-editorial text-3xl md:text-6xl mb-4 font-almarai-extra-bold"
            >
              المجموعة{" "}
              <span className="text-metallic-gradient">المميزة</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.12 }}
              className="section-subtitle mb-6"
            >
              اختيارات منتقاة بعناية تعكس ذوقك الرفيع
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mb-8"
            />

            <PromoBanner />
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.02
                }
              }
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5"
          >
            {displayProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link href="/products" className="btn-ghost text-sm tracking-widest">
              <ShoppingBag className="w-4 h-4" />
              عرض جميع المنتجات
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ Why Choose Us — Premium 3D Cards ═══ */}
      <section className="py-20 md:py-28 bg-transparent relative overflow-hidden" dir="rtl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[220px]" style={{ background: 'hsla(37, 48%, 48%, 0.03)' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-label"
            >
              لماذا نحن
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.12 }}
              className="section-title-editorial text-3xl md:text-5xl mb-4 font-almarai-extra-bold"
            >
              ما يميز{" "}
              <span className="text-metallic-gradient">Nine1Luxury</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.12 }}
              className="section-subtitle"
            >
              نلتزم بأعلى معايير الجودة والخدمة لتجربة تسوق لا تُنسى
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-7xl mx-auto">
            {whyUs.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
                className="glass-card-premium rounded-2xl p-6 md:p-8 text-center space-y-4 group"
              >
                {/* 3D Icon Container */}
                <div className="relative w-16 h-16 md:w-18 md:h-18 mx-auto mb-2">
                  {/* Background glow ring */}
                  <div className="absolute inset-0 rounded-2xl bg-gold-500/[0.05] group-hover:bg-gold-500/[0.15] transition-all duration-700 blur-sm scale-125" />
                  <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center group-hover:bg-gold-500 transition-all duration-500 group-hover:shadow-[0_0_30px_hsla(37,48%,48%,0.35)] group-hover:scale-110 border border-gold-500/[0.08] group-hover:border-gold-500/40`}>
                    <item.icon className="w-7 h-7 md:w-8 md:h-8 text-gold-500 group-hover:text-rich-black transition-colors duration-300" />
                  </div>
                </div>
                <h4 className="text-lg md:text-xl font-bold text-ivory group-hover:text-gold-300 transition-colors font-playfair">{item.title}</h4>
                <p className="text-ivory/70 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Testimonials */}
      <Testimonials />

      {/* ═══ CTA Section — Cinematic ═══ */}
      <section className="py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, hsla(37, 48%, 48%, 0.04), hsla(37, 48%, 48%, 0.02), transparent)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[180px]" style={{ background: 'hsla(37, 48%, 48%, 0.04)' }} />
        {/* Decorative lines */}
        <motion.div
          className="absolute top-1/4 left-0 w-full h-px"
          style={{ background: 'linear-gradient(to right, transparent, hsla(37, 48%, 48%, 0.06), transparent)' }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
          >
            {/* Decorative crown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.15, delay: 0.05 }}
              className="flex justify-center mb-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold-500/[0.06] border border-gold-500/10 flex items-center justify-center">
                <Crown className="w-7 h-7 text-gold-500/60" />
              </div>
            </motion.div>

            <h2 className="text-3xl md:text-6xl font-bold text-ivory mb-6 leading-tight font-almarai-extra-bold-straight">
              جاهز لإضافة لمسة من <span className="text-metallic-gradient">الرفاهية</span>
            </h2>
            <p className="text-ivory/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              اكتشف مجموعتنا الحصرية واحصل على إطلالة تعكس ثقتك وتميزك
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/booking" className="btn-primary text-lg">
                احجز منتجك الآن
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


    </main>
  );
}
