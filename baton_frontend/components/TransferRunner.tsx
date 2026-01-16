"use client";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { finalizeTransfer } from "@/app/(actions)/finalizeTransfer";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type Props = { transferDraftId: string;  dest: string; userId: string };

export default function TransferRunner({ transferDraftId, dest, userId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"running"|"success"|"partial"|"failed">("running");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ source: string; dest: string; added: number; unmatched: number, copies: number, destPlaylistName: string | null, srcPlaylistName: string } | null>(null);

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
      catch (e: unknown) {
        if (cancelled) return;
        if (e instanceof Error) {
          setError(e.message);
        }
        else {
          setError("Transfer failed.");
        }
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

    if (searchParams.get("completion") === "failed") return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("completion", "failed");

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
    </div>
  );
}
