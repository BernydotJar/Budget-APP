'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/auth/auth-provider';
import type { Transaction, Category } from '@/types';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { TransactionListSkeleton } from './transaction-list-skeleton';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'; // Use next/navigation


// Function to fetch transactions and categories
const fetchTransactionsAndCategories = async (userId: string) => {
    if (!userId) return { transactions: [], categories: new Map() };

    const transactionsRef = collection(db, 'transactions');
    const categoriesRef = collection(db, 'categories');

    const transQuery = query(
        transactionsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc') // Order by date descending
    );
    const catQuery = query(categoriesRef, where('userId', '==', userId));

    const [transSnapshot, catSnapshot] = await Promise.all([
        getDocs(transQuery),
        getDocs(catQuery),
    ]);

    const transactions: Transaction[] = transSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, 'id'>),
    }));

    const categories = new Map<string, Category>();
    catSnapshot.forEach(doc => {
        categories.set(doc.id, { id: doc.id, ...(doc.data() as Omit<Category, 'id'>) });
    });

    // Add categoryName to transactions for easier display
    transactions.forEach(t => {
        t.categoryName = categories.get(t.categoryId)?.name || 'Uncategorized';
    });


    return { transactions, categories };
};

// Function to delete a transaction
const deleteTransaction = async (transactionId: string) => {
    const transactionRef = doc(db, 'transactions', transactionId);
    await deleteDoc(transactionRef);
};


export function TransactionList() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const router = useRouter();

    const { data, isLoading, error } = useQuery({
        queryKey: ['transactions', user?.uid],
        queryFn: () => fetchTransactionsAndCategories(user!.uid),
        enabled: !!user,
    });

    const mutation = useMutation({
      mutationFn: deleteTransaction,
      onSuccess: () => {
        // Invalidate and refetch transactions query after successful deletion
        queryClient.invalidateQueries({ queryKey: ['transactions', user?.uid] });
         queryClient.invalidateQueries({ queryKey: ['dashboardMetrics', user?.uid] });
         queryClient.invalidateQueries({ queryKey: ['expenseChartData', user?.uid] });
         queryClient.invalidateQueries({ queryKey: ['reportData', user?.uid] }); // Invalidate reports if needed
        toast({ title: "Transaction Deleted", description: "The transaction has been successfully removed." });
      },
       onError: (error) => {
          toast({
            variant: "destructive",
            title: "Deletion Failed",
            description: error.message || "Could not delete transaction. Please try again.",
          });
       }
    });

    const handleDelete = (transactionId: string) => {
       mutation.mutate(transactionId);
    };

     const handleEdit = (transactionId: string) => {
        router.push(`/transactions/edit/${transactionId}`);
    };


    if (isLoading) {
        return <TransactionListSkeleton />;
    }

    if (error) {
       return (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Loading Transactions</AlertTitle>
              <AlertDescription>
                Could not fetch transaction data. Please try again later.
              </AlertDescription>
            </Alert>
        )
    }

    const transactions = data?.transactions || [];


    return (
        <div className="rounded-lg border overflow-hidden">
        <Table>
            <TableCaption>A list of your recent transactions.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="text-right w-[120px]">Amount</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.length === 0 && (
                     <TableRow>
                         <TableCell colSpan={6} className="h-24 text-center">
                             No transactions found.
                         </TableCell>
                     </TableRow>
                )}
                {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                           {formatDate(transaction.date.toDate())} {/* Convert Timestamp to Date */}
                        </TableCell>
                        <TableCell>{transaction.categoryName}</TableCell>
                        <TableCell>{transaction.description || '-'}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.type === 'income' ? 'bg-accent/20 text-accent-foreground' : 'bg-destructive/20 text-destructive-foreground'
                            }`}>
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </span>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-accent' : 'text-destructive'}`}>
                           {transaction.type === 'expense' ? '-' : ''}{formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" aria-label="Delete transaction">
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the
                                      transaction record.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(transaction.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                     >
                                      Delete
                                     </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={() => handleEdit(transaction.id)} aria-label="Edit transaction">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    );
}
