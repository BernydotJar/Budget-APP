import { AuthGuard } from '@/components/auth/auth-guard';
import { CategoryList } from '@/components/categories/category-list';
import { AddCategoryDialog } from '@/components/categories/add-category-dialog';
import { Suspense } from 'react';
import { CategoryListSkeleton } from '@/components/categories/category-list-skeleton';

export default function CategoriesPage() {
  return (
    <AuthGuard>
      <div className="budgetflow-motion-shell flex flex-col gap-6">
        <section className="scroll-story relative overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_12%_14%,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(14,165,233,0.15),transparent_32%),linear-gradient(135deg,#fbfffd_0%,#eef7fb_50%,#f8fbff_100%)] p-6 shadow-2xl shadow-slate-900/5 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex rounded-full border border-white/80 bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur">
                Classification studio
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
                  Give each record a clean category signal.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                  Categories power cleaner transactions, sharper dashboards, and report-ready spending patterns.
                </p>
              </div>
              <AddCategoryDialog />
            </div>

            <div className="financial-cockpit app-preview-focus rounded-[1.75rem] border border-white/80 bg-white/60 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
              <div className="rounded-[1.35rem] bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Category map</span>
                  <span>Setup impact</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Groceries', 'Salary', 'Utilities', 'Travel', 'Health', 'Rent'].map((label) => (
                    <span key={label} className="rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-white">
                      {label}
                    </span>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-white/50">Dashboard</p>
                    <p className="mt-1 font-semibold">Cleaner totals</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-white/50">Reports</p>
                    <p className="mt-1 font-semibold">Better grouping</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<CategoryListSkeleton />}>
          <CategoryList />
        </Suspense>
      </div>
    </AuthGuard>
  );
}
