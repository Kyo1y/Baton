"use client"

import React, { useState, useEffect, useRef, PropsWithChildren } from "react";
import * as THREE from "three";
import BIRDS from "vanta/dist/vanta.birds.min";

export default function VantaBirdsBackground({ children }: PropsWithChildren) {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
        const effect = BIRDS({
            el: vantaRef.current!,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,

            backgroundAlpha: 0.0,
            color1: 0xf8831e,
            color2: 0x4e4e4e,
            quantity: 3.0
        });
        setVantaEffect(effect);
    }
    return () => {
      vantaEffect?.destroy?.();
    };
  }, [vantaEffect]);

  return (
    <>
      {/* Single global background layer */}
      <div
        ref={vantaRef}
        className="fixed inset-0 z-1 pointer-events-none"
      />
      {children}
    </>
  );
};

