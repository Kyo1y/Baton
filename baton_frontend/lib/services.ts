export type Service = {
    name: string,
    logo: string,
    slug: string,
    width: number,
    height: number,
}

export const SERVICES: Service[] = [
  { name: "Spotify", logo: "/logos/spotify-big.png", slug: "spotify", width: 140, height: 10},
  { name: "YouTube Music", logo: "/logos/ytmusic.svg", slug:"ytmusic", width: 180, height: 10 },
]