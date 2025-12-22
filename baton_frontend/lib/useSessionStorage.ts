"use client";
import { useEffect, useState, useCallback } from "react";

type Stored<T> = { v: T; exp?: number }; // v=value, exp=epoch ms when it expires

export function useSessionStorage<T>(key: string, initial: T, ttlMs: number,) {
    const read = useCallback((): T => {
        if (typeof window === "undefined") return initial;
        try {
            const raw = sessionStorage.getItem(key);
            if (!raw) return initial;
            const parsed = JSON.parse(raw) as Stored<T>;
            if (parsed && typeof parsed === "object") {
                if (parsed.exp && Date.now() > parsed.exp) {
                    sessionStorage.removeItem(key);
                    return initial;
                }
                return parsed.v as T;
            }
            return JSON.parse(raw) as T;
        } 
        catch {
            return initial;
        }
    }, [key, initial]);

    const [value, setValue] = useState<T>(read);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const payload: Stored<T> = { v: value };
        if (ttlMs && Number.isFinite(ttlMs)) {
            payload.exp = Date.now() + ttlMs;
        }
        
        sessionStorage.setItem(key, JSON.stringify(payload));
    }, [key, value, ttlMs]);

    const remove = useCallback(() => {
        if (typeof window !== "undefined") sessionStorage.removeItem(key);
        setValue(initial);
    }, [key, initial]);

    const setWithTTL = useCallback(
        (next: T, ttl: number) => {
        setValue(next);
        if (typeof window !== "undefined") {
                const payload: Stored<T> = { v: next, exp: Date.now() + ttl };
                sessionStorage.setItem(key, JSON.stringify(payload));
            }
        },
        [key]
    );

    return [value, setValue, remove, setWithTTL] as const;
}
