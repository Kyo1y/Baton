"use client";

import { login } from "@/lib/actions/auth";

export default function SignInBtn() {
    return (
        <>
            <p>Sign in with github</p>
            <button onClick={() => login()}>Sign in</button>
        </>
    )
}