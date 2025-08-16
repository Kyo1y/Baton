"use client";

import { signIn, signOut } from "next-auth/react";

export const loginGithub = async () => {
    await signIn("github", { callbackUrl: "/"})
}

export const loginGoogle = async () => {
    await signIn("google", { callbackUrl: "/"})
}

export const logout = async () => {
    await signOut({ callbackUrl: "/" })
}