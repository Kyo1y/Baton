"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div>
      <h1 className="text-2xl font-semibold">Transfer complete</h1>
      {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
      <h2>{result.srcPlaylistName} → {result.destPlaylistName}</h2>
      <div className="flex items-center">
        <div className="">
            <Image
            src={`/logos/${source}.svg`}
            alt={source}
            width={25}
            height={25}
            />
        </div>
        <h2>→</h2>
        <div>
            <Image
            src={`/logos/${dest}.svg`}
            alt={dest}
            width={25}
            height={25}
            />
        </div>
      </div>
      <p className="mt-4">Added {result.added} tracks. Unmatched: {result.unmatched}. Copies avoided: {result.copies}</p>
      <a className="mt-4 inline-block underline" href={`/transfer`}>Start another</a>
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
