import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import requireIntegration from "@/lib/requireIntegration";
import { prisma } from "@/lib/prisma";
import TransferRunner from "@/components/TransferRunner";

export default async function TransferContent( {params}: { params: Promise<{ dest: string, content: string }> } ) {
    const session = await getServerSession(authOptions);
    const { dest } = await params;
    const { content } = await params;

    if (!session) redirect("/api/auth/signin?callbackUrl=%2Ftransfer");
    
    if (!session?.user?.id) {
        redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/transfer/${dest}/${content}/completion`)}`);
    }

    const userId = session.user.id;
    await requireIntegration(userId, content, `/transfer/${dest}/${content}/completion`);

    const newTransfer = await prisma.transferDraft.findFirst({
        where: { userId, source: dest, dest: content },
        orderBy: { createdAt: "desc"},
    })
    let transferResult;
    if (!newTransfer) {
        return (
        <div className="mx-auto max-w-md p-6 text-center">
            <h2 className="text-lg font-semibold">Uh-oh, something went wrong...</h2>
            <p className="mt-2 text-sm text-muted-foreground">
            We couldn't find a transfer to complete.
            </p>
            <a className="mt-4 inline-block underline" href={`/transfer/${dest}/${content}`}>
            Go back
            </a>
        </div>
        );
    }
    

    return (
        <TransferRunner transferDraftId={newTransfer.id} source={dest} dest={content} userId={userId} />
    )
}