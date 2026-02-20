"use client"
import { TransferStatus } from "@prisma/client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import { Unlink, Link } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import loadTransfers from "@/app/(actions)/dashboard/loadTransfers";


type Props = {
    services: {
        id: string;
        userId: string;
        image: string | null;
        provider: string;
        createdAt: string;
        username: string;
    }[],
    transfers: {
        id: string;
        createdAt: Date;
        status: TransferStatus;
        source: string;
        dest: string;
        srcPlaylistName: string;
        destPlaylistName: string | null;
    }[],
    initialCursor: string | null;
    userId: string,
    disconnectService: (id: string, userId: string, provider: string) => Promise<void>,
}
const statusStyle: Record<string, string> = {
    SUCCESS: "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200",
    FAILED: "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200",
    PARTIAL: "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200",
    RUNNING: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
};

const formatDate = (d: Date | string) =>
    new Date(d).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

export function TransfersTable({ transfers, scrollRef }: { transfers: Props["transfers"], scrollRef: React.RefObject<HTMLDivElement | null> }) {
  if (!transfers?.length) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground ">
        No transfers yet.
      </div>
    );
  }

  return (
    <div className="relative w-full">
        <div
            className="
            max-h-[60svh]
            h-auto
            overflow-auto
            overscroll-contain
            rounded-lg border
            bg-background
            !z-1
            max-w-[80vw]
            "
            ref={scrollRef}
        >
            <table className="w-full table-fixed border-collapse text-sm !z-1">
                <thead className="bg-gray-50 dark:bg-black sticky top-0 z-3 ">
                <tr className="text-left text-muted-foreground sticky top-0 dark:text-white border-b dark:border-b">
                    <th className="py-2 !z-1 pl-3 tracking-wide text-left pr-4 font-medium w-[14rem]">Created</th>
                    <th className="py-2 !z-1 tracking-wide text-left pr-4 font-medium w-[8rem]">Status</th>
                    <th className="py-2 !z-1 tracking-wide text-left pr-4 font-medium w-[9rem]">Source</th>
                    <th className="py-2 !z-1 tracking-wide text-left pr-4 font-medium w-[9rem]">Destination</th>
                    <th className="py-2 !z-1 tracking-wide text-left pr-4 font-medium w-[9rem]">Source playlist</th>
                    <th className="py-2 !z-1 tracking-wide text-left pr-4 font-medium w-[9rem]">Destination playlist</th>
                </tr>
                </thead>
                <tbody>
                {transfers.map((t) => (
                    <tr key={t.id} className="border-b last:border-0">
                    <td className="py-3 !z-1 pl-3 pr-4 whitespace-nowrap">{formatDate(t.createdAt)}</td>
                    <td className="py-3 !z-1 pr-4 whitespace-nowrap">
                        <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${statusStyle[t.status] ?? "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200"}`}
                        >
                        {t.status}
                        </span>
                    </td>
                    <td className="py-3 !z-1 pr-4 whitespace-nowrap">{t.source == "spotify" ? "Spotify" : "YouTube Music"}</td>
                    <td className="py-3 !z-1 pr-4 whitespace-nowrap">{t.dest == "spotify" ? "Spotify" : "YouTube Music"}</td>
                    <td className="py-3 !z-1 pr-4 whitespace-nowrap" title={t.srcPlaylistName}>
                        {t.srcPlaylistName}
                    </td>
                    <td className="py-3 !z-1 pr-4 whitespace-nowrap" title={t.destPlaylistName ?? ""}>
                        {t.destPlaylistName ?? "—"}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default function Dashboard({ services, transfers, initialCursor, userId, disconnectService }: Props) {
    const spotifyLogoSrc = "/logos/spotify.svg";
    const ytmusicLogoSrc = "/logos/youtube-music.svg";
    const router = useRouter();
    const connected = useMemo(() => new Set(services.map(s => s.provider)), [services]);
    const disconnected = useMemo(() => SERVICES.map((s) => s.slug).filter(p => !connected.has(p)), [connected]);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const handleConnect = (provider: string) => {
        router.push(`/api/oauth/${provider}/start?return_to=/dashboard`);
    };

    const [cursor, setCursor] = useState(initialCursor);
    const [loading, setLoading] = useState(false);

    const [masterItems, setMasterItems] = useState(transfers); 

    const [visibleCount, setVisibleCount] = useState(transfers.length);

    const visibleItems = masterItems.slice(0, visibleCount);
    const canShowLess = visibleCount > 10; 
    const canShowMore = Boolean(cursor) || visibleCount < masterItems.length;

    function triggerScrollNudge(up: boolean) {
        if (up) {
            setTimeout(() => {
                if (tableContainerRef.current) {
                tableContainerRef.current.scrollBy({
                    top: 100, 
                    behavior: 'smooth' 
                });
                }
            }, 50);
        }
        else {
            setTimeout(() => {
                if (tableContainerRef.current) {
                tableContainerRef.current.scrollBy({
                    top: -100, 
                    behavior: 'smooth' 
                });
                }
            }, 50);
        }
    }

    async function loadMore() {
    if (visibleCount < masterItems.length) {
        setVisibleCount((prev) => prev + 10);
        triggerScrollNudge(true);
        return;
    }

    if (!cursor || loading) return;
    setLoading(true);
    try {
        const res = await loadTransfers({ userId, cursor });
        setMasterItems((prev) => [...prev, ...res.items]);
        setVisibleCount((prev) => prev + res.items.length);
        setCursor(res.nextCursorCreatedAt);

        triggerScrollNudge(true);
    } finally {
        setLoading(false);
    }
    }

    function showLess() {
        setVisibleCount((prev) => Math.max(10, prev % 10 == 0 ? prev - 10 : prev - (prev % 10))); 
        triggerScrollNudge(false);
    }
    
    return (
        <section
            id="dashboard"
            aria-labelledby="dashboard"
            className="relative over-flow-hidden
            flex p-10 items-center justify-center bg-background flex-col"
        >
            <div
                key={"dashboard-container"}
                className="flex flex-[1_3] flex-col lg:flex-row gap-5 z-1 "
            >
                <div
                    className="flex flex-col gap-7 z-1"
                >
                    <h1 className="text-2xl font-bold">Connections</h1>
                    <div
                        className="flex flex-row gap-3 lg:flex-col"
                    >
                        {disconnected.map((s) => {
                            const imgSrc = s == "spotify" ? spotifyLogoSrc : ytmusicLogoSrc;
                            return (
                                <div
                                key={s + "_disconnected"}
                                className="flex flex-col p-5 border-1 rounded-xl items-center h-fit w-fit gap-2 bg-white dark:bg-black"
                                >
                                    <Image 
                                        src={imgSrc}
                                        alt={s}
                                        width={50}
                                        height={50}
                                    />
                                    <h3
                                    className="text-lg truncate w-[8rem] text-center"
                                    >
                                        {s == "spotify" ? "Spotify" : "YouTube Music"}
                                    </h3>
                                    <Button onClick={() => handleConnect(s)}
                                        className="
                                        cursor-pointer
                                        flex p-2 bg-[#43B929] hover:bg-[#43B929] text-white h-auto w-auto items-center justify-center rounded-md overflow-x-auto
                                        "
                                    >
                                        <Link />
                                        Connect
                                    </Button>
                                </div>
                            )
                        })}
                        {services.map((s) => {
                            const imgSrc = s.provider == "spotify" ? spotifyLogoSrc : ytmusicLogoSrc;
                            return (
                                <div
                                key={s.provider}
                                className="flex flex-col p-5 border-1 rounded-xl items-center h-fit w-fit gap-2 bg-white dark:bg-black"
                                >
                                    <Image 
                                        src={imgSrc}
                                        alt={s.provider}
                                        width={50}
                                        height={50}
                                    />
                                    <h3
                                    className="text-lg truncate w-[8rem] text-center"
                                    >
                                        {s.username}
                                    </h3>
                                    <Button onClick={() => disconnectService(s.id, s.userId, s.provider)}
                                        className="
                                        cursor-pointer
                                        flex p-2 bg-[#FF4242] hover:bg-[#FF4242] text-white h-auto w-auto items-center justify-center rounded-md overflow-x-auto
                                        "
                                    >
                                        <Unlink />
                                        Disconnect
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>
                
                <Separator orientation="vertical" />
                
                <div
                    className="flex flex-col gap-7"
                >
                    <h1 className="text-2xl font-bold">History</h1>
                    <TransfersTable transfers={visibleItems} scrollRef={tableContainerRef}/>
                    <div
                        className="flex justify-end gap-5 w-[100%]"
                    >
                        <Button
                        onClick={loadMore}
                        disabled={!canShowMore || loading}
                        className="cursor-pointer bg-[#F8831E] hover:bg-[#FF9538] disabled:opacity-[0.6]"
                        >
                            {loading ? "Loading..." : canShowMore ? "Load more" : "No more"}
                        </Button>
                        <Button
                        disabled={!canShowLess || loading}
                        onClick={showLess}
                        className="cursor-pointer bg-[#3f3f3f] hover:bg-[#505050] disabled:opacity-[0.6] dark:bg-[#EEF0F2] dark:hover:bg-[#979797]"
                        >
                            Show less
                        </Button>
                    </div>
                    
                </div>
                
            </div>
        </section>
    )
}