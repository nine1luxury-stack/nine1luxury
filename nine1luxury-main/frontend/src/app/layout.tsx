import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Amiri } from "next/font/google";
import "@fontsource-variable/playfair-display";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { NotificationProvider } from "@/context/NotificationContext";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nine1Luxury | MAKE U FEEL LUXURY",
  description: "متجر ملابس شبابي فاخر - تسوق الآن أرقى الموديلات",
  keywords: ["luxury", "clothing", "nine1luxury", "ملابس شباب", "فاشن", "موضة"],
  icons: {
    icon: "/app-icon.png",
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
import { SplashScreen } from "@/components/layout/SplashScreen";

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
      <body className={`${amiri.variable} antialiased min-h-screen selection:bg-gold-500/30 selection:text-gold-300`} suppressHydrationWarning>
        <SplashScreen />
        <ProductProvider>
          <CartProvider>
            <NotificationProvider>
              <SecurityWrapper>
                {children}
                <Analytics />
                <SpeedInsights />
              </SecurityWrapper>
            </NotificationProvider>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
