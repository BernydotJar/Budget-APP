'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/auth/auth-provider';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Info, ShieldCheck, Tags, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { CategoryListSkeleton } from './category-list-skeleton';
import { useToast } from '@/hooks/use-toast';
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
} from '@/components/ui/alert-dialog';

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
  'Utilities', 'Debt', 'Groceries', 'Insurance', 'Health care', 'Transportation',
  'Housing', 'Savings', 'Entertainment', 'Personal care', 'Property taxes',
  'Childcare', 'Clothing', 'Home maintenance', 'Education', 'House expenses',
  'Payroll', 'Rent', 'Business fees', 'Charitable giving', 'Travel',
  'Food expenses', 'Mortgage payments'
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
      toast({ title: 'Category Deleted', description: 'The category has been successfully removed.' });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: error.message || 'Could not delete category. Please try again.',
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
        <AlertTitle>Categories could not be loaded</AlertTitle>
        <AlertDescription>
          The app could not read your category records. Your existing data was not changed; refresh and try again.
        </AlertDescription>
      </Alert>
    );
  }

  const categoryCountLabel = categories.length === 1 ? '1 category' : `${categories.length} categories`;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current setup</CardDescription>
            <CardTitle className="text-2xl">{categoryCountLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Categories available for transaction classification.
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
              Transactions, dashboard metrics, and reports depend on consistent labels.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Deletion behavior</CardDescription>
            <CardTitle className="text-2xl">Manual review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Deleting removes the category record only; review related transactions first.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-secondary p-2 text-secondary-foreground">
              <Tags className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <CardTitle>Your Categories</CardTitle>
              <CardDescription>
                Edit category names and colors so financial evidence stays readable across the app.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No categories yet</AlertTitle>
                <AlertDescription>
                  Create your first category to classify income and expenses. These suggestions can guide your initial setup.
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  Suggested starter categories
                </div>
                <ul className="grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
                  {defaultCategories.map((name) => (
                    <li key={name} className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-secondary/50">
                  <div className="flex min-w-0 items-center gap-3">
                    {category.color ? (
                      <span className="h-4 w-4 shrink-0 rounded-full border" style={{ backgroundColor: category.color }} />
                    ) : (
                      <span className="h-4 w-4 shrink-0 rounded-full border bg-muted" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">Available for transaction classification</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <EditCategoryDialog category={category} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label="Delete category">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this category?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes the category record from your category list. It does not automatically edit or delete existing transactions, so review related transactions before continuing.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={mutation.isPending && mutation.variables === category.id}
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
    </div>
  );
}
