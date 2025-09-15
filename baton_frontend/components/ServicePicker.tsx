// components/ServicePicker.tsx
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

    return (
        <section id="source-service">
            <div className="flex flex-col justify-center items-center gap-7 p-[2rem]">
                <div className="flex flex-col justify-center items-center gap-2">
                    <h1 
                    className="text-balance font-bold tracking-tight
                    text-xl sm:text-2xl md:text-3xl">
                        {title}
                    </h1>
                    <p className="text-balance max-w-prose text-base text-md sm:text-lg text-muted-foreground">
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
                                `flex flex-col bg-[#F1F1F1] w-auto h-auto items-center justify-center rounded-[1.25rem] cursor-pointer`,
                                isSelected ?
                                "bg-transparent border border-[#F8831E] hover:bg-transparent p-1.75"
                                :
                                "hover:bg-[#F2F2F2] hover:shadow-lg p-2"
                            )}
                            onClick={() => setSelected(isSelected ? null : service.slug)}
                            >
                            <Image
                                src={service.logo}
                                alt={service.name}
                                width={service.width}
                                height={service.height}
                                className={`!h-${service.height} object-contain`}
                            />
                            </Button>
                        );
                        })}
                </div>
                <div className="flex gap-3 justify-center items-center">
                    <Button
                        disabled={!selected}
                        className={clsx(
                                "flex flex-col border bg-[#CDCDCD] hover:bg-[#CDCDCD] text-muted-foreground h-auto w-auto items-center justify-center rounded-xl overflow-x-auto",
                                selected ?
                                    "bg-transparent border-[#F8831E] hover:bg-transparent text-black cursor-pointer p-1.75"
                                    : "p-2"
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
