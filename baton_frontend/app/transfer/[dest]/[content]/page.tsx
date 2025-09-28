import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { listPlaylistsCached } from "@/lib/cachedPlaylists";
import requireIntegration from "@/lib/requireIntegration";
import PlaylistPicker from "@/components/PlaylistPicker";

export default async function StepThree( { params }: { params: Promise<{ dest: string, content: string }> } ) {
    const session = await getServerSession(authOptions);
    const { dest } = await params;
    const { content } = await params;
    if (!session) redirect("/api/auth/signin?callbackUrl=%2Ftransfer");

    if (!session?.user?.id) {
        redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/transfer/${dest}`)}`);
    }

    const userId = session.user.id;
    await requireIntegration(userId, content, `/transfer/${dest}/${content}`);

    const [sourcePlaylists, destPlaylists] = await Promise.all([
        listPlaylistsCached(userId, dest),
        listPlaylistsCached(userId, content)
    ])
    
    

    return (
        <PlaylistPicker 
            source={dest}
            dest={content}
            userId={session.user.id}
            sourcePlaylists={sourcePlaylists}
            destPlaylists={destPlaylists}
        />
    )
}