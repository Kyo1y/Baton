"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Check, X } from "lucide-react";
import clsx from "clsx";

const STEPS = [
  "Choose Source",
  "Choose Destination",
  "Choose Content",
  "Result",
];

function computeInternalStep(pathname: string): number {
  const segments = pathname.split("/").filter(Boolean);
  const depth = segments.length - 1;
  return Math.min(Math.max(depth + 1, 1), 5);
}

function toVisibleStep(internalStep: number): number {
  return Math.min(internalStep, STEPS.length);
}


type StepState = "completed" | "active" | "upcoming";
type ResultStatus = "success" | "partial" | "failed" | null;

function StepIcon({
  stepNum,
  state,
  isResultStep,
  resultStatus,
}: {
  stepNum: number;
  state: StepState;
  isResultStep: boolean;
  resultStatus: ResultStatus;
}) {
  if (isResultStep && state !== "upcoming") {
    if (resultStatus === "failed") {
      return <X className="size-4" />;
    }
    return <Check className="size-4" />;
  }

  if (state === "completed") {
    return <Check className="size-4" />;
  }

  return <>{stepNum}</>;
}

function StepBadge({
  stepNum,
  label,
  state,
  isResultStep,
  resultStatus,
  showLabel,
}: {
  stepNum: number;
  label: string;
  state: StepState;
  isResultStep: boolean;
  resultStatus: ResultStatus;
  showLabel: boolean;
}) {
  const isFailed = isResultStep && resultStatus === "failed";

  return (
    <div className="flex items-center gap-3">
      <span
        className={clsx(
          "inline-flex size-8 items-center justify-center rounded-full border text-sm font-medium",
          state === "completed" &&
          !isFailed &&
          "bg-[#F8831E] text-white border-[#F8831E]",
          state === "active" &&
          !isFailed &&
          "text-[#F8831E] border-[#F8831E] bg-white",
          isFailed &&
          "text-[#FF4242] border-[#FF4242] bg-white",
          state === "upcoming" &&
          "text-muted-foreground border-border bg-white",
        )}
      >
        <StepIcon
          stepNum={stepNum}
          state={state}
          isResultStep={isResultStep}
          resultStatus={resultStatus}
        />
      </span>

      {showLabel && (
        <span
          className={clsx(
            "text-sm font-semibold",
            state === "active"
              ? "font-bold text-[#F8831E]"
              : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}


export default function TransferStepper({ override }: { override?: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const internalStep = override ?? computeInternalStep(pathname);
  const visibleStep = toVisibleStep(internalStep);

  const resultStatus: ResultStatus =
    internalStep >= 4
      ? (searchParams.get("status") as ResultStatus) ?? null
      : null;

  const stepStates: StepState[] = STEPS.map((_, idx) => {
    const stepNum = idx + 1;
    if (stepNum < visibleStep) return "completed";
    if (stepNum === visibleStep) return "active";
    return "upcoming";
  });

  return (
    <nav className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 lg:py-12 py-4">
      {/* ── Desktop ── */}
      <ol className="hidden lg:flex flex-wrap items-center gap-4">
        {STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          const isResultStep = stepNum === STEPS.length;
          return (
            <li key={label} className="flex items-center">
              <StepBadge
                stepNum={stepNum}
                label={label}
                state={stepStates[idx]}
                isResultStep={isResultStep}
                resultStatus={resultStatus}
                showLabel
              />
              {!isResultStep && (
                <span className="mx-4 h-px w-10 sm:w-16 bg-border" />
              )}
            </li>
          );
        })}
      </ol>

      {/* ── Mobile: only the active step ── */}
      <div className="lg:hidden flex items-center justify-center">
        {STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          if (stepStates[idx] !== "active") return null;
          return (
            <div key={label} className="flex items-center">
              <span className="mx-4 h-px w-5 sm:w-16 bg-border" />
              <StepBadge
                stepNum={stepNum}
                label={label}
                state="active"
                isResultStep={stepNum === STEPS.length}
                resultStatus={resultStatus}
                showLabel={false}
              />
              <span className="mx-4 h-px w-5 sm:w-16 bg-border" />
            </div>
          );
        })}
      </div>
    </nav>
  );
}
