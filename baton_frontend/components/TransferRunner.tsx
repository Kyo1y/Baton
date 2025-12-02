"use client";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { finalizeTransfer } from "@/app/(actions)/finalizeTransfer";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type Props = { transferDraftId: string; source: string; dest: string; userId: string };

export default function TransferRunner({ transferDraftId, source, dest, userId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"running"|"success"|"partial"|"failed">("running");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ source: string; dest: string; added: number; unmatched: number, copies: number, destPlaylistName: string, srcPlaylistName: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatus("running");
        const res = await finalizeTransfer(transferDraftId);
        if (!res) {
          setStatus("failed");
          return;
        }
        if (cancelled) return;
        setResult({ source: res.source, dest:res.dest, added: res.added, unmatched: res.failed, copies: res.copies, destPlaylistName: res.destPlaylistName, srcPlaylistName: res.srcPlaylistName});
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
  }, [transferDraftId]);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status !== "failed") return;

    // avoid loops if it's already present
    if (searchParams.get("completion") === "failed") return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("completion", "failed");

    // replace so you don't stack history entries
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [status, pathname, searchParams, router]);

  useEffect(() => {
    if (status === "running") return;

    sessionStorage.setItem(
      "transfer:result:last",
      JSON.stringify({ status, error, result })
    )
    router.replace(`${pathname}/result?status=${status}`, { scroll: false })
  }, [status, error, result, pathname, router]);


  const showOverlay = status === "running";

  return (
    <div className="mx-auto max-w-xl p-6">
      {showOverlay && <ProcessingOverlay />}
      {/* {!showOverlay && status === "success" && (
        <SuccessView source={result!.destPlaylistName} dest={result!.srcPlaylistName} result={result!} />
      )}
      {!showOverlay && status === "partial" && (
        <SuccessView source={result!.destPlaylistName} dest={result!.srcPlaylistName} result={result!} note="Some tracks couldn't be matched." />
      )}
      {!showOverlay && status === "failed" && (
        <ErrorView message={error ?? "Something went wrong."} onBack={() => router.push(`/transfer/${source}/${dest}`)} />
      )} */}
    </div>
  );
}
