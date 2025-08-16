export type Service = {
    name: string,
    logo: string,
    slug: string,
    width: number,
    height: number,
}

export const SERVICES: Service[] = [
  { name: "Spotify", logo: "/logos/spotify-big.png", slug: "spotify", width: 120, height: 120},
  { name: "YouTube Music", logo: "/logos/ytmusic.svg", slug:"youtube-music", width: 160, height: 160 },
]