import ServicePicker from "@/components/ServicePicker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transfer", 
};

export default function StepOne() {
    return (
        
        <ServicePicker 
        title="Choose your source service."
        subtitle="The service you will export FROM."
        mode="source"
        />
    )
}
