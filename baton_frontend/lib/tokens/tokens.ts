import "server-only";
import { awsGet, awsPost, awsPut, awsDelete} from "../aws/awsDb";
import { IntegrationToken } from "@prisma/client";

export async function findToken(userId: string, provider: string) {
    return await awsGet<IntegrationToken>(
        "/tokens/find",
        { userId, provider }
    );
};

export async function upsertToken(
    userId: string, provider: string, 
    accessToken: string, refreshToken: string, expiresAt: number
) {
    return await awsPost<{ message: string }>(
        "/tokens/upsert",
        { userId, provider, accessToken, refreshToken, expiresAt }
    )
}

export async function deleteToken(userId: string, provider: string) {
    return await awsDelete<{ message: string }>(
        "/tokens/delete",
        { userId, provider }
    )
}

export async function updateToken(
    userId: string, provider: string, 
    accessToken: string, refreshToken: string, expiresAt: number
)  {
    return await awsPut<{ message: string }>(
        "/tokens/update",
        { userId, provider, accessToken, refreshToken, expiresAt }
    )
}