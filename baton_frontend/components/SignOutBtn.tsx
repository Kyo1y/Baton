"use client";

import { logout } from "@/lib/auth-client";

export default function SignInBtn() {
    return (
        <>
            <button onClick={() => logout()} style={{cursor: "pointer", width: "100px"}}>Sign out</button>
        </>
    )
}