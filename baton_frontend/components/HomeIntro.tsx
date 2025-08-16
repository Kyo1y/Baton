"use client"
import Link from "next/link"
import { Button } from "./ui/button"
import ServicesList from "./ServicesList"

export default function HomeIntro() {
    return (
        <section
            id="hero"
            aria-labelledby="hero-title"
            className="relative over-flow-hidden
            flex p-10 items-center justify-center bg-background flex-col"
        >
            {/* <div className="hero-cont grid grid-rows-[2fr_1fr_1fr]
            text-center items-center justify-items-center gap-2">
                <div className="hero-title-cont h-32">
                    <h1 className="text-6xl font-bold">
                        Move Your Music{" "}
                        <br />
                        <span className="text-[#F8831E]">Anywhere</span>
                    </h1>
                </div>
                <div className="hero-desc-cont text-sm text-[#585858]">
                    <p>Seamlessly transfer your playlists, liked songs, and music library between any streaming service.
                        <br />
                        No more starting from scratch.</p>
                </div>
                <div className="hero-buttons-cont flex gap-2 w-max">
                    <Button asChild className="group bg-[#F8831E] hover:bg-[#FF8E2C] gap-1">
                        <Link href={"/transfer"}>Start Transfer 
                            <span
                                aria-hidden="true"
                                className="ml-1 inline-block transition-transform group-hover:translate-x-1"
                            >
                                →
                            </span>
                        </Link>
                    </Button>
                    <Button asChild className="text-black shadow-none bg-[#FFFFF] hover:bg-[#F1F1F1] gap-1">
                        <Link href={"/demo"}>Watch Demo</Link>
                    </Button>
                </div>
            </div>
            <ServicesList /> */}
            <div
                className="
                mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-5xl flex-col items-center justify-center
                gap-6 px-4 sm:px-6 md:px-8 py-16 sm:py-24
                text-center
                "
            >
                <h1
                id="hero-title"
                className="
                    text-balance font-bold tracking-tight
                    text-4xl sm:text-5xl md:text-6xl
                "
                >
                Move your music <span className="block text-[#F8831E]">anywhere</span>
                </h1>

                <p className="text-balance max-w-prose text-base sm:text-lg text-muted-foreground">
                Seamlessly transfer your playlists, liked songs, and music library between any streaming service.
                <br className="hidden sm:block" />
                No more starting from scratch.
                </p>

                <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
                    <Button asChild className="group bg-[#F8831E] hover:bg-[#FF8E2C] gap-1">
                        <Link href="/transfer">
                        Start Transfer
                        <span
                            aria-hidden="true"
                            className="ml-1 inline-block transition-transform group-hover:translate-x-1"
                        >
                            →
                        </span>
                        </Link>
                    </Button>

                    <Button asChild className="text-black shadow-none bg-[#FFFFF] hover:bg-[#F1F1F1] gap-1">
                            <Link href={"/demo"}>Watch Demo</Link>
                    </Button>

                </div>
                <ServicesList />

            </div>


        </section>
    )
}