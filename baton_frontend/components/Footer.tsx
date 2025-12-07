// components/Footer.tsx
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail } from "lucide-react";

type FooterLink = { label: string; href: string };
type FooterSection = { heading: string; links: FooterLink[] };

const SECTIONS: FooterSection[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Process", href: "/#process" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Status", href: "/status" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t z-100 bg-[#F8831E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="font-semibold">Baton</Link>
            <p className="mt-2 text-sm text-white">
              Move playlists between services in minutes.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link href="https://github.com/Kyo1y/Baton" aria-label="GitHub">
                <Github className="h-5 w-5 text-white" />
              </Link>
              <Link href="https:/linkedin.com/in/kyoly" aria-label="Linkedin">
                <Linkedin className="h-5 w-5 text-white" />
              </Link>
              <Link href="mailto:sadyrbek@union.edu" aria-label="Email">
                <Mail className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>

          {SECTIONS.map((sec) => (
            <div key={sec.heading} className="z-1">
              <h4 className="text-sm font-semibold">{sec.heading}</h4>
              <ul className="mt-3 space-y-2">
                {sec.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
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
          <p>© {new Date().getFullYear()} Baton. No rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
