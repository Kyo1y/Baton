import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import requireIntegration from "@/lib/requireIntegration";
import type { Provider } from "@prisma/client";
import { findTransferByUserSrcDest } from "@/lib/transfers/awsTransfers";
import TransferRunner from "@/components/TransferRunner";
import Link from "next/link";
import { cache } from "react"; // 1. Import React cache
import type { Metadata } from "next";

type Props = {
  params: Promise<{ dest: Provider; content: Provider }>;
};

// This ensures that even if we call DB twice, it only executes one DB query per page load.
const getCachedTransfer = cache(async (userId: string, source: Provider, realDest: Provider) => {
  return await findTransferByUserSrcDest(userId, source, realDest);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  const { dest: source, content: realDest } = await params;

    const sourceName= source === "spotify" ? "Spotify" : "YouTube Music";
    const destName= realDest === "spotify" ? "Spotify" : "YouTube Music";

  if (!session?.user?.id) {
    return { title: `${sourceName} -> ${destName}` };
  }

  const transfer = await getCachedTransfer(session.user.id, source, realDest);

  if (transfer) {
    return { title: `${sourceName} -> ${destName}: ${transfer.srcPlaylistName} -> ${transfer.destPlaylistName}` };
  }

  return { title: `${sourceName} -> ${destName}` };
}

export default async function TransferContent({ params }: Props ) {
    const session = await getServerSession(authOptions);
    const { dest, content } = await params;
    const source = dest;
    const realDest = content

    if (!session) redirect("/api/auth/signin?callbackUrl=%2Ftransfer");
    
    if (!session?.user?.id) {
        redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/transfer/${dest}/${content}/completion`)}`);
    }

    const userId = session.user.id;
    await requireIntegration(userId, content, `/transfer/${dest}/${content}/completion`);

    const newTransfer = await getCachedTransfer(userId, source, realDest);
    if (!newTransfer) {
        return (
        <div className="mx-auto max-w-md p-6 text-center">
            <h2 className="text-lg font-semibold">Uh-oh, something went wrong...</h2>
            <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find a transfer to complete.
            </p>
            <Link className="mt-4 inline-block underline" href={`/transfer/${dest}/${content}`}>
                Go back
            </Link>
        </div>
        );
    }
    

    return (
        <TransferRunner transferDraftId={newTransfer.id} dest={content} userId={userId} />
    )
}