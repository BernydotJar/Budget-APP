import { AuthGuard } from '@/components/auth/auth-guard';
import { CategoryList } from '@/components/categories/category-list';
import { AddCategoryDialog } from '@/components/categories/add-category-dialog';
import { Suspense } from 'react';
import { CategoryListSkeleton } from '@/components/categories/category-list-skeleton';

export default function CategoriesPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col gap-6">
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Category management
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">Manage Categories</h1>
              <p className="max-w-3xl text-sm text-muted-foreground">
                Keep your income and expense labels consistent so dashboards, transactions,
                and reports stay easy to read.
              </p>
            </div>
            <AddCategoryDialog />
          </div>
        </section>

        <Suspense fallback={<CategoryListSkeleton />}>
          <CategoryList />
        </Suspense>
      </div>
    </AuthGuard>
  );
}
