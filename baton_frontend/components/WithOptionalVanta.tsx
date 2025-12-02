"use client"

import { usePathname } from "next/navigation";
import VantaBirdsBackground from "./vantaEffects/VantaBirds";

export default function WithOptionalVanta({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideVanta = pathname.startsWith("/transfer") || pathname.startsWith("/dashboard");
  return (
    <>
      {!hideVanta ? 
        <VantaBirdsBackground children={children} />
        : 
        children
        }
      
    </>
  );
}