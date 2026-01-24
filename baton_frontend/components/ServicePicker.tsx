"use client";

import { SERVICES } from "@/lib/services";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  subtitle?: string;
  exclude?: string[];
  mode: "source" | "dest",
  source?: string;
};

export default function ServicePicker({ title, subtitle, exclude = [], mode, source }: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const router = useRouter();
    const visible = SERVICES.filter(s => !exclude.includes(s.slug));
    const hrefFor = (slug: string) =>
    mode === "source" ? `/transfer/${slug}` : `/transfer/${source}/${slug}`;
    const hrefBack = () => mode === "source" ? "/" : `/transfer`

    return (
        <section id="source-service !z-2">
            <div className="flex flex-col justify-center items-center gap-7 p-[2rem] pb-[13rem]">
                <div className="flex flex-col justify-center items-center gap-2">
                    <h1 
                    className="text-balance font-bold tracking-tight z-2
                    text-xl sm:text-2xl md:text-3xl">
                        {title}
                    </h1>
                    <p className="text-balance max-w-prose text-base text-md sm:text-lg text-muted-foreground z-2">
                        {subtitle}
                    </p>
                </div>
                
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 overflow-show">
                    {visible.map(service => {
                        const isSelected = selected === service.slug;
                        return (
                            <Button
                            key={service.slug}
                            className={clsx(
                                `flex flex-col bg-[#F1F1F1] p-2 h-auto items-center justify-center rounded-[1.25rem] cursor-pointer border z-2`,
                                isSelected ?
                                "bg-white border border-[#F8831E] hover:bg-white"
                                :
                                "hover:bg-[#F2F2F2] hover:shadow-lg"
                            )}
                            onClick={() => setSelected(isSelected ? null : service.slug)}
                            >
                            <Image
                                src={service.logo}
                                alt={service.name}
                                width={service.width}
                                height={service.height}
                            />
                            </Button>
                        );
                        })}
                </div>
                <div className="flex gap-3 justify-center items-center">
                    {mode !== "source" &&  
                    <Button
                        className={clsx(
                                "flex flex-col p-2 border bg-[#CDCDCD] hover:bg-[#CDCDCD] cursor-pointer text-black h-auto w-auto items-center justify-center rounded-xl overflow-x-auto z-2",
                            )}
                        onClick={() => router.push("/transfer")}
                    >
                        Back
                    </Button>}
                    
                    <Button
                        disabled={!selected}
                        className={clsx(
                                "flex flex-col p-2 border bg-[#CDCDCD] hover:bg-[#CDCDCD] text-muted-foreground h-auto w-auto items-center justify-center rounded-xl overflow-x-auto z-2",
                                selected ?
                                    "bg-white border-[#F8831E] hover:bg-white text-black cursor-pointer  border"
                                    : " border"
                            )}
                        onClick={() => selected && router.push(hrefFor(selected))}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </section>
    );
}
