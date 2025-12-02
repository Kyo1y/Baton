"use server";

import HomeIntro from "@/components/HomeIntro";
import Process from "@/components/Process";
import Prompt from "@/components/Prompt";
import WhyBaton from "@/components/WhyBaton";

export default async function Home() {
  return (
    <>  
      {/* <div
      className="z-2"
      > */}
        <HomeIntro />
        <WhyBaton />
        <Process />
        <Prompt />
      {/* </div> */}
        
      
    </>
  );
}
