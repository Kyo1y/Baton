import "server-only";
import { awsGet } from "../aws/awsDb";

export const getAuthMethod = async(userId: string): Promise<string> => {
    const authMethod = await awsGet<{ authProvider: string }>(
        "/auth/provider",
        { userId }
    )
    return authMethod.authProvider;
}