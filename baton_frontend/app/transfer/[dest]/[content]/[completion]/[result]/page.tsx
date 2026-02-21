import type { Metadata } from "next";
import ResultClient from "./ResultClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
      title: `Transfer Finished`, 
  };
}

export default async function ResultPage() {
    return <ResultClient />;
}