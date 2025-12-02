"use client"
import Link from "next/link"
import { Button } from "./ui/button"
import VantaBirdsBackground from "./vantaEffects/VantaBirds"

export default function Prompt() {
    return (
        <section
            id="prompt"
            aria-labelledby="prompt"
            className="relative
                flex  pb-20 min-h-[calc(20svh)] items-center justify-center bg-background flex-col"
            >
                {/* <VantaBirdsBackground> */}

                <div
                className="rounded-md border-1 border-[#F8831E] p-5 sm:p-10 flex flex-col gap-2 !z-1"
                >
                    <h1
                    className="
                            text-balance font-bold tracking-tight
                            text-4xl sm:text-5xl md:text-6xl
                        "
                    >
                        Ready to move  <span className="block pr-1.5 text-[#F8831E]"> your <span className="!text-black">music?</span></span>
                    </h1>
                    <p
                        className="text-balance max-w-prose text-base sm:text-xl text-muted-foreground "
                    >
                        Start your transfer for free today. For free forever.
                    </p>
                    <div
                    className="flex gap-5"
                    >
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
                    </div>
                </div>
                {/* </VantaBirdsBackground> */}

            </section>
    )
    
}