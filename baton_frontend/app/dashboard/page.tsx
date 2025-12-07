import Dashboard from "@/components/Dashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { getConnections, getRecentTransfers } from "@/lib/data/dashboard";
import { disconnectService } from "../(actions)/disconnectService";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin?callbackUrl=%2Ftransfer");

    if (!session?.user?.id) {
        redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/dashboard`)}`);
    }
    const userId = session.user.id;

    const [connections, transfers] = await Promise.all([
        getConnections(userId),
        getRecentTransfers(userId),
    ])
    return (
        <Dashboard services={connections} transfers={transfers} userId={userId} disconnectService={disconnectService}/>
    )
}