import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import requireIntegration from "@/lib/requireIntegration";
import type { Provider } from "@prisma/client";
import { findTransferByUserSrcDest } from "@/lib/transfers/awsTransfers";
import TransferRunner from "@/components/TransferRunner";
import Link from "next/link";

export default async function TransferContent( {params}: { params: { dest: Provider, content: Provider } } ) {
    const session = await getServerSession(authOptions);
    const { dest, content } = params;
    const source = dest;
    const realDest = content

    if (!session) redirect("/api/auth/signin?callbackUrl=%2Ftransfer");
    
    if (!session?.user?.id) {
        redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/transfer/${dest}/${content}/completion`)}`);
    }

    const userId = session.user.id;
    await requireIntegration(userId, content, `/transfer/${dest}/${content}/completion`);

    const newTransfer = await findTransferByUserSrcDest(userId, source, realDest);
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