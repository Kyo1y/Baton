import NavBar from "@/components/NavBar";
import { buildNav } from "@/nav.config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import './globals.css';
import Footer from "@/components/Footer";
import VantaDotsBackground from "@/components/vantaEffects/VantaDots";
import { TransitionProvider } from "@/components/TransitionProvider";
import { ThemeProvider } from "@/components/theme/theme-provider";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const links = buildNav({ isAuthed: !!session });

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <TransitionProvider>
            <div className="main-cont min-h-screen flex flex-col">
              <NavBar links={links} />
              <VantaDotsBackground>
                <div className="content-cont flex flex-col flex-1 justify-center">
                  {children}
                </div>
              </VantaDotsBackground>
              <Footer links={links}/>
            </div>
          
        </TransitionProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
