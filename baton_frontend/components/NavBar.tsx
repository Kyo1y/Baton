"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink
} from "@/components/ui/navigation-menu"
import type { NavLink } from "@/nav.config"
import { BrandLogo } from "@/components/Logo";

export default function NavBar({links}: {links: NavLink[]}) {
  const pathname = usePathname()
  const isAuthed = links.some(i => i.label.toLowerCase() === "dashboard");

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-9xl items-center justify-between px-4">
        <BrandLogo />
        
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              {links.map(l => 
                <NavigationMenuItem key={l.href}>
                  <NavigationMenuLink
                    href={l.href}
                    data-active={pathname === l.href}
                    className="px-2 py-1 text-lg data-[active=true]:font-medium"
                  >
                    {l.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
          <Button asChild className="bg-[#F8831E] hover:bg-[#EB7107]"><Link href="/dashboard">Dashboard</Link></Button>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menu">☰</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="mt-6 grid gap-2">
                {links.map(l => (
                  <Link key={l.href} href={l.href} className="rounded px-3 py-2 hover:bg-accent">
                    {l.label}
                  </Link>
                ))}
                <Button asChild className="mt-2"><Link href="/dashboard">Dashboard</Link></Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
