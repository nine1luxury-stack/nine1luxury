"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-rich-black">
            <div className="relative flex flex-col items-center">
                {/* Logo Animation */}


                {/* Loading Spinner */}
                <div className="relative w-16 h-16">
                    <motion.div
                        className="absolute inset-0 border-2 border-gold-500/20 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <motion.div
                        className="absolute inset-0 border-t-2 border-gold-500 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-2 border-b-2 border-gold-300 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>
        </div>
    );
}
