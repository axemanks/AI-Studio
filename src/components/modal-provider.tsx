// Modal provider
"use client"

import { useEffect, useState } from "react";
import { ProModal } from "./ProModal";

export const ModalProvider = () => {
    // Trick for hydration errors
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if(!isMounted){
        return null};


    return (
        <>
        <ProModal />
        </>
    )
};
