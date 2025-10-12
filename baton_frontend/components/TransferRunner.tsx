"use client";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { finalizeTransfer } from "@/app/(actions)/finalizeTransfer"; // returns {status, added, unmatched, ...}
import { useRouter } from "next/navigation";
import type { TransferDraft } from "@prisma/client";
import { useState, useEffect } from "react";
import { useSessionStorage } from "@/lib/useSessionStorage";
import type { Playlist } from "@/integrations/types";

type Props = { transferDraft: TransferDraft; source: string; dest: string; userId: string };

export default function TransferRunner({ transferDraft, source, dest, userId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"running"|"success"|"partial"|"failed">("running");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ added: number; unmatched: number, copies: number, destPlaylistName: string, srcPlaylistName: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatus("running");
        const res = await finalizeTransfer(transferDraft);
        if (cancelled) return;
        setResult({ added: res.added, unmatched: res.failed, copies: res.copies, destPlaylistName: res.destPlaylistName, srcPlaylistName: res.srcPlaylistName});
        setStatus(res.failed ? "partial" : "success");
        sessionStorage.removeItem(`draft:${userId}:${dest}`);
      }
      catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? "Transfer failed.");
        setStatus("failed");
        sessionStorage.removeItem(`draft:${userId}:${dest}`);
        
      }
    })();
    return () => { cancelled = true; };
  }, [transferDraft]);

  const showOverlay = status === "running";

  return (
    <div className="mx-auto max-w-xl p-6">
      {showOverlay && <ProcessingOverlay />}
      {!showOverlay && status === "success" && (
        <SuccessView source={source} dest={dest} result={result!} />
      )}
      {!showOverlay && status === "partial" && (
        <SuccessView source={source} dest={dest} result={result!} note="Some tracks couldn't be matched." />
      )}
      {!showOverlay && status === "failed" && (
        <ErrorView message={error ?? "Something went wrong."} onBack={() => router.push(`/transfer/${source}/${dest}`)} />
      )}
    </div>
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
      <h2>{result.srcPlaylistName} → {result.srcPlaylistName}</h2>
      <p className="mt-4">Added {result.added} tracks. Unmatched: {result.unmatched}. Copies avoided: {result.copies}</p>
      <a className="mt-4 inline-block underline" href={`/transfer/${source}/${dest}`}>Start another</a>
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
