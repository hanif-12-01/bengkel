import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value: number): string {
  return "Rp" + Math.round(value).toLocaleString("id-ID");
}

export function formatKwh(value: number): string {
  return value.toLocaleString("id-ID", { maximumFractionDigits: 0 }) + " kWh";
}