"use client"

import { STRENGTH_BLOCKS } from "@/app/content/strengths";
import VantaBirdsBackground from "./vantaEffects/VantaBirds";

export default function WhyBaton() {
    return (
        <section
        id="features"
        aria-labelledby="features"
        className="relative
            flex pb-10 px-10 min-h-[calc(70svh-3.5rem)] items-center justify-center bg-background flex-col"
        >
            <div
            className="
                mx-auto flex max-w-5xl flex-col items-center justify-center
                gap-6 px-4 sm:px-6 py-8 sm:py-16
                text-center z-1
                "
            >
                <div 
                key="why-us-title"
                className="flex flex-row w-auto"
                >
                    <h1
                    id="hero-title"
                    className="
                        text-balance font-bold tracking-tight
                        text-4xl sm:text-5xl md:text-6xl
                    "
                    >
                    Why choose <span className="block pl-1.5 text-[#F8831E]"> Baton<span className="!text-black">?</span></span>
                    </h1>
                </div>
                

                <p className="text-balance max-w-prose text-base sm:text-xl text-muted-foreground ">
                Built by music lovers, for music lovers. <br className="hidden sm:block" />
                <span className="block pl-1.5"> We understand how precious your playlists are.</span> 
                </p>
            </div>
            <div
            key="strengths"
            className="flex flex-col sm:flex-row gap-5"
            >
                {STRENGTH_BLOCKS.map(({ key, title, description, icon: Icon }) => {
                    return (
                        <div
                        key={key}
                        className="p-4 rounded-md border-1 sm:border-white sm:hover:border-[#F8831E] grid 

                        grid-rows-[2.5rem_auto_3rem]
                        sm:grid-rows-[3rem_auto_5rem] gap-2 flex-1"
                        
                        >
                            <div
                            className="p-2 bg-[#f8831e4a] rounded-md w-fit h-fit"
                            >
                                <Icon className="stroke-[#F8831E] sm:h-8 sm:w-8"/>
                            </div>
                            <h1
                            className="sm:text-3xl text-md font-bold "
                            >
                                {title} 
                            </h1>
                            <p
                            className="text-muted-foreground text-md sm:text-lg text-balance max-w-[20rem] md:max-w-[25rem]"
                            >
                                {description}
                            </p>
                        </div>
                    )
                })}

            </div>
        </section>
    )
}