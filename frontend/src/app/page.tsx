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
import { ShoppingBag, ArrowLeft, Loader2, Truck, Shield, Headphones, Sparkles } from "lucide-react";

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
    { icon: Sparkles, title: "جودة فائقة", desc: "أجود الخامات المستوردة لضمان منتجات تدوم طويلاً" },
    { icon: Truck, title: "توصيل مجاني", desc: "شحن مجاني لكل مكان في مصر بمناسبة الافتتاح" },
    { icon: Shield, title: "ضمان الجودة", desc: "استبدال واسترجاع خلال 14 يوم من الاستلام" },
    { icon: Headphones, title: "دعم متواصل", desc: "فريق خدمة العملاء متاح على مدار الساعة" },
  ];

  return (
    <main className="min-h-screen bg-rich-black">
      <Header />
      <Hero />

      {/* ═══ Offers Section ═══ */}
      <section className="py-20 md:py-28 bg-rich-black overflow-hidden relative" dir="rtl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[180px] -z-10" style={{ background: 'hsla(37, 48%, 48%, 0.04)' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-14 gap-6">
            <div className="text-right">
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
                transition={{ delay: 0.1 }}
                className="section-title text-3xl md:text-5xl"
              >
                أحدث العروض
              </motion.h2>
            </div>
            <Link href="/offers" className="px-7 py-2.5 bg-white/[0.03] border border-ivory/[0.08] rounded-full text-ivory/70 font-bold hover:bg-gold-500 hover:text-rich-black transition-all duration-400 hover:border-gold-500 text-sm hover:shadow-[0_8px_24px_hsla(37,48%,48%,0.2)]">
              عرض جميع العروض
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-7 h-7 text-gold-500 animate-spin" />
              </div>
            ) : offers.length > 0 ? (
              offers.map((offer, idx) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative h-48 rounded-2xl overflow-hidden glass-card luxury-shadow"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/[0.08] via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="relative h-full p-7 flex flex-col justify-center items-center text-center">
                    <h4 className="text-xl font-bold text-ivory mb-5 font-playfair group-hover:text-gold-300 transition-colors duration-300">{offer.title}</h4>
                    <Link
                      href={`/products?category=${encodeURIComponent(offer.link)}`}
                      className="flex items-center gap-2 text-gold-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-ivory transition-all border border-gold-500/15 px-5 py-2 rounded-full hover:bg-gold-500/[0.08] hover:border-gold-500/30"
                    >
                      تسوق القسم
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-ivory/25">
                لا توجد عروض نشطة حالياً
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ Featured Products ═══ */}
      <section className="pt-16 pb-28 bg-rich-black relative">
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
              transition={{ delay: 0.1 }}
              className="section-title text-3xl md:text-6xl mb-6"
            >
              المجموعة المميزة
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              className="h-px w-20 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mb-8"
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
                  staggerChildren: 0.07
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

      {/* ═══ Why Choose Us ═══ */}
      <section className="py-20 md:py-28 bg-rich-black relative overflow-hidden" dir="rtl">
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
              transition={{ delay: 0.1 }}
              className="section-title text-3xl md:text-5xl"
            >
              ما يميز Nine1Luxury
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-7xl mx-auto">
            {whyUs.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="glass-card rounded-2xl p-6 md:p-8 text-center space-y-4 group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 rounded-2xl bg-gold-500/[0.07] flex items-center justify-center group-hover:bg-gold-500 transition-all duration-500 group-hover:shadow-[0_0_24px_hsla(37,48%,48%,0.3)] group-hover:scale-105">
                  <item.icon className="w-7 h-7 md:w-8 md:h-8 text-gold-500 group-hover:text-rich-black transition-colors duration-300" />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-ivory group-hover:text-gold-300 transition-colors font-playfair">{item.title}</h4>
                <p className="text-ivory/30 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Testimonials */}
      <Testimonials />

      {/* ═══ CTA Section ═══ */}
      <section className="py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, hsla(37, 48%, 48%, 0.04), hsla(37, 48%, 48%, 0.02), transparent)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[180px]" style={{ background: 'hsla(37, 48%, 48%, 0.04)' }} />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-6xl font-bold text-ivory mb-6 leading-tight font-playfair">
              جاهز لإضافة لمسة من <span className="text-gold-gradient">الرفاهية</span>
            </h2>
            <p className="text-ivory/30 text-lg mb-10 max-w-xl mx-auto">
              اكتشف مجموعتنا الحصرية واحصل على إطلالة تعكس ثقتك وتميزك
            </p>
            <Link href="/products" className="btn-primary text-lg">
              احجز منتجك الآن
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
