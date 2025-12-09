"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import TransitionOverlay from "./TransitionOverlay";

type TransitionContextValue = {
    startTransition: (href: string) => void;
    isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
    const ctx = useContext(TransitionContext);
    if (!ctx) {
        throw new Error("usePageTransition must be used within TransitionProvider");
    }
    return ctx;
}

const ANIM_DURATION = 700;

export function TransitionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);

    const startTransition = useCallback(
        (href: string) => {
            if (isTransitioning) return;
            setIsTransitioning(true);
            document.body.classList.add("is-transitioning");
            window.dispatchEvent(new CustomEvent("PAGE TRANSITION START"));

            window.setTimeout(() => {
                router.push(href);
            }, ANIM_DURATION * 0.2);

            window.setTimeout(() => {
                setIsTransitioning(false);
                document.body.classList.remove("is-transitioning");
                window.dispatchEvent(new CustomEvent("PAGE TRANSITION END"));
            }, ANIM_DURATION * 1.2);
        },
        [router, isTransitioning]
    )

    return (
        <TransitionContext.Provider value={{ startTransition, isTransitioning }}>
            {children}
            <TransitionOverlay active={isTransitioning} />
        </TransitionContext.Provider>
    )
}