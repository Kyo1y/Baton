"use client"
import SignOutBtn from "@/components/SignOutBtn";
import Image from "next/image";

export default function Profile({ avatar, username }: { avatar?: string, username?: string}) {
    return (
        <>
        <div
            className="flex flex-col items-center justify-center min-h-[60svh] h-full w-full z-3 "
        >
            <div
                className="border-3 rounded-lg border-black flex flex-col items-center justify-center p-5 sm:p-7 gap-5 dark:border-white"
            >
                <Image 
                src={avatar ?? ""}
                width={72} height={72} 
                style={{borderRadius: "50%"}} 
                className="z-2 "
                alt="Avatar"
            />
            <h1
                className="text-balance font-bold tracking-tight
                    text-2xl sm:text-3xl md:text-4xl z-2"
            >
                Welcome, {username}
            </h1>
            <SignOutBtn />
            </div>
            
        </div>
        </>
    )
}