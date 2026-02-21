"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightToLine, TrendingUpDown, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Transfer Finished`, 
    };
}

type Payload = {
    status: "success" | "partial" | "failed",
    error?: string | null,
    result?: { 
        source: string,
        dest: string,
        added: number,
        unmatched: number, 
        copies: number, 
        destPlaylistName: string, 
        srcPlaylistName: string,
    } | null,
};

export default function ResultPage() {
    const searchParams = useSearchParams();
    const status = (searchParams.get("status") ?? "failed") as Payload["status"];
    const [payload, setPayload] = useState<Payload | null>(null);
    const router = useRouter();

    useEffect(() => {
        const transferData = sessionStorage.getItem("transfer:result:last");
        if (transferData) setPayload(JSON.parse(transferData));
    }, []);

    if (!payload) return <div className="p-6">Finishing up…</div>;

  if (status === "failed") {
    return (
      <ErrorView message={payload.error ?? "Something went wrong."}  onBack={() => router.push(`/transfer`)} />
    );
  }

  const note = status === "partial" ? "Some tracks couldn't be matched." : undefined;
  return (
    <SuccessView
      source={payload.result!.source}
      dest={payload.result!.dest}
      result={payload.result!}
      note={note}
    />
  );
}

function SuccessView({ source, dest, result, note }: { 
  source: string; dest: string; 
  result: { added: number; unmatched: number, copies: number, destPlaylistName: string, srcPlaylistName: string }; 
  note?: string 
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col dark:bg-black bg-white rounded-lg w-50% z-10 p-5 border-1 border-[#F8831E]">
        <h1 className="text-3xl font-bold text-[#43B929]">Transfer complete</h1>
        {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
        <div className="flex items-center gap-0.5">
          <div className="flex items-center gap-0.5">
            <div className="border-1 rounded-lg p-1">
              <Image
              src={source === "ytmusic" ? `/logos/youtube-music.svg` : `/logos/${source}.svg`}
              alt={source}
              width={25}
              height={25}
              />
            </div>
            <h2 className="text-2xl">{result.srcPlaylistName}</h2>
          </div>
          <h2 className="text-2xl ">→</h2>
          <div className="flex items-center gap-0.5">
            <div className="border-1 rounded-lg p-1">
              <Image
              src={dest === "ytmusic" ? `/logos/youtube-music.svg` : `/logos/${source}.svg`}
              alt={dest}
              width={25}
              height={25}
              />
            </div>
              <h2 className="text-2xl">{result.destPlaylistName}</h2>
          </div>
        </div>
        <p className="mt-4 flex gap-0.5 text-xl items-center">
          <Check color="#43B929"/>
          Added {result.added} tracks
          </p>
        <p className="mt-4 flex gap-0.5 text-xl items-center">
          <TrendingUpDown color="#FF4242"/>
          Unmatched: {result.unmatched}
        </p>
        <p className="mt-4 flex gap-0.5 text-xl items-center">
          <ArrowRightToLine color="#6e6e6e"/>
          Copies avoided: {result.copies}
        </p>
        <Button asChild className="mt-4 group bg-[#F8831E] hover:bg-[#FF8E2C] gap-1">
            <Link href="/transfer">
                Start Another
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

function ErrorView({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold">Transfer failed</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <button onClick={onBack} className="mt-4 underline">Go back</button>
    </div>
  );
}
