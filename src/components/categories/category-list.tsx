'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/auth/auth-provider';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { CategoryListSkeleton } from './category-list-skeleton';
import { useToast } from "@/hooks/use-toast";
import { EditCategoryDialog } from './edit-category-dialog';
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
} from "@/components/ui/alert-dialog";

// Function to fetch categories
const fetchCategories = async (userId: string): Promise<Category[]> => {
    if (!userId) return [];
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Category, 'id'>) }));
};

// Function to delete a category
const deleteCategory = async (categoryId: string) => {
    // TODO: Consider handling transactions associated with this category.
    // Option 1: Set categoryId to null/undefined for those transactions.
    // Option 2: Prevent deletion if transactions exist.
    // Option 3: Delete associated transactions (use with extreme caution!).
    // This example just deletes the category document.
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
};

// Cleaned list of default categories based on user request
const defaultCategories = [
    "Utilities", "Debt", "Groceries", "Insurance", "Health care", "Transportation",
    "Housing", "Savings", "Entertainment", "Personal care", "Property taxes",
    "Childcare", "Clothing", "Home maintenance", "Education", "House expenses",
    "Payroll", "Rent", "Business fees", "Charitable giving", "Travel",
    "Food expenses", "Mortgage payments"
];


export function CategoryList() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: categories = [], isLoading, error } = useQuery<Category[]>({
        queryKey: ['categories', user?.uid],
        queryFn: () => fetchCategories(user!.uid),
        enabled: !!user,
    });

    const mutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            // Invalidate and refetch categories query
            queryClient.invalidateQueries({ queryKey: ['categories', user?.uid] });
             // Invalidate other queries that might depend on categories if necessary
             queryClient.invalidateQueries({ queryKey: ['transactions', user?.uid] });
             queryClient.invalidateQueries({ queryKey: ['dashboardMetrics', user?.uid] });
             queryClient.invalidateQueries({ queryKey: ['expenseChartData', user?.uid] });
             queryClient.invalidateQueries({ queryKey: ['reportData', user?.uid] });
            toast({ title: "Category Deleted", description: "The category has been successfully removed." });
        },
         onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: error.message || "Could not delete category. Please try again.",
            });
        }
    });

    const handleDelete = (categoryId: string) => {
        mutation.mutate(categoryId);
    };


    if (isLoading) {
        return <CategoryListSkeleton />;
    }

     if (error) {
       return (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Loading Categories</AlertTitle>
              <AlertDescription>
                Could not fetch category data. Please try again later.
              </AlertDescription>
            </Alert>
        )
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Categories</CardTitle>
                <CardDescription>View, edit, or delete your expense and income categories.</CardDescription>
            </CardHeader>
            <CardContent>
                {categories.length === 0 ? ( // Conditionally render based on categories length
                     <div className="space-y-4">
                         <Alert>
                           <Info className="h-4 w-4" />
                           <AlertTitle>No Categories Yet!</AlertTitle>
                           <AlertDescription>
                              You haven't added any categories. Use the "Add Category" button to create your own, or get started with these suggestions:
                           </AlertDescription>
                         </Alert>
                        <ul className="space-y-3 border rounded-lg p-4 max-h-60 overflow-y-auto">
                            {defaultCategories.map((name, index) => (
                                <li key={index} className="flex items-center justify-between p-2 rounded-md bg-secondary/30">
                                    <span className="font-medium text-sm text-muted-foreground">{name}</span>
                                    {/* Optional: Add a button to quickly add this default category */}
                                    {/* <Button size="sm" variant="ghost" className="text-xs h-6">Add</Button> */}
                                </li>
                            ))}
                        </ul>
                     </div>
                ) : (
                <ul className="space-y-3">
                    {categories.map((category) => (
                        <li key={category.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                            <div className="flex items-center gap-3">
                                {category.color && (
                                     <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: category.color }}></span>
                                )}
                                <span className="font-medium">{category.name}</span>
                            </div>
                            <div className="flex items-center gap-1"> {/* Reduced gap for buttons */}
                                <EditCategoryDialog category={category} />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" aria-label="Delete category">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                        This action cannot be undone. Deleting this category might affect
                                        associated transactions (they might become uncategorized).
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                        onClick={() => handleDelete(category.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={mutation.isPending && mutation.variables === category.id} // Disable button while deleting this specific category
                                        >
                                        {mutation.isPending && mutation.variables === category.id ? 'Deleting...' : 'Delete'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </li>
                    ))}
                </ul>
                )}
            </CardContent>
        </Card>
    );
}
