// tailwind merge - Utility function to efficiently merge Tailwind CSS classes in JS without style conflicts.
// https://www.npmjs.com/package/tailwind-merge

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
