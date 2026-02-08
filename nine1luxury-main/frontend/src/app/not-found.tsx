"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rich-black text-white px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gold-500/5 backdrop-blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03] flex items-center justify-center">
        <span className="text-[30vw] font-playfair font-bold whitespace-nowrap">
          404
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-9xl font-playfair font-bold text-gold-500 mb-2 opacity-90 drop-shadow-2xl">
          404
        </h1>

        <h2 className="text-3xl md:text-5xl font-amiri font-bold text-white mb-6">
          الصفحة غير موجودة
        </h2>

        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-lg font-amiri leading-relaxed">
          عذراً، يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو أنها لم
          تكن موجودة أصلاً.
        </p>

        <Link
          href="/"
          className="group flex items-center gap-3 px-8 py-4 bg-gold-500 text-rich-black font-bold text-lg rounded-full hover:bg-gold-400 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
        >
          <span className="font-amiri">العودة للرئيسية</span>
          <MoveLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
