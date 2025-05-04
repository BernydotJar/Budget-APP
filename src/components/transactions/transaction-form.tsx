'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';


// Zod schema for form validation
const transactionFormSchema = z.object({
    date: z.date({ required_error: "A date is required." }),
    amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
    type: z.enum(['income', 'expense'], { required_error: "Please select a transaction type." }),
    categoryId: z.string().min(1, { message: "Please select a category." }),
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
         // Make sure to convert Firestore Timestamp back to JS Date for the form
        const data = docSnap.data() as Omit<Transaction, 'id' | 'date'> & { date: Timestamp };
        return { id: docSnap.id, ...data, date: data.date.toDate() } as Transaction;
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
            if (!user) throw new Error("User not authenticated.");

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
                title: isEditMode ? "Transaction Updated" : "Transaction Added",
                description: `Successfully ${isEditMode ? 'updated' : 'added'} the transaction.`,
            });
            router.push('/transactions'); // Redirect back to the list
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: isEditMode ? "Update Failed" : "Add Failed",
                description: error.message || "An error occurred. Please try again.",
            });
        },
    });

    const onSubmit = (data: TransactionFormValues) => {
        mutation.mutate(data);
    };


    // Loading state for initial data fetching in edit mode or category loading
    if ((isEditMode && isLoadingTransaction) || isLoadingCategories) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                   <Skeleton className="h-6 w-3/4 mb-2" />
                   <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                 <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                 </CardContent>
                 <CardFooter>
                     <Skeleton className="h-10 w-24" />
                 </CardFooter>
             </Card>
        )
    }

     // Handle errors fetching initial data
    if (categoriesError || (isEditMode && transactionError)) {
        // Render an error message or component
         return <p className="text-destructive">Error loading data. Please try refreshing the page.</p>;
    }


    return (
         <Card className="w-full max-w-2xl mx-auto">
             <CardHeader>
                 <CardTitle>{isEditMode ? 'Edit Transaction' : 'Add New Transaction'}</CardTitle>
                 <CardDescription>
                    {isEditMode ? 'Update the details of your transaction.' : 'Enter the details for your new income or expense.'}
                 </CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Date Picker */}
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
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
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
                                                disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Amount */}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type (Income/Expense) */}
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
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                         {/* Category Dropdown */}
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {isLoadingCategories ? (
                                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                                         ) : categories.length === 0 ? (
                                              <SelectItem value="no-categories" disabled>No categories found. Add one!</SelectItem>
                                         ) : (
                                            categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                                </SelectItem>
                                            ))
                                         )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>


                         {/* Account (Optional) */}
                        <FormField
                            control={form.control}
                            name="account"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Checking, Credit Card" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description (Optional) */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Add a note..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditMode ? 'Update Transaction' : 'Add Transaction'}
                        </Button>
                          {mutation.isError && (
                            <p className="text-sm font-medium text-destructive">
                              {mutation.error instanceof Error ? mutation.error.message : 'An unknown error occurred'}
                            </p>
                         )}
                    </form>
                </Form>
            </CardContent>
         </Card>
    );
}
