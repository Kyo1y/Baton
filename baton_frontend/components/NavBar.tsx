"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle } from "@/components/ui/sheet"
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink
} from "@/components/ui/navigation-menu"
import type { NavLink } from "@/nav.config"
import { BrandLogo } from "@/components/Logo";
import { LogoMark } from "@/components/Logo"
import { loginGoogle } from "@/lib/auth-client";
import VantaFogBackground from "./vantaEffects/VantaFog"

export default function NavBar({links}: {links: NavLink[]}) {
  const pathname = usePathname()
  const isAuthed = links.some(i => i.label.toLowerCase() === "dashboard");
  return (
      <header className="sticky top-0 z-40 bg-background/40
            backdrop-blur-md shadow-md">

      {/* <VantaFogBackground> */}


      <div className="mx-auto flex h-16 max-w-9xl items-center justify-between px-4">
        
        <div
          className="flex gap-1 items-center"
        >
          <BrandLogo />
          <Link
          href={"/"}
          >
            <h1 
            className="text-balance font-bold tracking-tight
                    text-4xl sm:text-3xl md:text-4xl text-[#EB7107]"
          >
            <span className="inline-block [transform:skewX(-17deg)]">B</span>aton
          </h1>
          </Link>
          
        </div>
        
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              {links
              .filter(l => l.label.trim().toLowerCase() !== "dashboard")
              .map(l => l.label == "Sign in" ? (
                <NavigationMenuItem key={l.href}>
                  <NavigationMenuLink asChild>
                    <button
                      type="button"
                      className="px-2 py-1 text-[1.03rem] cursor-pointer text-white bg-[#F8831E]"
                      onClick={(e) => {
                        e.preventDefault();
                        void loginGoogle();
                      }}
                    >
                      {l.label}
                    </button>
                  </NavigationMenuLink>
                </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={l.href}>
                  <NavigationMenuLink
                    href={l.href}
                    data-active={pathname === l.href}
                    className="px-2 py-1 text-lg data-[active=true]:font-medium"
                  >
                    {l.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
            ))}
            </NavigationMenuList>
          </NavigationMenu>
          {isAuthed && <Button asChild className="bg-[#F8831E] hover:bg-[#EB7107]"><Link href="/dashboard">Dashboard</Link></Button>}

        </div>

        {/* Mobile */}
        <div className="md:hidden" aria-describedby="sidebar">
          <Sheet >
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menu" className="p-1">☰</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 [&>button]:p-1 [&>button]:translate-x-[-2]" dialong-title="sidebar" >
              <SheetTitle className="sr-only">menu</SheetTitle>
              {/* Background image */}
              <div className="absolute translate-x-30 translate-y-10 inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-80 w-80 opacity-15">
                  <LogoMark className="h-full w-full text-foreground object-contain group-hover:[&>path]:fill-[#F8831E]" />
                </div>
              </div>
              <nav className="mt-10 grid z-10">
                {links
                .map(l => l.label == "Sign in" ? (
                  <button
                  key="signin"
                  className="border-1 rounded-md py-1 ml-3 flex px-3 text-black w-[90%] justify-center "
                  onClick={(e) => {
                    e.preventDefault();
                    void loginGoogle();
                  }}>
                    Google
                  </button>
                ) : (
                  <SheetClose asChild
                  key={l.href}
                  >
                    <Link 
                    href={l.href}
                    data-active={pathname === l.href}
                    className="rounded data-[active=true]:font-bold px-3 py-2 hover:bg-accent">
                      {l.label}
                    </Link>
                  </SheetClose>
                  ))
                }
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
      {/* </VantaFogBackground> */}
    </header>

  )
}
