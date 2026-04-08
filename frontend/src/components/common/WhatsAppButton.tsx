"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export function WhatsAppButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="fixed bottom-6 left-6 z-40 flex items-end gap-3">
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.9 }}
                        className="glass-card px-4 py-2.5 rounded-xl text-sm text-white font-bold shadow-xl whitespace-nowrap"
                    >
                        تواصل معنا عبر واتساب 💬
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.a
                href="https://wa.me/201094372339?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA%D9%83%D9%85"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_30px_rgba(37,211,102,0.6)] transition-shadow duration-300"
                aria-label="WhatsApp"
            >
                <MessageCircle className="w-6 h-6 text-white" />
            </motion.a>
        </div>
    );
}
