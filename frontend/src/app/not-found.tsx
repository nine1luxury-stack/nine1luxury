"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rich-black text-white px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[200px]" />
      </div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03] flex items-center justify-center">
        <span className="text-[30vw] font-playfair font-bold whitespace-nowrap">
          404
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
          className="text-8xl md:text-9xl font-playfair font-bold mb-2 drop-shadow-2xl"
        >
          <span className="text-gold-gradient">404</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-4xl font-amiri font-bold text-white mb-6"
        >
          الصفحة غير موجودة
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-base md:text-lg mb-12 max-w-lg font-amiri leading-relaxed"
        >
          عذراً، يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو أنها لم
          تكن موجودة أصلاً.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="group flex items-center gap-3 px-10 py-4 bg-gold-500 text-rich-black font-bold text-lg rounded-full hover:bg-gold-400 transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(174,132,57,0.3)] hover:shadow-[0_0_50px_rgba(174,132,57,0.5)]"
          >
            <span className="font-amiri">العودة للرئيسية</span>
            <MoveLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
