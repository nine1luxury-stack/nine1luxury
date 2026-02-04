"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          {/* Main Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 1, 
              ease: "easeOut"
            }}
            className="relative w-48 h-48 md:w-64 md:h-64"
          >
            <Image
              src="/logo-main.png"
              alt="Nine1Luxury"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Shimmer text under logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gold-500 tracking-[0.3em] uppercase">
              Nine1Luxury
            </h2>
            <div className="mt-2 h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
            <p className="mt-4 text-gray-500 text-xs tracking-[0.2em] font-light">
              MAKE U FEEL LUXURY
            </p>
          </motion.div>

          {/* Luxury loading bar */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-white/5 overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "linear" 
              }}
              className="w-full h-full bg-gold-500 shadow-[0_0_10px_#ae8439]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
