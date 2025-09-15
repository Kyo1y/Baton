import crypto from "crypto";


function normalizeString(s: string): string {
    return s
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC");
}

function normalizeArray(arr: string[]): string[] {
    return arr.map(s => normalizeString(s)).filter(s => s.length > 0);
}

function normalizeCombo(s: string, arr: string[], n: number): string {
    const normString = normalizeString(s);
    const normArr = normalizeArray(arr);
    return JSON.stringify({a: normString, b: normArr, n});
}

export default function makeAltKey(a: string, b: string[], n: number): string {
    const combo = normalizeCombo(a, b, n);
    const altKey = crypto.createHash("sha256").update(combo, "utf8").digest("hex");
    return altKey.slice(0, 16 * 2)
}