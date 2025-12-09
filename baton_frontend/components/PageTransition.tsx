"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TransitionOverlay from "@/components/TransitionOverlay";

type Props = {
  children: React.ReactNode;
};

export default function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!pathname) return;

    setIsTransitioning(true);
    document.body.classList.add("is-transitioning");

    const timeout = setTimeout(() => {
      setIsTransitioning(false);
      document.body.classList.remove("is-transitioning");
    }, 900);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {children}

      <TransitionOverlay active={isTransitioning} />
    </>
  );
}
