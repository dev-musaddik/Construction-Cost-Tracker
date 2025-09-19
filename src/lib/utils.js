// utils.js or helpers.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const fmtMoney = (n) => {
  // Ensure that the number is an integer before formatting
  const roundedValue = Math.round(Number(n || 0));

  // Format the number to use commas in the desired position
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    maximumFractionDigits: 0, // Ensure no decimal points are displayed
  }).format(roundedValue);

  // Manually append the BDT currency symbol after the number
  return '৳ ' + formatted;
};

// YYYY-MM-DD in local time (for <input type="date"/>)
export const ymdLocal = (d = new Date()) => {
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
};

// Format currency in user's locale, fallback USD if not specified

export const monthLabel = (month, year) => {
  if (!month || !year) return "Unknown";
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
};
