"use server";

import SignInBtn from "@/components/SignInBtn";
import SignOutBtn from "@/components/SignOutBtn";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import HomeIntro from "@/components/HomeIntro";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return (
      <>
      <div style={{display: "flex", flexDirection: "column"}}>
        <Link href="/user-info">User Info</Link>
        <SignOutBtn />
        <HomeIntro />
      </div>
      </>
    );
  }
  return (
    <>  
      <HomeIntro />
      <p>You are not signed in</p>
      <SignInBtn />
    </>
  );
}
