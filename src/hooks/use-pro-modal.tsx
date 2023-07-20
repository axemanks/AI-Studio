// zustand store for the Pro Modal
// https://www.npmjs.com/package/zustand#typescript-usage

import { create } from "zustand";

interface useProModelStore {
    isOpen: boolean;
    onOpen: () => void; 
    onClose: () => void; 
}

// controls to open and close the Pro Modal
export const useProModel = create<useProModelStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }), // function to open
    onClose: () => set({ isOpen: false }), // close
}))