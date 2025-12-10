"use client";

import { logout } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function SignInBtn() {
    return (
        <>
            <Button onClick={() => logout()} className="cursor-pointer z-2">
                <LogOut />
                Sign out
            </Button>
        </>
    )
}