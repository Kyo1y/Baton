"use client"

import { SERVICES } from "@/lib/services";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function TransferStepOne() {
    const [sourceService, setSourceService] = useState<string | null>(null);
    const router = useRouter();
    return (
        <>
            <section id="source-service">
                <div className="flex flex-col justify-center items-center gap-7 p-[2rem]">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <h1 
                        className="text-balance font-bold tracking-tight
                        text-xl sm:text-2xl md:text-3xl">
                            Choose your source service.
                        </h1>
                        <p className="text-balance max-w-prose text-base text-md sm:text-lg text-muted-foreground">
                            The service you will export FROM.
                        </p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 overflow-show">
                        {SERVICES.map((service) => {
                            const isSelected = service.slug === sourceService;
                            return (
                                <Button 
                                key={service.slug}
                                className={clsx(
                                    `flex flex-col bg-[#F1F1F1] w-auto h-auto items-center justify-center rounded-[1.25rem] cursor-pointer`,
                                    isSelected ?
                                    "bg-transparent border border-[#F8831E] hover:bg-transparent p-1.75"
                                    :
                                    "hover:bg-[#F2F2F2] hover:shadow-lg p-2"
                                )}
                                onClick={() => {
                                    if (isSelected) {
                                        setSourceService(null);
                                    }
                                    else {
                                    setSourceService(service.slug)
                                    } 
                                }}
                                >
                                    <Image
                                        src={service.logo}
                                        alt={service.name}
                                        width={service.width}
                                        height={service.height}
                                        className={`!h-${service.height} object-contain`}
                                    />
                                </Button>
                            )
                        })}
                    </div>
                    <div className="flex gap-3 justify-center items-center">
                        <Button className={clsx(
                            "flex flex-col border bg-[#CDCDCD] hover:bg-[#CDCDCD] text-muted-foreground h-auto w-auto items-center justify-center rounded-xl overflow-x-auto",
                            sourceService ?
                                "bg-transparent border-[#F8831E] hover:bg-transparent text-black cursor-pointer p-1.75"
                                : "p-2"
                        )}
                        disabled={!sourceService}
                        onClick={() => {
                            router.push(`/transfer/${sourceService}`)
                        }}
                        >
                            Continue
                        </Button>       
                    </div>
                </div>
            </section>
        </>
    )
}