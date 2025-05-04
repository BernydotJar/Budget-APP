import { AuthGuard } from '@/components/auth/auth-guard';
import { CategoryList } from '@/components/categories/category-list';
import { AddCategoryDialog } from '@/components/categories/add-category-dialog';
import { Suspense } from 'react';
import { CategoryListSkeleton } from '@/components/categories/category-list-skeleton';

export default function CategoriesPage() {
  return (
    <AuthGuard>
       <div className="flex flex-col gap-6">
           <div className="flex justify-between items-center">
               <h1 className="text-3xl font-semibold">Manage Categories</h1>
               <AddCategoryDialog />
           </div>
           <Suspense fallback={<CategoryListSkeleton />}>
              <CategoryList />
           </Suspense>
       </div>
    </AuthGuard>
  );
}
