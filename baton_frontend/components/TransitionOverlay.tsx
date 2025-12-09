"use client"

import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "./Logo";

type Props = {
    active: boolean;
}

export default function TransitionOverlay({ active }: Props) {
    return (
        <AnimatePresence>
            {active && (
                <motion.div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
                initial={{ y: "100%" }}   // start off-screen at the bottom
                animate={{ y: 0 }}        // slide into the center
                exit={{ y: "-100%" }}     // slide off-screen at the top
                transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1], // nice “easeOutExpo-ish” curve
                }}
                >
                    <LogoMark className="h-50 w-50"/>
                </motion.div>
            )}
        </AnimatePresence>
    )
}