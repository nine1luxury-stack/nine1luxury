"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/layout/Hero";
import { ProductCard } from "@/components/product/ProductCard";

import Link from "next/link";

import { useProducts } from "@/context/ProductContext";

export default function Home() {
  const { products } = useProducts();

  // Get featured products (e.g. first 3 or explicitly marked featured)
  const activeProducts = products.filter(p => p.isActive !== false);
  const featuredProducts = activeProducts.filter(p => p.featured).slice(0, 3);

  // If no explicit featured products, just take the first 3 recent ones
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : activeProducts.slice(0, 3);



  return (
    <main className="min-h-screen bg-rich-black">
      <Header />
      <Hero />

      {/* Featured Section */}
      <section className="pt-12 pb-24 bg-rich-black relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.02] flex items-center justify-center">
          <span className="text-[20vw] font-playfair font-bold whitespace-nowrap">NINE 1 LUXURY</span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center mb-20 text-center">
            <h2 className="text-sm uppercase tracking-[0.4em] text-gold-500 font-bold mb-4">
              إصدارات مختارة
            </h2>
            <h3 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6 uppercase tracking-wider">
              المجموعة المميزة
            </h3>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link
              href="/products"
              className="inline-block text-gold-300 font-bold tracking-widest uppercase border-b-2 border-gold-500/30 pb-2 hover:border-gold-500 transition-all hover:tracking-[0.2em]"
            >
              عرض جميع المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}


      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-500/5 backdrop-blur-3xl" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 leading-tight">
            جاهز لإضافة لمسة من <span className="text-gold-400">الرفاهية</span>؟
          </h2>
          <Link
            href="/products"
            className="inline-block px-12 py-5 bg-gold-500 text-rich-black font-bold text-lg uppercase tracking-wider hover:bg-gold-400 transition-all rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]"
          >
            احجز منتجك الآن
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
