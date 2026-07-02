'use client';

import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
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
import { AlertCircle, ListFilter, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type TransactionTypeFilter = 'all' | 'income' | 'expense';

// Function to fetch transactions and categories
const fetchTransactionsAndCategories = async (userId: string) => {
    if (!userId) return { transactions: [], categories: new Map() };

    const transactionsRef = collection(db, 'transactions');
    const categoriesRef = collection(db, 'categories');

    const transQuery = query(
        transactionsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc')
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

const filterOptions: Array<{ value: TransactionTypeFilter; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expenses' },
];

export function TransactionList() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const router = useRouter();
    const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('all');

    const { data, isLoading, error } = useQuery({
        queryKey: ['transactions', user?.uid],
        queryFn: () => fetchTransactionsAndCategories(user!.uid),
        enabled: !!user,
    });

    const mutation = useMutation({
      mutationFn: deleteTransaction,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions', user?.uid] });
        queryClient.invalidateQueries({ queryKey: ['dashboardMetrics', user?.uid] });
        queryClient.invalidateQueries({ queryKey: ['expenseChartData', user?.uid] });
        queryClient.invalidateQueries({ queryKey: ['reportData', user?.uid] });
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
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Transaction evidence unavailable</AlertTitle>
              <AlertDescription>
                BudgetFlow could not verify your transaction data, so no ledger rows are shown. Try again once the data source is available.
              </AlertDescription>
            </Alert>
        )
    }

    const transactions = data?.transactions || [];
    const filteredTransactions = useMemo(() => {
        if (typeFilter === 'all') return transactions;
        return transactions.filter((transaction) => transaction.type === typeFilter);
    }, [transactions, typeFilter]);
    const incomeCount = transactions.filter((transaction) => transaction.type === 'income').length;
    const expenseCount = transactions.filter((transaction) => transaction.type === 'expense').length;

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                    <div className="rounded-full bg-muted p-2">
                        <ListFilter className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium">Transaction evidence</p>
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredTransactions.length} of {transactions.length} saved records. Filters are applied to already loaded evidence.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map((option) => (
                        <Button
                            key={option.value}
                            type="button"
                            variant={typeFilter === option.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTypeFilter(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
                    <div className="mb-4 rounded-full bg-muted p-3">
                        <PlusCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold">No transactions recorded yet</h2>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        Your ledger has no income or expense evidence to show. Add your first transaction to start tracking cash flow.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/transactions/new">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
                        </Link>
                    </Button>
                </div>
            ) : filteredTransactions.length === 0 ? (
                <div className="rounded-lg border border-dashed bg-card p-8 text-center">
                    <h2 className="text-lg font-semibold">No matching transactions</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        There are {incomeCount} income records and {expenseCount} expense records loaded, but none match the selected filter.
                    </p>
                    <Button className="mt-4" variant="outline" onClick={() => setTypeFilter('all')}>
                        Show all transactions
                    </Button>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border bg-card">
                    <Table>
                        <TableCaption>Verified transaction records ordered newest first.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[110px]">Type</TableHead>
                                <TableHead className="w-[130px] text-right">Amount</TableHead>
                                <TableHead className="w-[110px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((transaction) => {
                                const isIncome = transaction.type === 'income';
                                return (
                                    <TableRow key={transaction.id}>
                                        <TableCell className="font-medium">
                                            {formatDate(transaction.date.toDate())}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{transaction.categoryName}</div>
                                            <div className="text-xs text-muted-foreground">Saved category evidence</div>
                                        </TableCell>
                                        <TableCell className="max-w-[280px] truncate text-muted-foreground">
                                            {transaction.description || 'No description provided'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                isIncome ? 'bg-accent/20 text-accent-foreground' : 'bg-destructive/20 text-destructive-foreground'
                                            }`}>
                                                {isIncome ? 'Income' : 'Expense'}
                                            </span>
                                        </TableCell>
                                        <TableCell className={`text-right font-semibold ${isIncome ? 'text-accent' : 'text-destructive'}`}>
                                            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-1">
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
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
