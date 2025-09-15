import { MusicAdapter } from "./types";
import { spotifyAdapter } from "./spotify";
import { ytmusicAdapter } from "./ytmusic";

export type Provider = "spotify" | "ytmusic";

export const REGISTRY: Record<Provider, { name: string; adapter: MusicAdapter }> = {
  spotify: { name: "Spotify", adapter: spotifyAdapter },
  ytmusic: { name: "YouTube Music", adapter: ytmusicAdapter },
};

export const PROVIDERS = Object.keys(REGISTRY) as Provider[];

export function isProvider(x: string): x is Provider {
  return x in REGISTRY;
}

export function requireProvider(x: string): Provider {
  if (!isProvider(x)) throw new Error(`Unknown provider: ${x}`);
  return x;
}

export function getAdapter(p: string | Provider): MusicAdapter {
  const key = typeof p === "string" ? requireProvider(p) : p;
  return REGISTRY[key].adapter;
}