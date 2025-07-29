import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getImageUrl(url: string) {
  const imageUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_BASE_URL}${url.replace('/api/v1', '')}`
  return imageUrl
}