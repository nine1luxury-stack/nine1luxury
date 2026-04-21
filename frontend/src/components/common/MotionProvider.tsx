"use client";

import { MotionConfig } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
    return (
        <MotionConfig
            transition={{
                duration: 0.08,
                ease: "easeOut",
            }}
            reducedMotion="user"
        >
            {children}
        </MotionConfig>
    );
}
