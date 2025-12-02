// components/vantaEffects/VantaTrunk.tsx
"use client";

import { useEffect, useRef } from "react";

export default function VantaTrunkBackground({ children, size }: { children: React.ReactNode, size?: number }) {
    const ref = useRef<HTMLDivElement | null>(null);
   
    useEffect(() => {
      let effect: any;
      let mounted = true;

      (async () => {
        if (!ref.current) return;

        // Dynamic imports so it only runs on the client
        const [p5Mod, trunkMod] = await Promise.all([
          import("p5"),
          import("../../lib/vendor/vanta.trunk.min.js"),
        ]);

        const P5 = (p5Mod as any).default ?? p5Mod;
        const TRUNK = (trunkMod as any).default ?? trunkMod;

        // Some Vanta builds also read from window.p5 — provide it
        (window as any).p5 = P5;

        if (!mounted || typeof TRUNK !== "function") return;

        effect = TRUNK({
          el: ref.current,
          p5: P5,
          color: 0xf8831e,
          backgroundColor: 0xffffff,
          baseRadius: 100,
          ringGap: 4,
          chaosMag: 12,
          chaosDelta: 0.20,
          chaosInit: 0.7,
          spacing: size ?? 0.1,
          chaos: 1.0,
        });
      })();

      return () => {
        mounted = false;
        effect?.destroy?.();
      };
    }, [size]);

    return (
      <>
        <div ref={ref} className="fixed inset-0 -z-10 pointer-events-none" />
        {children}
      </>
    );
}
