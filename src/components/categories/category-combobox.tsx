'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, PlusCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';
import { useToast } from "@/hooks/use-toast";


interface CategoryComboboxProps {
  categories: Category[];
  isLoading: boolean;
  value: string; // Current categoryId
  onChange: (categoryId: string) => void; // Callback to update form state
}

export function CategoryCombobox({ categories, isLoading, value, onChange }: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const selectedCategoryName = categories.find(cat => cat.id === value)?.name;

  const addCategoryMutation = useMutation({
     mutationFn: async (newCategoryName: string) => {
        if (!user) throw new Error("User not authenticated.");
        if (!newCategoryName.trim()) throw new Error("Category name cannot be empty.");

        // Basic check for existing category name (case-insensitive)
         const exists = categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase());
         if (exists) {
             throw new Error(`Category "${newCategoryName}" already exists.`);
         }

        const categoryData = {
            name: newCategoryName.trim(),
            userId: user.uid,
            // You might want to add a default color here if needed
        };
        const docRef = await addDoc(collection(db, 'categories'), categoryData);
        return { id: docRef.id, ...categoryData }; // Return the new category object
    },
    onSuccess: (newCategory) => {
        queryClient.invalidateQueries({ queryKey: ['categories', user?.uid] });
        onChange(newCategory.id); // Automatically select the newly added category
        toast({ title: "Category Added", description: `"${newCategory.name}" created and selected.` });
        setOpen(false); // Close the popover
        setSearchQuery(''); // Clear search
    },
    onError: (error: any) => {
        toast({
            variant: "destructive",
            title: "Failed to Add Category",
            description: error.message || "An error occurred. Please try again.",
        });
    },
  });


  const handleAddNewCategory = () => {
    if (searchQuery.trim()) {
        addCategoryMutation.mutate(searchQuery.trim());
    }
  };


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {isLoading
            ? "Loading categories..."
            : value
            ? selectedCategoryName ?? "Select category..."
            : "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command shouldFilter={false}> {/* Disable default filtering as we handle it */}
          <CommandInput
             placeholder="Search or add category..."
             value={searchQuery}
             onValueChange={setSearchQuery}
             disabled={addCategoryMutation.isPending}
          />
          <CommandList>
            <CommandEmpty>
                 {addCategoryMutation.isPending
                    ? <span className="flex items-center justify-center p-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</span>
                    : searchQuery.trim()
                    ? <span className="text-sm p-2">No matching categories found.</span>
                    : <span className="text-sm p-2">Type to search or add a new category.</span>}
            </CommandEmpty>
            <CommandGroup>
              {categories
                 .filter(category => category.name.toLowerCase().includes(searchQuery.toLowerCase()))
                 .map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id} // Use ID for value to match form state
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue); // Allow deselecting? Or just set?
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
              {searchQuery.trim() && !categories.some(cat => cat.name.toLowerCase() === searchQuery.trim().toLowerCase()) && (
                  <>
                    <CommandSeparator />
                     <CommandGroup>
                        <CommandItem
                            onSelect={handleAddNewCategory}
                            disabled={addCategoryMutation.isPending}
                            className="text-primary cursor-pointer aria-selected:bg-background"
                        >
                            {addCategoryMutation.isPending ? (
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                 <PlusCircle className="mr-2 h-4 w-4" />
                            )}
                             Add "{searchQuery.trim()}"
                        </CommandItem>
                     </CommandGroup>
                  </>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
