import ServicePicker from "@/components/ServicePicker"
import TransferStepOne from "@/components/TransferStepOne"

export default function StepOne() {
    return (
        <ServicePicker 
        title="Choose your source service."
        subtitle="The service you will export FROM."
        mode="source"
        />
    )
}
