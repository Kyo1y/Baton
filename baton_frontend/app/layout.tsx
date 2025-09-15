import NavBar from "@/components/NavBar";
import { buildNav } from "@/nav.config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import './globals.css';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const links = buildNav({ isAuthed: !!session });

  return (
    <html lang="en">
      <body>
        <NavBar links={links} />
        {children}
      </body>
    </html>
  );
}
