"use client";
import Image from "next/image";
import * as React from "react";

export default function ProcessingOverlay({
  show = true,
  gifSrc = "/baton_loading.gif",
  progress,
  note = "Please do not reload",
}: {
  show?: boolean;
  gifSrc?: string;
  progress?: number;
  note?: string;
}) {
  if (!show) return null;

  const determinate = typeof progress === "number" && progress >= 0 && progress <= 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      <div className="relative z-10 flex w-[min(90vw,28rem)] flex-col items-center gap-4 rounded-2xl border bg-card p-6 shadow-xl">
        <Image
          src={gifSrc}
          alt="Processing"
          width={128}
          height={128}
          className="h-full w-full object-contain"
          unoptimized
          priority
        />

        {determinate ? (
          <div className="w-full">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1 text-center text-xs text-muted-foreground">{progress}%</div>
          </div>
        ) : (
          <div className="w-full">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="absolute bg-[#F8831E] left-0 top-0 h-full w-1/3 rounded-full animate-slide" />
            </div>
          </div>
        )}

        <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wide">{note}</p>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(300%); }
        }
        .animate-slide { animation: slide 1.1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
