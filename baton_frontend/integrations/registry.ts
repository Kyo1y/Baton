import { MusicAdapter, Registry } from "./types";
import { Provider } from "@prisma/client";
import { spotifyAdapter } from "./spotify";
import { ytmusicAdapter } from "./ytmusic";


export const REGISTRY: Registry = {
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

export function getAdapter<P extends Provider>(p: P): MusicAdapter<P> {
  return REGISTRY[p].adapter;
}