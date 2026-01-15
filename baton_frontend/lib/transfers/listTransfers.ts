import { findTransferHistory } from "./awsTransfers";

export default async function listTransfers(userId: string, cursor?: string) {
    const res = await findTransferHistory(userId, cursor);
    if (!res) {
        throw new Error("Could not find transfer history");
    }
    return res.obj;
}