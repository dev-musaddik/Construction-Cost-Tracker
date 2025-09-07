// utils.js or helpers.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const fmtMoney = (n) => {
  // Ensure that the number is an integer before formatting
  const roundedValue = Math.round(Number(n || 0));

  // Use Intl.NumberFormat for formatting, but manually replace BDT with ৳
  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "BDT", // We're using BDT to handle thousands separator
    minimumFractionDigits: 0, // Ensure no decimal points are displayed
    maximumFractionDigits: 0, // Ensure no decimal points are displayed
  }).format(roundedValue);

  // Replace 'BDT' with '৳' and return
  return formatted.replace('BDT', '৳');
};
