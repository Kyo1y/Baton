"use client"

import Link from "next/link";

export default function Contacts() {
    return (
        <section
            id="about"
            aria-labelledby="about-title"
            className="relative over-flow-hidden
            flex p-10 bg-background flex-col"
        >
            <div
                className="
                mx-auto flex min-h-[calc(30svh-3.5rem)] max-w-5xl flex-col
                gap-6 px-4 sm:px-6 md:px-8 py-16 sm:py-24
                
                "
            >
                <h1
                className="text-balance font-bold tracking-tight text-[#F8831E]
                    text-4xl sm:text-5xl md:text-6xl"
                >
                    Contacts
                </h1>
                <p
                className="text-balance max-w-prose text-base sm:text-xl"
                >
                    Email me at sadyrbekov.kairat@gmail.com about anything, including Baton.
                    <br/><br/>
                    Find me elsewhere on <Link href={"https://github.com/Kyo1y"} className="underline decoration-dotted">Github</Link> and <Link href={"https://linkedin.com/in/kyoly"} className="underline decoration-dotted">Linkedin</Link>.
                </p>
            </div>
        </section>
    )
}