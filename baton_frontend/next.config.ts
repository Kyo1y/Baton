import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GITHUB_ID: "Ov23li3998uL9bLt82SP",
    GITHUB_SECRET: "e763db63b45e7c6aa82135dbb01619c273be4d28",
  },
  images: {
    remotePatterns: [
    { protocol: "https", hostname: "avatars.githubusercontent.com" },
    { protocol: "https", hostname: "*.googleusercontent.com" },
  ],
  },
};

export default nextConfig;
