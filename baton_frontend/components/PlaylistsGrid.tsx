import { Playlist } from "@/integrations/types";
import { Button } from "./ui/button";
import Image from "next/image";
import clsx from "clsx";
import { DraftPlaylist } from "./DraftPlaylist";
import { useState, useEffect } from "react";
import { PencilLine } from 'lucide-react';

type Props = { 
    playlists: Playlist[], 
    source: string, 
    dest: string, 
    onChange: (val: string | null) => void, 
    selectedPlaylistId: string | null, 
    isDest?: boolean, 
    addDraftPlaylist?: (name: string, isPublic: boolean, url: string) => void, 
    draftDest?: Playlist | null,
}

export default function PlaylistsGrid({
    playlists, source, dest, onChange, selectedPlaylistId, isDest, addDraftPlaylist, draftDest
}: Props ) {
    const [draftOpen, setDraftOpen] = useState(false);
    const sourceImgSrc = `/${source}_playlist_thumbnail.svg`;
    const destImgSrc = `/${dest}_playlist_thumbnail.svg`;
    const isDraft = draftDest != null;
    let nRows;
    useEffect(() => {
        nRows = playlists.length;
    }, [playlists.length]);
    return (
        <div className={`grid grid-rows-${nRows}`}>
            {playlists.map((p) => {
                const isServiceSelected = selectedPlaylistId === p.id;
                const dummyImage = isDest ? destImgSrc : sourceImgSrc;
                if (p.id === "__draft__") {
                    return (
                        <div key={p.id} className={`flex flex-row`}>
                            <Button  onClick={() => onChange(isServiceSelected ? null : p.id )} 
                            className= {clsx(
                                `rounded-none cursor-pointer border-l-1 border-b-1 border-r-1 border-black border-solid rounded-b-lg bg-transparent shadow-none
                            hover:bg-[#F3F3F3] w-full md:max-w-[13rem]
                            z-5 dark:text-white dark:bg-black
                            `,
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
                                    {isServiceSelected && (
                                        <div onClick={() => setDraftOpen(true)} className="cursor-pointer px-2 z-20 max-h-[20px] max-w-[20px] bg-transparent hover:bg-transparent">
                                            <PencilLine onClick={() => setDraftOpen(true)}/>
                                        </div>)
                                    }
                                </div>
                            </Button>
                            
                        </div>
                        
                    )
                }
                return (
                    <Button key={p.id} onClick={() => onChange(isServiceSelected ? null : p.id )} 
                    className= {clsx(
                        `rounded-none cursor-pointer first:rounded-t-lg 
                    last:rounded-b-lg bg-transparent shadow-none border-l-1 border-r-1 border-b-1 border-black border-solid first:border-t-1
                    hover:bg-[#F3F3F3] w-full md:max-w-[13rem] md:min-w-[13rem] 
                    z-5 dark:text-white dark:bg-black
                    `,
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
                        </div>
                    </Button>
                )
            })}
            {isDest && (
                <div className={clsx(isDraft ? `hidden` : `flex items-center`)}>
                    <DraftPlaylist 
                        addDraftPlaylist={addDraftPlaylist!}
                        url={destImgSrc}
                        open={draftOpen}
                        onOpenChange={setDraftOpen}
                        draftDest={draftDest}
                    /> 
                </div>
            )}
            
        </div>
    )

}