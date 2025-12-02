"use client"

import { STEP_BLOCKS } from "@/app/content/processSteps"
import VantaBirdsBackground from "./vantaEffects/VantaBirds"

export default function Process() {
    return (
            <section
            id="process"
            aria-labelledby="process"
            className="relative
                flex pb-10 px-10 min-h-[calc(100svh-3.5rem)] items-center justify-center bg-background flex-col "
            >
                {/* <VantaBirdsBackground> */}

                <div
                className="
                    mx-auto flex max-w-5xl flex-col items-center justify-center
                    gap-6 px-4 sm:px-6 py-8 sm:py-16
                    text-center !z-2
                    "
                >
                    <div 
                    key="process"
                    className="flex flex-row w-auto"
                    >
                        <h1
                        id="process-title"
                        className="
                            text-balance font-bold tracking-tight
                            text-4xl sm:text-5xl md:text-6xl
                        "
                        >
                        <span className="block pr-1.5 text-[#F8831E]">How</span> does it work?
                        </h1>
                    </div>
                    
    
                    <p className="text-balance max-w-prose text-base sm:text-xl text-muted-foreground ">
                    No technical knowledge required. Just connect, select, and transfer.
                    </p>
                </div>
                <div
                key="process-steps"
                className="flex flex-col sm:flex-row gap-5"
                >
                    {STEP_BLOCKS.map(({ key, stepNum, title, description}) => {
                        return (
                            <div
                            key={key}
                            className="flex flex-col sm:flex-row items-center"
                            >
                                <div
                                className="p-4  grid items-center justify-items-center
                                max-w-[20rem]
                                max-h-[15rem]
                                grid-rows-[2.5rem_auto_3rem]
                                sm:grid-rows-[3rem_auto_auto] gap-2 flex-1"
                                >
                                    <span
                                    className="inline-flex size-12 items-center text-white justify-center rounded-full border text-2xl font-medium bg-[#F8831E]"
                                    >
                                        {stepNum}
                                    </span>
                                    <h1
                                    className="sm:text-3xl text-md font-bold text-center"
                                    >
                                        {title} 
                                    </h1>
                                    <p
                                    className="text-muted-foreground text-center text-md sm:text-lg text-balance max-w-[20rem] md:max-w-[25rem]"
                                    >
                                        {description}
                                    </p>
                                </div>
                                {stepNum !== STEP_BLOCKS[STEP_BLOCKS.length-1].stepNum && (
                                        <span className="mx-4 sm:block h-px sm:w-10 md:w-16 bg-border hidden" />
                                )}
                                {stepNum !== STEP_BLOCKS[STEP_BLOCKS.length-1].stepNum && (
                                        <span className="mt-4 w-px h-10 bg-border sm:hidden" />
                                )}
                            </div>
                            
                        )
                    })}
    
                </div>
                {/* </VantaBirdsBackground> */}

            </section>
        )
}