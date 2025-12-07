import { prisma } from "@/lib/prisma";

export const getAuthMethod = async(userId: string): Promise<string> => {
    const authMethod = await prisma.account.findFirst({
        where: { userId: userId},
        select: { provider: true}
    })
    return authMethod!.provider;

}