import { unstable_cache } from "next/cache";
import { getAdapter } from "@/integrations/registry";
import type { Provider } from "@prisma/client";

export async function listPlaylistsCached(userId: string, provider: Provider) {
    const key = ["playlists", userId, provider]

    const getCachedPlaylists = unstable_cache(
        async () => {
            const adapter = getAdapter(provider);
            const res = await adapter.listPlaylists(userId);
            const cachedPlaylists = res.items;
            return cachedPlaylists;
        },
        key,
        {
            revalidate: 600,
            tags: [`playlists:${userId}:${provider}`]
        }
    )
    return getCachedPlaylists();
    
}