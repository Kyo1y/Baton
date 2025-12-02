export type Step = {
  key: string;
  stepNum: number;
  title: string;
  description: string;
};

export const STEP_BLOCKS: readonly Step[] = [
  {
    key: "connect",
    stepNum: 1,
    title: "Connect Services",
    description: "Sign in to your source and destination streaming accounts.",
  },
  {
    key: "content",
    stepNum: 2,
    title: "Select Content",
    description: "Choose playlists, albums, or your entire library to transfer.",
  },
  {
    key: "transfer",
    stepNum: 3,
    title: "Transfer & Enjoy",
    description: "Sit back while we match and transfer your music automatically.",
  },
] as const;