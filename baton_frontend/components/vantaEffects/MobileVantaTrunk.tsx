// components/vantaEffects/WithMobileVantaTrunk.tsx
"use client";

import { useEffect, useState } from "react";
import VantaTrunkBackground from "@/components/vantaEffects/VantaTrunk";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null); // null avoids SSR mismatch
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function WithMobileVantaTrunk({
  children,
}: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Don’t render Vanta until we know; or pass undefined then let effect rebuild once known
  const size = isMobile === null ? undefined : (isMobile ? 0.05 : undefined);
  // ↑ example: spacing=2.0 on mobile, default on larger screens

  return <VantaTrunkBackground size={size}>{children}</VantaTrunkBackground>;
}
