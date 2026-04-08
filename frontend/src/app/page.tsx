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

      {/* Offers Section */}
      <section className="py-20 md:py-28 bg-rich-black overflow-hidden relative" dir="rtl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[150px] -z-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-14 gap-6">
            <div className="text-right">
              <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-[10px] uppercase text-gold-500 font-bold mb-3 tracking-[0.4em]"
              >
                  فرص حصرية
              </motion.h2>
              <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-5xl font-playfair font-bold text-white uppercase tracking-wide"
              >
                  أحدث العروض
              </motion.h3>
            </div>
            <Link href="/offers" className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white font-bold hover:bg-gold-500 hover:text-rich-black transition-all duration-300 hover:border-gold-500 text-sm hover:shadow-[0_0_20px_rgba(174,132,57,0.3)]">
              عرض جميع العروض
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
              </div>
            ) : offers.length > 0 ? (
              offers.map((offer, idx) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative h-52 rounded-2xl overflow-hidden glass-card hover:border-gold-500/30 transition-all duration-500 luxury-shadow"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="relative h-full p-8 flex flex-col justify-center items-center text-center">
                    <h4 className="text-2xl font-bold text-white mb-5 font-playfair group-hover:text-gold-300 transition-colors duration-300">{offer.title}</h4>
                    <Link
                      href={`/products?category=${encodeURIComponent(offer.link)}`}
                      className="flex items-center gap-2 text-gold-500 text-xs font-bold uppercase tracking-[0.2em] hover:text-white transition-all border border-gold-500/20 px-5 py-2.5 rounded-full hover:bg-gold-500/10 hover:border-gold-500/40"
                    >
                      تسوق القسم
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                لا توجد عروض نشطة حالياً
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Featured Section */}
      <section className="pt-16 pb-28 bg-rich-black relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.015] flex items-center justify-center">
          <span className="text-[20vw] font-playfair font-bold whitespace-nowrap">NINE 1 LUXURY</span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] uppercase text-gold-500 font-bold mb-4 tracking-[0.4em]"
            >
              إصدارات مختارة
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-6xl font-playfair font-bold text-white mb-6 uppercase tracking-wide drop-shadow-2xl"
            >
              المجموعة المميزة
            </motion.h3>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-8"
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
                  staggerChildren: 0.08
                }
              }
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
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
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-10 py-4 border border-gold-500/30 text-gold-300 font-bold uppercase hover:bg-gold-500 hover:text-rich-black hover:border-gold-500 transition-all duration-300 rounded-full text-sm tracking-widest hover:shadow-[0_0_25px_rgba(174,132,57,0.3)]"
            >
              <ShoppingBag className="w-4 h-4" />
              عرض جميع المنتجات
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-rich-black relative overflow-hidden" dir="rtl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/3 rounded-full blur-[200px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] uppercase text-gold-500 font-bold mb-4 tracking-[0.4em]"
            >
              لماذا نحن
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl md:mb-10 font-playfair font-bold text-white uppercase tracking-wide drop-shadow-2xl"
            >
              ما يميز Nine1Luxury
            </motion.h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {whyUs.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-6 md:p-8 text-center space-y-4 group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-2 rounded-2xl bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(174,132,57,0.4)] group-hover:scale-110">
                  <item.icon className="w-8 h-8 md:w-10 md:h-10 text-gold-500 group-hover:text-rich-black transition-colors duration-300" />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white group-hover:text-gold-300 transition-colors font-playfair">{item.title}</h4>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-gold-500/3 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/5 rounded-full blur-[150px]" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight font-playfair">
              جاهز لإضافة لمسة من <span className="text-gold-gradient">الرفاهية</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              اكتشف مجموعتنا الحصرية واحصل على إطلالة تعكس ثقتك وتميزك
            </p>
            <Link
              href="/products"
              className="inline-block px-12 py-5 bg-gold-500 text-rich-black font-bold text-lg uppercase hover:bg-gold-400 transition-all duration-300 rounded-full shadow-[0_0_30px_rgba(174,132,57,0.4)] hover:shadow-[0_0_50px_rgba(174,132,57,0.6)] hover:scale-105"
            >
              احجز منتجك الآن
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
