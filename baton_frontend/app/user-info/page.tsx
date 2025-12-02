import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignOutBtn from "@/components/SignOutBtn";
import Image from "next/image"

export default async function UserInfo() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin?callbackUrl=/user-info");
    
    return (
        <>
            <div style={{display: "flex"}}>
                {session?.user?.image && (
                    <Image 
                    src={session.user.image}
                    width={48} height={48} 
                    style={{borderRadius: "50%"}} 
                    alt="Avatar"
                    />
                )}
                <h1>Welcome, {session?.user?.name}</h1>
                <SignOutBtn />
            </div>

        </>
    )
}