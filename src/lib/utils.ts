// tailwind merge - Utility function to efficiently merge Tailwind CSS classes in JS without style conflicts.
// https://www.npmjs.com/package/tailwind-merge

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// function to get the absolute url 
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}