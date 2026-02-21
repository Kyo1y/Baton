import Dashboard from "@/components/Dashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { getConnections } from "@/lib/data/dashboard";
import { disconnectService } from "../(actions)/dashboard/disconnectService";
import listTransfers from "@/lib/transfers/listTransfers";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard", 
};

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin?callbackUrl=%2Ftransfer");

    if (!session?.user?.id) {
        redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/dashboard`)}`);
    }

    const userId = session.user.id;

    const connections = await getConnections(userId);

    const { items, nextCursorCreatedAt } = await listTransfers(userId);
    return (
        <Dashboard services={connections} transfers={items} initialCursor={nextCursorCreatedAt} userId={userId} disconnectService={disconnectService}/>
    )
}