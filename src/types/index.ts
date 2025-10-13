import type { Timestamp } from 'firebase/firestore';

export interface Transaction {
  id: string;
  userId: string;
  date: Timestamp; // Use Firestore Timestamp for date handling
  amount: number;
  type: 'income' | 'expense';
  categoryId: string; // Store category ID
  categoryName?: string; // Optional: denormalize name for easier display
  account?: string; // Optional: If you track accounts
  description?: string; // Optional field
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color?: string; // Optional color for charts/UI
}
