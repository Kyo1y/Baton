"use client";

import { useEffect, useRef } from "react";

export default function VantaTopologyBackground({ children }: { children: React.ReactNode, }) {
    const ref = useRef<HTMLDivElement | null>(null);
   
    useEffect(() => {
      let effect: any;
      let mounted = true;

      (async () => {
        if (!ref.current) return;

        // Dynamic imports so it only runs on the client
        const [p5Mod, topologyMod] = await Promise.all([
          import("p5"),
          import("vanta/dist/vanta.topology.min"),
        ]);

        const P5 = (p5Mod as any).default ?? p5Mod;
        const TOPOLOGY = (topologyMod as any).default ?? topologyMod;

        // Some Vanta builds also read from window.p5 — provide it
        (window as any).p5 = P5;

        if (!mounted || typeof TOPOLOGY !== "function") return;

        effect = TOPOLOGY({
          el: ref.current,
          p5: P5,
          color: 0xf8831e,
          backgroundColor: 0xffffff,
        });
      })();

      return () => {
        mounted = false;
        effect?.destroy?.();
      };
    }, []);

    return (
      <>
        <div ref={ref} className="fixed inset-0 z-1 pointer-events-none" />
        {children}
      </>
    );
}
