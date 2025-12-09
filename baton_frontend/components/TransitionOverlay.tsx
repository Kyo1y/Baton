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
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                }}
                >
                    <LogoMark className="h-50 w-50"/>
                </motion.div>
            )}
        </AnimatePresence>
    )
}