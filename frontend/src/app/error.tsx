"use client";

import { useEffect } from "react";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Server Error Caught:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-rich-black text-ivory p-4" dir="rtl">
            <div className="glass-card-premium p-10 rounded-3xl max-w-lg text-center shadow-2xl border border-red-500/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
                
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                
                <h2 className="text-2xl font-bold font-almarai-extra-bold text-white mb-4">
                    عذراً، حدث خطأ في الخادم (Server Error)
                </h2>
                
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    يبدو أن هناك مشكلة في الاتصال بقاعدة البيانات أو أن بعض البيانات غير متوفرة.
                    <br />
                    <span className="text-xs text-red-400 mt-2 block">
                        تفاصيل الخطأ: {error.message || "خطأ داخلي في الخادم"}
                    </span>
                    {error.digest && (
                        <span className="text-xs text-gray-500 block mt-1 font-mono">
                            Digest: {error.digest}
                        </span>
                    )}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors font-bold text-sm"
                    >
                        المحاولة مرة أخرى
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-rich-black rounded-xl transition-colors font-bold text-sm flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}
