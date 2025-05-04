import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatCurrency(amount: number | undefined | null, currency: string = 'USD'): string {
  if (amount === undefined || amount === null) {
    amount = 0; // Default to 0 if amount is undefined or null
  }
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
  });
}


export function formatDate(date: Date | string | number | undefined | null, formatString: string = 'PP'): string {
  if (!date) {
    return 'N/A'; // Or return an empty string or a placeholder
  }
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid Date';
  }
}
