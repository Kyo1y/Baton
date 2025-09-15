import requireIntegration from "@/lib/requireIntegration";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth"
import ServicePicker from "@/components/ServicePicker";

export default async function StepTwo({ params } : { params: Promise<{ dest: string }> }) {
    const session = await getServerSession(authOptions);
    const { dest } = await params;

    if (!session) redirect("/api/auth/signin?callbackUrl=%2Ftransfer");

    if (!session?.user?.id) {
        redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/transfer/${dest}`)}`);
    }

    const userId = session.user.id;
    console.log(dest, userId)
    await requireIntegration(userId, dest, `/transfer/${dest}`);
    return (
        <ServicePicker 
            title="Choose your destination service."
            subtitle="The service you will import INTO."
            exclude={[dest]}
            mode="dest"
            source={dest}
        />
    )
    
}