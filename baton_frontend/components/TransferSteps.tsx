"use client";

import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import clsx from "clsx";

const STEPS = ["Choose Source", "Choose Destination", "Choose Content", "Processing"];

function computeCurrent(pathname: string): number {
  const parts = pathname.split("/").filter(Boolean);
  console.log(parts)
  const i = parts.indexOf("transfer");
  if (i === -1) return 1;
  const depth = parts.length;
  console.log(depth, "depth")
  if (depth > 3) return 4;
  if (depth <= 1) return 1;
  if (depth === 2) return 2;
  if (depth === 3) return 3;
  if (depth >= 4) return 4;
  return 1;
}

export default function TransferStepper({ override }: { override?: number }) {
  const pathname = usePathname();
  const current = override ?? computeCurrent(pathname);
  console.log(current, "current")
  return (
    <nav className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-4">
      <ol className="flex flex-wrap items-center gap-4">
        {STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < current;
          const isActive = stepNum === current;
          return (
            <li key={label} className="flex items-center">
              <div className="flex items-center gap-3">
                <span
                  className={clsx(
                    "inline-flex size-8 items-center justify-center rounded-full border text-sm font-medium",
                    isCompleted &&
                      "bg-[#F8831E] text-white border-[#F8831E]",
                    isActive &&
                      "text-[#F8831E] border-[#F8831E] bg-transparent",
                    !isCompleted && !isActive &&
                      "text-muted-foreground border-border"
                  )}
                >
                  {isCompleted ? <Check className="size-4" /> : stepNum}
                </span>
                <span
                  className={clsx(
                    "text-sm",
                    isActive ? "font-semibold text-[#F8831E]" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>

              {stepNum !== STEPS.length && (
                <span className="mx-4 h-px w-10 sm:w-16 bg-border" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
