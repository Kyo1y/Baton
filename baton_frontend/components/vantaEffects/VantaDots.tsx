"use client"

import React, { useState, useEffect, useRef, PropsWithChildren } from "react";
import * as THREE from "three";
import { VantaEffect } from "vanta/dist/vanta.dots.min";


export default function VantaDotsBackground({ children }: PropsWithChildren) {
    const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);
    const vantaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (vantaEffect || !vantaRef.current) return;

    // 1) Expose THREE globally for the DOTS effect
    window.THREE = THREE;

    // 2) Import the effect after THREE is on window
    import("vanta/dist/vanta.dots.min").then((mod) => {
      const DOTS = mod.default ?? mod;
      const effect = DOTS({
        el: vantaRef.current!,
        THREE,
        backgroundColor: 0x222222,
        color: 0xf8831e,
        color2: 0xf8831e,
        size: 3,
        spacing: 35,
        showLines: true,
        backgroundAlpha: 0,
      });
      setVantaEffect(effect);
    });
    return () => {
      vantaEffect!.destroy?.();
    };
  }, [vantaEffect]);

  return (
    <>
        <div className="self-center">
            <div
                ref={vantaRef}
                className="fixed inset-0 z-1 pointer-events-none "
            />
            {children}
        </div>
    </>
   
  );
};

