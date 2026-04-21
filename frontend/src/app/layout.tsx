import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Amiri, Cairo, Almarai } from "next/font/google";
import "@fontsource-variable/playfair-display";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/common/MotionProvider";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

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
  title: "Nine1Luxury | MAKE U FEEL LUXURY",
  description: "متجر ملابس شبابي فاخر - تسوق الآن أرقى الموديلات",
  keywords: ["luxury", "clothing", "nine1luxury", "ملابس شباب", "فاشن", "موضة"],
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
        <style>{`
          body { background-color: #000000 !important; }
        `}</style>
      </head>
      <body className={`${amiri.variable} ${cairo.variable} ${almarai.variable} antialiased min-h-screen selection:bg-gold-500/30 selection:text-gold-300 font-almarai`} suppressHydrationWarning>
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
                  <Analytics />
                  <SpeedInsights />
                </SecurityWrapper>
              </MotionProvider>
            </NotificationProvider>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
