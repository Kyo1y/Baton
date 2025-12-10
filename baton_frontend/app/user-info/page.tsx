import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Profile from "@/components/Profile";

export default async function UserInfo() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin?callbackUrl=/user-info");
    
    return (
        <Profile avatar={session.user.image ?? ""} username={session.user.name ?? ""} />
    )
}