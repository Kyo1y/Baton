import { SERVICES } from "@/lib/services";
import Link from "next/link";
import Image from "next/image";

export default function ServicesList() {
    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <p className="text-sm text-[#585858]">Supports all major streaming services</p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 overflow-x-auto">
                {SERVICES.map((service) => (
                    <Link 
                    key={service.slug}
                    href={`/transfer`}
                    aria-label={`Start transfer with ${service.name}`}
                    >
                        <div className="flex bg-[#F1F1F1] p-2 h-auto w-auto items-center justify-center rounded-[1.25rem]">
                            <Image
                                src={service.logo}
                                alt={service.name}
                                width={service.width}
                                height={service.height}
                                className={`!h-${service.height} object-contain`}
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
    
}