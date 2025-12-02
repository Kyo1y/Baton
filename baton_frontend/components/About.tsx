"use client"

import Link from "next/link";

export default function About() {
    return (
        <section
            id="about"
            aria-labelledby="about-title"
            className="relative over-flow-hidden
            flex px-10 bg-background flex-col"
        >
            <div
                className="
                mx-auto flex min-h-[calc(90svh-3.5rem)] max-w-5xl flex-col
                gap-6 px-4 sm:px-6 md:px-8 py-16 sm:py-24
                !z-1
                "
            >
                <h1
                className="text-balance font-bold tracking-tight
                    text-4xl sm:text-5xl md:text-6xl"
                >
                    About <span className="text-[#F8831E]">Baton</span>
                </h1>
                <p
                className="text-balance max-w-prose text-base sm:text-xl"
                >
                    Baton is a service that allows you to transfer any playlists between any streaming services.
                    <br/><br/>
                    Hi! I started Baton after I switched from Spotify to YouTube Music and was genuinely tired of recreating my old playlists, so...
                    <br /><br />
                    I saw it as an opportunity to hone my skills and solve a problem for me and maybe for other people too. 
                    <br /><br />
                    Initially, I created a Telegram chatbot but it felt like it was not enough, so I created this website too! You can also try the bot <Link href={"https://t.me/TransferMusic_bot"} 
                    className="underline decoration-dotted"
                    >
                        here.
                    </Link>
                    <br /><br />
                    I hope you enjoy it but if you encounter any issues, please let me know! <Link href={"/contact"} 
                    className="underline decoration-dotted"
                    >
                        Contacts.
                    </Link>
                </p>
            </div>
        </section>
    )
}