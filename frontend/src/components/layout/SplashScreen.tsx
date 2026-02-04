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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut"
            }}
            className="relative w-64 h-64 md:w-80 md:h-80"
          >
            <Image
              src="/splash-logo.png"
              alt="Nine1Luxury"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Slogan - Forced LTR for English */}
          <motion.div 
            className="mt-4 flex flex-row flex-wrap justify-center gap-x-3 text-gold-500 font-playfair font-bold text-lg md:text-xl"
            style={{ direction: 'ltr' }}
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  delayChildren: 0.1,
                  staggerChildren: 0.02,
                }
              }
            }}
          >
            {"MAKE U FEEL LUXURY".split(" ").map((word, wordIndex) => (
              <span key={wordIndex} className="flex flex-row gap-[0.02em]">
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    variants={{
                      hidden: { opacity: 0, y: -10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.div>

          <motion.div
            className="mt-6 flex flex-row-reverse flex-wrap justify-center gap-x-2 text-gray-400 text-base md:text-xl font-light px-4 text-center"
            style={{ direction: 'rtl' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            وجهتك الأولى لأرقى الموديلات الشبابية العصرية في مصر
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
