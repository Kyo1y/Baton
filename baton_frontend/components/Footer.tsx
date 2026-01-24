"use client"

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail } from "lucide-react";
import type { NavLink } from "@/nav.config";
import { usePageTransition } from "./TransitionProvider";


type FooterLink = { label: string; href: string };
type FooterSection = { heading: string; links: FooterLink[] };

const BASE_SECTIONS: FooterSection[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Process", href: "/#process" },
    ],
  },
  {
    heading: "Project",
    links: [
    ],
  },
  {
    heading: "Support",
    links: [
    ],
  },
];

export default function Footer({ links }: {links: NavLink[]}) {
  const sections = BASE_SECTIONS.map((s) => {
    const category = s.heading.trim().toLowerCase();

    const dynamicLinks = links
                        .filter((l) => l.category?.toLowerCase() === category)
                        .map((l) => ({ label: l.label, href: l.href }));
    return {
      ...s,
      links: [...s.links, ...dynamicLinks]
    };
  })
  const { startTransition } = usePageTransition();
  
  return (
    <footer className="relative border-t z-10 bg-[#F8831E] justify-self-end w-[100%]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="font-semibold text-white"
              onClick={(e) => {
              e.preventDefault();
              startTransition("/");
            }}
            >
              Baton
            </Link>
            <p className="mt-2 text-sm text-white">
              Move playlists between services in minutes.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link href="https://github.com/Kyo1y/Baton" aria-label="GitHub">
                <Github className="h-5 w-5 text-white" />
              </Link>
              <Link href="https://www.linkedin.com/in/kyoly" aria-label="Linkedin">
                <Linkedin className="h-5 w-5 text-white" />
              </Link>
              <Link href="mailto:sadyrbekov.kairat@gmail.com" aria-label="Email">
                <Mail className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>

          {sections.map((sec) => (
            <div key={sec.heading} className="z-1">
              <h4 className="text-sm text-white font-semibold">{sec.heading}</h4>
              <ul className="mt-3 space-y-2">
                {sec.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={(e) => {
                          e.preventDefault();
                          startTransition(l.href);
                      }}
                      className="text-sm text-white hover:underline hover:decoration-dotted"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />
        <div className="flex flex-col-reverse items-center justify-between gap-2 py-6 text-sm text-white md:flex-row">
          <p>© {new Date().getFullYear()} Baton. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" 
              onClick={(e) => {
              e.preventDefault();
              startTransition("/terms");
            }}>
            Terms
            </Link>
            <Link href="/privacy"
              onClick={(e) => {
              e.preventDefault();
              startTransition("/privacy");
            }}
            >
            Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
