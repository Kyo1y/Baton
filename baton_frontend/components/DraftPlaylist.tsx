import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"
import clsx from "clsx";
import { toast } from "sonner";

type DraftPlaylistProps = {
    url: string,
    addDraftPlaylist: (name: string, privacy: boolean, url: string) => void,
    open?: boolean,
    onOpenChange?: (open: boolean) => void;
}

export function DraftPlaylist({
    url,
    addDraftPlaylist,
    open,
    onOpenChange
}: DraftPlaylistProps) {
    const [internalOpen, setInternalOpen] = useState<boolean>(false);
    const [isPublic, setIsPublic] = useState<boolean | null>(false);
    const [draftName, setDraftName] = useState<string | null>(null);

    const nameRef = useRef<HTMLInputElement>(null);
    const isControlled = open !== undefined;
    const dialogOpen = isControlled ? open : internalOpen;
    const setDialogOpen = isControlled ? (onOpenChange as (o: boolean) => void) : setInternalOpen;
    const canSave = !!draftName?.trim() && isPublic !== null;
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (draftName === "") {
        toast.error("Name required", {
        description: "Please enter a playlist name before saving.",
        duration: 3000,
        });
        nameRef.current?.focus?.();
        return;
    }
    try {
        const draftDisplayName = isPublic ? `🌐 ${draftName!.trim()}` : `🔒 ${draftName!.trim()}`
        addDraftPlaylist(draftDisplayName, isPublic!, url)
        setDialogOpen(false)
    } catch (err) {
        console.error(err)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-[#F8831E]">+</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new playlist.</DialogTitle>
            <DialogDescription>
              Give your new playlist a shiny name and decide who can see it.
            </DialogDescription>
          </DialogHeader>
            <form onSubmit={onSubmit}>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue={draftName ?? ""}  placeholder={`New Playlist...`} 
                onChange={(e) => {
                    const val = e.target.value
                    setDraftName(val === "" ? null : val)
                    }
                }/>
            </div>
            <div className="grid gap-3 py-3">
              <Label htmlFor="privacy-1">Privacy</Label>
              <Button
                  type="button"
                  className={clsx(`cursor-pointer rounded-none px-4 bg-transparent text-black hover:bg-[#F3F3F3]`, isPublic ? `bg-[#F8831E] text-white hover:bg-[#F8831E]` : ``)}
                  aria-pressed={isPublic === true}
                  onClick={() => {setIsPublic(isPublic === true ? null : true)}}
                >
                  🌐 Public
                </Button>
                <Button
                  type="button"
                  className={clsx(`cursor-pointer rounded-none px-4 bg-transparent text-black hover:bg-[#F3F3F3]`, isPublic == false ? `bg-[#F8831E] text-white hover:bg-[#F8831E]` : ``)}
                  aria-pressed={isPublic === false}
                  onClick={() => {setIsPublic(isPublic === false ? null : false)}}
                >
                  🔒 Private
                </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!canSave} className="cursor-pointer">Save changes</Button>
          </DialogFooter>
        </form>

        </DialogContent>
    </Dialog>
  )
}
