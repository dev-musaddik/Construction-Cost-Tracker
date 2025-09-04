// utils.js or helpers.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
 export const fmtMoney = (n) => {
  // Use Intl.NumberFormat for formatting, but manually replace BDT with ৳
  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "BDT", // We're using BDT to handle thousands separator and decimals
  }).format(Number(n || 0));

  // Replace 'BDT' with '৳' and return
  return formatted.replace('BDT', '৳');
};