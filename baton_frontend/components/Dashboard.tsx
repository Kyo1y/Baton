"use client"
import { TransferStatus } from "@prisma/client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";


type Props = {
    services: {
        id: string;
        userId: string;
        image: string | null;
        provider: string;
        createdAt: Date;
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

export function TransfersTable({ transfers }: { transfers: Props["transfers"] }) {
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
            h-[60svh]
            overflow-auto
            overscroll-contain
            rounded-lg border
            bg-background
            !z-1
            max-w-[80vw]
            "
        >
            <table className="w-full table-fixed border-collapse text-sm !z-1">
                <thead className="bg-gray-50">
                <tr className="border-b text-left text-muted-foreground">
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

export default function Dashboard({ services, transfers, disconnectService }: Props) {
    const spotifyLogoSrc = "/logos/spotify.svg";
    const ytmusicLogoSrc = "/logos/youtube-music.svg";

    return (
        <section
            id="dashboard"
            aria-labelledby="dashboard"
            className="relative over-flow-hidden
            flex p-10 items-center justify-center bg-background flex-col"
        >
            <div
                key={"dashboard-container"}
                className="flex flex-[1_3] flex-col lg:flex-row gap-5"
            >
                <div
                    className="flex flex-col gap-7 z-1"
                >
                    <h1 className="text-2xl font-bold">Connections</h1>
                    <div
                        className="flex flex-row gap-2 lg:flex-col"
                    >

                            {services.map((s) => {
                            const imgSrc = s.provider == "spotify" ? spotifyLogoSrc : ytmusicLogoSrc;
                            return (
                                <div
                                key={s.provider}
                                className="flex flex-col p-5 border-1 rounded-lg items-center h-fit w-fit"
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

                                        "
                                    >
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
                    <TransfersTable transfers={transfers} />
                </div>
                
            </div>
        </section>
    )
}