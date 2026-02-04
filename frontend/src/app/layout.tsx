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
    icon: "/logo-main.png", // Using the main logo as the tab icon
    apple: "/logo-main.png",
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
      <body className={`${amiri.variable} antialiased min-h-screen selection:bg-gold-500/30 selection:text-gold-300`} suppressHydrationWarning>
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
