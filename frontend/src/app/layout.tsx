import type { Metadata } from "next";
import "./globals.css";
import { Cairo, Almarai } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/common/MotionProvider";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nine1Luxury | ملابس شباب بجودة مش هتلاقيها في أي مكان تاني",
    template: "%s | Nine1Luxury",
  },
  description:
    "Nine1Luxury — لو بتدور على ملابس شباب بجودة عالية وخامات مستوردة، إنت في المكان الصح. عندنا أجدد الموديلات بأسعار تنافسية وضمان استبدال على كل المنتجات. اطلب دلوقتي واحس بالفرق.",
  keywords: [
    // Brand
    "nine1luxury",
    "Nine 1 Luxury",
    "ناين ون لاكشري",
    // Products
    "ملابس شبابية فاخرة",
    "ملابس رجالي فاخرة",
    "ملابس كاجوال فاخرة",
    "هوديز فاخرة",
    "تيشرتات فاخرة",
    "بناطيل كاجوال",
    "سويت شيرتات",
    "ملابس شباب مصر",
    // USPs
    "توصيل سريع مصر",
    "ملابس بخامات مستوردة",
    "ضمان استبدال ملابس",
    "جودة فائقة ملابس",
    "خامات عالية الجودة",
    // Shopping intent
    "تسوق ملابس اونلاين مصر",
    "افضل متجر ملابس شباب",
    "موديلات شبابية 2025",
    "ملابس ستايل",
    "فاشن مصر",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/app-icon.png", type: "image/png" }, // fallback for older browsers
    ],
    shortcut: "/favicon.svg",
    apple: "/app-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nine1Luxury",
  }
};

import { SecurityWrapper } from "@/components/common/SecurityWrapper";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-startup-image" href="/splash-logo.png" />
        <link rel="preconnect" href="https://www.transparenttextures.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <style>{`
          body { background-color: #000000 !important; }
        `}</style>
      </head>
      <body className={`${cairo.variable} ${almarai.variable} antialiased min-h-screen selection:bg-gold-500/30 selection:text-gold-300 font-almarai`} suppressHydrationWarning>
        <ProductProvider>
          <CartProvider>
            <NotificationProvider>
              <MotionProvider>
                <SecurityWrapper>
                  <Header />
                  {children}
                  <Footer />
                  <WhatsAppButton />
                  <ScrollToTop />
                </SecurityWrapper>
              </MotionProvider>
            </NotificationProvider>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
