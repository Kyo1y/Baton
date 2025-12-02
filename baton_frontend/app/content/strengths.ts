import { Shuffle, Zap, Shield } from "lucide-react";

export type Feature = {
  key: string;
  title: string;
  description: string;
  icon: any;
};

export const STRENGTH_BLOCKS: readonly Feature[] = [
  {
    key: "speed",
    title: "Fast transfers",
    description: "Move playlists between services in minutes.",
    icon: Zap,
  },
  {
    key: "convenience",
    title: "Smart Transfers",
    description: "Preserve your carefully curated playlists across any streaming platform.",
    icon: Shuffle,
  },
  {
    key: "privacy",
    title: "Private & secure",
    description: "We never store your passwords or any streaming data.",
    icon: Shield,
  },
] as const;