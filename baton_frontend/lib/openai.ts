import OpenAI from "openai";

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY!;

export default async function normalizeGPT(title: string, artist: string) {
    const systemInstruction = `Normalize a YouTube track to "Artist - Title". 
            Rules (brief):
            - If title has "Artist - Title" (or "Artist - Title" / "Artist: Title" / "Artist x Title"), take artist & title from there.
            - Else use channel as artist (strip " - Topic" and trailing "VEVO"); title is the song name.
            - Remove junk: (official video/audio), lyrics/lyric video, visualizer, sped up/slowed/reverb, nightcore, 8d, bass boosted, instrumental, remaster(ed) YYYY?, radio edit, extended mix, live…, remake, cover, edit, bootleg, loop. Remove bracketed []/() parts when they're just junk. Collapse whitespace.
            - Output ONLY: Artist:Title (no quotes, no extra text).
            - If title is similar to "SongName1 x SongName2", i.e. a mashup remix of 2 or more songs, simply return "false"

            Examples:
            title: "Kendrick Lamar - Westside, Right On Time" | channel: "Unfortunate One"
            → Kendrick Lamar:Westside, Right On Time

            title: "Don Toliver - NO POLE | REMAKE 7 UP DAMN" | channel: "7 UP DAMN"
            → Don Toliver:NO POLE

            title: "Blinding Lights (Official Video)" | channel: "TheWeekndVEVO"
            → The Weeknd:Blinding Lights

            title: "Look What You Made Me Do (Lyric Video)" | channel: "Taylor Swift - Topic"
            → Taylor Swift:Look What You Made Me Do
` 
    const input = `title: "${title}" | channel: "${artist}"`;
    
    const result = await openai.responses.create({
        model: "gpt-4o-mini",
        instructions: systemInstruction,
        input: input,
    })
    return result;
}