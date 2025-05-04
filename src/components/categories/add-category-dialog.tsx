'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Zod schema for category form validation
const categoryFormSchema = z.object({
    name: z.string().min(1, { message: 'Category name cannot be empty.' }).max(50, { message: 'Category name is too long.' }),
    color: z.string().optional(), // Optional color field
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export function AddCategoryDialog() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: '',
            color: '#cccccc', // Default color
        },
    });

     const mutation = useMutation({
        mutationFn: async (data: CategoryFormValues) => {
             if (!user) throw new Error("User not authenticated.");
            const categoryData = {
                ...data,
                userId: user.uid,
            };
            await addDoc(collection(db, 'categories'), categoryData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories', user?.uid] });
             // Invalidate other queries if they depend on categories
            toast({ title: "Category Added", description: "New category created successfully." });
            form.reset(); // Reset form after successful submission
            setIsOpen(false); // Close the dialog
        },
        onError: (error: any) => {
             toast({
                variant: "destructive",
                title: "Failed to Add Category",
                description: error.message || "An error occurred. Please try again.",
            });
        },
     });


    const onSubmit = (data: CategoryFormValues) => {
       mutation.mutate(data);
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Create a new category for your transactions. Choose an optional color for reporting.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Groceries, Salary" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-3">
                                    <FormLabel>Color (Optional)</FormLabel>
                                    <FormControl>
                                        <Input type="color" className="h-8 w-14 p-1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                             <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={mutation.isPending}>Cancel</Button>
                             </DialogClose>
                             <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Category
                            </Button>
                        </DialogFooter>
                         {mutation.isError && (
                            <p className="text-sm font-medium text-destructive pt-2 text-center">
                                {mutation.error instanceof Error ? mutation.error.message : 'An unknown error occurred'}
                            </p>
                         )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
