// Crisp support chat

"use client"

import { useEffect } from "react"

import { Crisp } from "crisp-sdk-web"

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("ee2b5ce3-a90e-4077-93ce-d765fa3e3e80")
    }, []);

    return null;
}