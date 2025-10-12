import OpenAI from "openai";

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY!;

export default async function normalizeGPT(title: string, artist: string) {
    const systemInstruction = `Normalize a track to "Artist:Title". 
            Rules (brief):
            - If title has "Artist - Title" (or "Artist - Title" / "Artist: Title" / "Artist x Title"), take artist & title from there.
            - If a song is from youtube, artist name will be the channel name and may contain something like "ArtistName - Topic" or "ArtistNameVEVO". Strip " - Topic" and trailing "VEVO"; title is the song name.
            - Remove junk: (official video/audio), lyrics/lyric video, visualizer, sped up/slowed/reverb, nightcore, 8d, bass boosted, instrumental, remaster(ed) YYYY?, radio edit, extended mix, live…, remake, cover, edit, bootleg, loop. Remove bracketed []/() parts when they're just junk. Collapse whitespace.
            - If it's multiple authors, pick the most popular one and return his name
            - Output ONLY: Artist:Title (no quotes, no extra text).

            Examples:
            title: "Crew Love" | artists: "Drake, The Weekend"
            → Drake:Crew Love

            title: "Kendrick Lamar - Westside, Right On Time" | artists: "Unfortunate One"
            → Kendrick Lamar:Westside, Right On Time

            title: "Don Toliver - NO POLE | REMAKE 7 UP DAMN" | artists: "7 UP DAMN"
            → Don Toliver:NO POLE

            title: "Blinding Lights (Official Video)" | artists: "TheWeekndVEVO"
            → The Weeknd:Blinding Lights

            title: "Look What You Made Me Do (Lyric Video)" | artists: "Taylor Swift - Topic"
            → Taylor Swift:Look What You Made Me Do
            title: SẬP (feat. Tez, MEGAZTOOM) | artists: Pháo, Tez, MEGAZETZ, HNGTOOM
            → Pháo:SẬP

        ` 
    const input = `title: "${title}" | artists: "${artist}"`;
    
    const result = await openai.responses.create({
        model: "gpt-4o-mini",
        instructions: systemInstruction,
        input: input,
    })
    const output = result.output_text
    const dashIndex = output.indexOf(":");
    const processedRes = [output.slice(0, dashIndex), output.slice(dashIndex+1)];
    return processedRes;
}