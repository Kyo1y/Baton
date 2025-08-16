import auth, { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import Image from "next/image"

export default async function UserInfo() {
    const session = await getServerSession(authOptions);
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

            </div>

        </>
    )
}