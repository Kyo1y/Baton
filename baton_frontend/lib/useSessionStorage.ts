"use client";

import { useEffect, useState } from "react";

export function useSessionStorage<T>(key: string, initial:T) {
    const [state, setState] = useState<T>(() => {
        if (typeof window === "undefined") return initial;
        const raw = sessionStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : initial;
    })

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState] as const;
}