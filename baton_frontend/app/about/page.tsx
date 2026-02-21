"use client"
import About from "@/components/About"
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About", 
};
export default function AboutPage() {
    return (
        <About />
    )
}