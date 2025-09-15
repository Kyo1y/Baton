import { Playlist } from "@/integrations/types";
import { Button } from "./ui/button";
import Image from "next/image";
import clsx from "clsx";
import { DraftPlaylist } from "./DraftPlaylist";
import { useState } from "react";
import { PencilLine } from 'lucide-react';

type Props = { 
    playlists: Playlist[], 
    source: string, 
    dest: string, 
    onChange: (val: string | null) => void, 
    selectedPlaylistId: string | null, 
    isDest?: boolean, 
    addDraftPlaylist?: (name: string, isPublic: boolean, url: string) => void, 
    draftName?: string | null, 
    setDraftName?: (v: string | null) => void, 
    draftPublic?: boolean | null, 
    setDraftPublic?: (v: boolean | null) => void, 
    draftDest?: Playlist | null,
}

export default function PlaylistsGrid({
    playlists, source, dest, onChange, selectedPlaylistId, isDest, addDraftPlaylist, draftName, draftPublic, setDraftName, setDraftPublic, draftDest
}: Props ) {
    const [draftOpen, setDraftOpen] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);
    const sourceImgSrc = `/${source}_playlist_thumbnail.svg`;
    const destImgSrc = `/${dest}_playlist_thumbnail.svg`;

    return (
        <div className={clsx(`grid`, isDest ? `grid-rows-${playlists.length+1}` : ` grid-rows-${playlists.length}`)}>
            {playlists.map((p) => {
                const isServiceSelected = selectedPlaylistId === p.id;
                const dummyImage = isDest ? destImgSrc : sourceImgSrc;
                return (
                    <Button key={p.id} onClick={() => onChange(isServiceSelected ? null : p.id )} 
                    className= {clsx(
                        `rounded-none cursor-pointer first:rounded-t-lg 
                    last:rounded-b-lg bg-transparent shadow-none  border-solid border-black
                    hover:bg-[#F3F3F3] w-full md:max-w-[13rem]`,
                    isServiceSelected ? "bg-[#F8831E] hover:bg-[#F8831E] text-white" : "bg-transparent"
                    )} >
                        <div className="flex items-center w-full">
                            <Image 
                                src={p.thumbnail?.url ?? dummyImage}
                                alt="thumbnail"
                                width={30}
                                height={30}
                            />
                            <div className="flex justify-center w-full">
                                <p className={clsx(`truncate w-[90%]`, isServiceSelected ? "text-white" : "text-black")}>{p.name}</p>
                            </div>
                            {p.id === "__draft__" && isServiceSelected && (
                                <Button onClick={() => setDraftOpen(true)} className="cursor-pointer max-h-[20px] max-w-[10px]  border-black bg-transparent hover:bg-transparent">
                                    <PencilLine />
                                </Button>
                            )}
                        </div>
                    </Button>
                )
            })}
            {isDest && (
                <div className={clsx(draftDest ? `hidden` : ``)}>
                    <DraftPlaylist 
                        addDraftPlaylist={addDraftPlaylist!}
                        url={destImgSrc}
                        open={draftOpen}
                        onOpenChange={setDraftOpen}
                    /> 
                </div>
                
            )}
            
        </div>
    )

}