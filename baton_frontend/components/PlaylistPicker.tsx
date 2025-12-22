"use client";
import { Playlist } from "@/integrations/types";
import { useMemo, useState, useEffect } from "react";
import * as Separator from "@radix-ui/react-separator";
import PlaylistsGrid from "./PlaylistsGrid";
import { useSessionStorage } from "@/lib/useSessionStorage";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { saveTransferDraft } from "@/app/(actions)/saveTransferDraft";

type Props = {
    source: string,
    dest: string,
    userId: string,
    sourcePlaylists: Playlist[],
    destPlaylists: Playlist[],
}

export default function PlaylistPicker( { source, dest, userId, sourcePlaylists, destPlaylists}: Props ) {
    const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
    const [selectedDestId, setSelectedDestId] = useState<string | null>(null);
    const [draftDest, setDraftDest, removeDraft] = useSessionStorage<Playlist | null>(`draft:${userId}:${dest}`, null, 5 * 60 * 1000);
    const router = useRouter();
    const transferReady = selectedSourceId && selectedDestId;
    const toCompletion = `/transfer/${encodeURIComponent(source)}/${encodeURIComponent(dest)}/completion`;
    const toDestPicker = `/transfer/${encodeURIComponent(source)}`;
    const destList = useMemo(
        () => (draftDest ? [...destPlaylists, draftDest] : destPlaylists),
        [draftDest, destPlaylists]
    )

    function addDraftPlaylist(name: string, isPublic: boolean, url: string) {
        setDraftDest({
            id: "__draft__",
            name,
            thumbnail: { url, width:30, height:30 },
            isPublic,
        } as Playlist);
        setSelectedDestId("__draft__");
    }
    async function onTransfer() {
        const srcPlaylistName = sourcePlaylists.find(p => p.id === selectedSourceId)!.name;
        const destPlaylistName = destList.find(p => p.id === selectedDestId)!.name;
        const draftSelected = selectedDestId === "__draft__";
        if (!draftSelected) {
            removeDraft();
        }
        await saveTransferDraft({
            userId, source, dest, 
            srcPlaylistId: selectedSourceId!, 
            destPlaylistId: selectedDestId!, 
            srcPlaylistName,
            destDraft: draftSelected && draftDest ? { name: draftDest.name, isPublic: draftDest.isPublic, } : null,
            destPlaylistName: draftSelected && draftDest ? draftDest.name : destPlaylistName,
        })
        router.push(toCompletion);

    }
    return (
        <>
            <section id="playlist-pick">
                <div className="flex flex-col justify-center items-center gap-7 p-[2rem]">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <h1 
                        className="text-balance font-bold tracking-tight
                        text-xl sm:text-2xl md:text-3xl">
                            Choose the source and destination playlists.
                        </h1>
                        <p className="text-center text-balance max-w-prose text-base text-md sm:text-lg text-muted-foreground">
                            You may also create a new playlist in the destination provider if you don&apos;t see the one you want.
                        </p>
                    </div>
                    <div className="grid grid-cols-[auto_5rem_auto]">
                        <div id="sourcePlaylists" className="flex items-center w-full">
                            <PlaylistsGrid 
                                playlists={sourcePlaylists}
                                source={source}
                                dest={dest}
                                onChange={setSelectedSourceId}
                                selectedPlaylistId={selectedSourceId}
                            />
                        </div>
                        <div id="separator" className="relative flex mx-4 h-full justify-center items-center">
                            <Separator.Root
                            orientation="vertical"
                            decorative
                            className="h-full w-px bg-border"
                            />
                            <span
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                        rounded-full border bg-background px-2 py-0.5 text-[10px] font-medium
                                        text-muted-foreground shadow-sm"
                            >
                                TO
                            </span>
                        </div>
                        <div id="destPlaylists" className="flex items-center mx-auto w-full md:max-w-lg">
                            <PlaylistsGrid 
                                playlists={destList}
                                source={source}
                                dest={dest}
                                onChange={setSelectedDestId}
                                selectedPlaylistId={selectedDestId}
                                isDest={true}
                                addDraftPlaylist={addDraftPlaylist}
                                draftDest={draftDest}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            className={
                                    `flex flex-col cursor-pointer border bg-[#CDCDCD] hover:bg-[#CDCDCD] 
                                    text-black h-auto w-auto items-center justify-center 
                                    rounded-xl overflow-x-auto`
                                }
                            onClick={() => router.push(toDestPicker)}>
                                Back
                        </Button>
                        <Button
                            type="button"
                            disabled={!transferReady}
                            className={clsx(
                                    "flex flex-col border bg-[#CDCDCD] p-1.5 hover:bg-[#CDCDCD] text-muted-foreground h-auto w-auto items-center justify-center rounded-xl overflow-x-auto",
                                    transferReady ?
                                        "bg-[#F8831E] p-1.5 border-[#F8831E] hover:bg-[#fc953d] text-white cursor-pointer"
                                        : ""
                                )}
                            onClick={() => { onTransfer() }} 
                        >
                            Transfer
                        </Button>
                    </div>
                </div>
            </section>
        </>
    )
}