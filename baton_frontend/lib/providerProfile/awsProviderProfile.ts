import "server-only";
import { awsGet, awsPost, awsDelete } from "../aws/awsDb";
import { ProviderProfile } from "@prisma/client";

export async function findProviderProfile(userId: string, provider: string) {
    return await awsGet<ProviderProfile>(
        "/providerProfile",
        { userId, provider }
    );
};

export async function createProviderProfile(
    userId: string, provider: string, providerId: string,
    username: string, image: string,
) {
    return await awsPost<ProviderProfile>(
        "/providerProfile",
        { userId, provider, providerId, username, image}
    )
}

export async function deleteProviderProfile(userId: string, provider: string) {
    return await awsDelete<ProviderProfile>(
        "/providerProfile",
        { userId, provider }
    )
}