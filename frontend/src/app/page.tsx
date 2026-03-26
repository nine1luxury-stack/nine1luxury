import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/layout/Hero";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const revalidate = 60; // 60 seconds Cache

export default async function Home() {
  // Fetch Featured Products optimized via Prisma directly from DB layer on Server
  const displayProducts = await prisma.product.findMany({
    where: { isActive: true, featured: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
    select: {
      id: true,
      name: true,
      model: true,
      price: true,
      discount: true,
      category: true,
      images: { select: { url: true } },
      variants: { select: { size: true } }
    }
  });

  // Fetch Active Offers directly from DB
  const offers = await (prisma as any).offer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  return (
    <main className="min-h-screen bg-rich-black">
      <Header />
      <Hero />

      {/* Offers Section */}
      <section className="py-24 bg-rich-black overflow-hidden relative" dir="rtl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[150px] -z-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="text-right">
              <h2 className="text-sm uppercase text-gold-500 font-bold mb-3 tracking-widest">فرص حصرية</h2>
              <h3 className="text-4xl md:text-5xl font-playfair font-bold text-white uppercase">أحدث العروض</h3>
            </div>
            <Link href="/offers" className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-gold-500 hover:text-rich-black transition-all hover:border-gold-500 text-sm">
              عرض جميع العروض
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.length > 0 ? (
              offers.map((offer: any) => (
                <div
                  key={offer.id}
                  className="group relative h-48 rounded-2xl overflow-hidden border border-white/5 bg-surface-dark/30 hover:border-gold-500/30 transition-all duration-300 shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent opacity-50" />
                  <div className="relative h-full p-8 flex flex-col justify-center items-center text-center">
                    <h4 className="text-2xl font-bold text-white mb-4 font-playfair group-hover:text-gold-500 transition-colors">{offer.title}</h4>
                    <Link
                      href={`/products?category=${encodeURIComponent(offer.link)}`}
                      className="flex items-center gap-2 text-gold-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors border border-gold-500/20 px-4 py-2 rounded-full hover:bg-gold-500/10"
                    >
                      تسوق القسم
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                لا توجد عروض نشطة حالياً
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="pt-12 pb-24 bg-rich-black relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.02] flex items-center justify-center">
          <span className="text-[20vw] font-playfair font-bold whitespace-nowrap">NINE 1 LUXURY</span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-sm uppercase text-gold-500 font-bold mb-4">
              إصدارات مختارة
            </h2>
            <h3 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6 uppercase">
              المجموعة المميزة
            </h3>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-8" />
            
            <PromoBanner />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-8">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} {...(product as any)} />
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link
              href="/products"
              className="inline-block text-gold-300 font-bold uppercase border-b-2 border-gold-500/30 pb-2 hover:border-gold-500 transition-all"
            >
              عرض جميع المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-500/5 backdrop-blur-3xl" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 leading-tight">
            جاهز لإضافة لمسة من <span className="text-gold-400">الرفاهية</span>
          </h2>
          <Link
            href="/products"
            className="inline-block px-12 py-5 bg-gold-500 text-rich-black font-bold text-lg uppercase hover:bg-gold-400 transition-all rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]"
          >
            احجز منتجك الآن
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

