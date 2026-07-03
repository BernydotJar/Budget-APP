'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, addDoc, doc, updateDoc, getDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/auth/auth-provider';
import type { Transaction, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertCircle, CalendarIcon, ClipboardList, Loader2, Save, ShieldCheck } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryCombobox } from '@/components/categories/category-combobox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Zod schema for form validation
const transactionFormSchema = z.object({
  date: z.date({ required_error: 'A date is required.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number.' }),
  type: z.enum(['income', 'expense'], { required_error: 'Please select a transaction type.' }),
  categoryId: z.string().min(1, { message: 'Please select a category.' }),
  account: z.string().optional(),
  description: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  transactionId?: string; // Optional: For editing existing transaction
}

// Fetch categories for the dropdown
const fetchCategories = async (userId: string): Promise<Category[]> => {
  if (!userId) return [];
  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Category, 'id'>) }));
};

// Fetch existing transaction data for editing
const fetchTransactionData = async (transactionId: string): Promise<Transaction | null> => {
  const docRef = doc(db, 'transactions', transactionId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as Omit<Transaction, 'id' | 'date'> & { date: Timestamp };
    return { id: docSnap.id, ...data } as Transaction;
  } else {
    return null;
  }
};

export function TransactionForm({ transactionId }: TransactionFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isEditMode = !!transactionId;

  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories, error: categoriesError } = useQuery<Category[]>({
    queryKey: ['categories', user?.uid],
    queryFn: () => fetchCategories(user!.uid),
    enabled: !!user,
  });

  // Fetch transaction data if in edit mode
  const { data: existingTransaction, isLoading: isLoadingTransaction, error: transactionError } = useQuery<Transaction | null>({
    queryKey: ['transaction', transactionId],
    queryFn: () => fetchTransactionData(transactionId!),
    enabled: isEditMode && !!user, // Only fetch if in edit mode and user exists
  });

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      date: new Date(),
      amount: 0,
      type: 'expense',
      categoryId: '',
      account: '',
      description: '',
    },
  });

  // Populate form with existing data when editing
  useEffect(() => {
    if (isEditMode && existingTransaction) {
      form.reset({
        date: existingTransaction.date instanceof Timestamp ? existingTransaction.date.toDate() : new Date(existingTransaction.date),
        amount: existingTransaction.amount,
        type: existingTransaction.type,
        categoryId: existingTransaction.categoryId,
        account: existingTransaction.account || '',
        description: existingTransaction.description || '',
      });
    }
  }, [isEditMode, existingTransaction, form]);

  const mutation = useMutation({
    mutationFn: async (data: TransactionFormValues) => {
      if (!user) throw new Error('User not authenticated.');

      // Convert Date back to Firestore Timestamp before saving
      const transactionData = {
        ...data,
        userId: user.uid,
        date: Timestamp.fromDate(data.date), // Convert JS Date to Timestamp
      };

      if (isEditMode) {
        // Update existing document
        const docRef = doc(db, 'transactions', transactionId!);
        await updateDoc(docRef, transactionData);
      } else {
        // Add new document
        await addDoc(collection(db, 'transactions'), transactionData);
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['expenseChartData', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['reportData', user?.uid] }); // If reports depend on transactions
      toast({
        title: isEditMode ? 'Transaction Updated' : 'Transaction Added',
        description: `Successfully ${isEditMode ? 'updated' : 'added'} the transaction.`,
      });
      router.push('/transactions'); // Redirect back to the list
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: isEditMode ? 'Update Failed' : 'Add Failed',
        description: error.message || 'An error occurred. Please try again.',
      });
    },
  });

  const onSubmit = (data: TransactionFormValues) => {
    mutation.mutate(data);
  };

  const modeLabel = isEditMode ? 'Edit transaction' : 'New transaction';
  const actionLabel = isEditMode ? 'Update Transaction' : 'Add Transaction';

  // Loading state for initial data fetching in edit mode or category loading
  if ((isEditMode && isLoadingTransaction) || isLoadingCategories) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-36" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Handle errors fetching initial data
  if (categoriesError || (isEditMode && transactionError)) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Transaction form could not be loaded</AlertTitle>
        <AlertDescription>
          The app could not load the required transaction or category records. No data was changed; refresh and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-secondary p-2 text-secondary-foreground">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <CardDescription>{modeLabel}</CardDescription>
              <CardTitle className="text-3xl">{isEditMode ? 'Edit Transaction' : 'Add New Transaction'}</CardTitle>
              <p className="max-w-3xl text-sm text-muted-foreground">
                {isEditMode
                  ? 'Update the transaction details that feed your ledger, dashboard, and reports.'
                  : 'Record income or expense evidence once so the rest of the app can calculate from the same source.'}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Record type</CardDescription>
            <CardTitle className="text-2xl">Income / Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The type controls how the amount is interpreted in totals.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Used by</CardDescription>
            <CardTitle className="text-2xl">3 views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Transactions, dashboard metrics, and reports update after save.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Save behavior</CardDescription>
            <CardTitle className="text-2xl">Redirects to list</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              After save, related queries refresh and you return to Transactions.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-secondary p-2 text-secondary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>
                Required fields define the ledger entry. Optional context improves auditability later.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <section className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Core details</h3>
                  <p className="text-sm text-muted-foreground">
                    These fields determine when the transaction happened, how much it affects totals, and where it is grouped.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  formatDate(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>Used for period filters and report grouping.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Enter a positive value; the type determines income or expense impact.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Income increases totals; expense reduces net results.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Category</FormLabel>
                        <CategoryCombobox
                          categories={categories}
                          isLoading={isLoadingCategories}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormDescription>Categories keep dashboards and reports easier to interpret.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section className="space-y-4 border-t pt-6">
                <div>
                  <h3 className="text-sm font-medium">Optional context</h3>
                  <p className="text-sm text-muted-foreground">
                    Add source and note details when they help you verify the entry later.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="account"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Checking, Credit Card" {...field} />
                      </FormControl>
                      <FormDescription>Useful when the same category appears across multiple accounts.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add a note..." {...field} />
                      </FormControl>
                      <FormDescription>Use a short note for context, receipts, or reconciliation details.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Saving will refresh transactions, dashboard metrics, charts, and reports.
                </p>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {mutation.isPending ? 'Saving...' : actionLabel}
                </Button>
              </div>

              {mutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{isEditMode ? 'Update failed' : 'Add failed'}</AlertTitle>
                  <AlertDescription>
                    {mutation.error instanceof Error ? mutation.error.message : 'An unknown error occurred'}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
