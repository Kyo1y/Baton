"use server";

import SignInBtn from "@/components/SignInBtn";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session)
  return (
    <>
      <SignInBtn />
    </>
  );
}
