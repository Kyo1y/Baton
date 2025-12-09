import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import TransferStepper from "@/components/TransferSteps";
import WithMobileVantaTrunk from "@/components/vantaEffects/MobileVantaTrunk";

export default async function TransferLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=%2Ftransfer");
  }
  return <>
    {/* <WithMobileVantaTrunk> */}
      <TransferStepper />
      {children}
    {/* </WithMobileVantaTrunk> */}
    
  
  </>;
}