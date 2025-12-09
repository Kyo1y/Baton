import NavBar from "@/components/NavBar";
import { buildNav } from "@/nav.config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import './globals.css';
import Footer from "@/components/Footer";
import VantaDotsBackground from "@/components/vantaEffects/VantaDots";
import { TransitionProvider } from "@/components/TransitionProvider";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const links = buildNav({ isAuthed: !!session });

  return (
    <html lang="en">
      <body>
        <TransitionProvider>
          <NavBar links={links} />
          <VantaDotsBackground>
            {children}
          </VantaDotsBackground>
          <Footer />
        </TransitionProvider>

      </body>
    </html>
  );
}
