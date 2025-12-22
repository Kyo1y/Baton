import ServicePicker from "@/components/ServicePicker"

export default function StepOne() {
    return (
        
        <ServicePicker 
        title="Choose your source service."
        subtitle="The service you will export FROM."
        mode="source"
        />
    )
}
