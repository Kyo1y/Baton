import NavBar from "@/components/NavBar";
import { buildNav } from "@/nav.config";
import { getServerSession } from "next-auth";
import './globals.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
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
