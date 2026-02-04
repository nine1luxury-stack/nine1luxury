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

          {/* Staggered Text Animation */}
          <motion.div 
            className="mt-4 flex gap-[0.3em] text-gold-500 font-playfair font-bold text-lg md:text-xl tracking-widest"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  delayChildren: 0.5,
                  staggerChildren: 0.1,
                }
              }
            }}
          >
            {"MAKE U FEEL LUXURY".split("").map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4 }}
                className={char === " " ? "w-2" : ""}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* Luxury Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="mt-6 text-gray-400 text-sm md:text-base font-light tracking-[0.1em] text-center max-w-[80%]"
          >
            وجهتك الأولى لأرقى الموديلات الشبابية العصرية في مصر
          </motion.p>

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
