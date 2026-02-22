"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function DemoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-6">
      
      <div className="relative w-full max-w-4xl overflow-hidden rounded-xl border bg-muted shadow-lg z-10">
        <video
          ref={videoRef}
          className="w-full h-auto"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex items-center gap-4 z-10">
        <Button 
          variant="outline" 
          onClick={handleRestart}
          className="gap-2 z-10 cursor-pointer !bg-[#151515] group"
          onMouseEnter={() => setIsSpinning(true)}
        >
          <RotateCcw 
          onTransitionEnd={() => setIsSpinning(false)}
          className={`w-4 h-4 ${
              isSpinning 
                ? "transition-transform duration-700 ease-in-out -rotate-[720deg]" 
                : "rotate-0"
            }`}
          />
          Restart Demo
        </Button>

        <Button asChild className="group bg-[#F8831E] hover:bg-[#FF8E2C] gap-1 z-10">
            <Link href="/transfer">
                Start Transfer
                <span
                    aria-hidden="true"
                    className="ml-1 inline-block transition-transform group-hover:translate-x-1"
                >
                    →
                </span>
            </Link>
        </Button>
      </div>
    </div>
  );
}