import { AuthGuard } from '@/components/auth/auth-guard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Suspense } from 'react';
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="budgetflow-motion-shell flex flex-col gap-6">
        <section className="scroll-story relative overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_12%_20%,rgba(59,130,246,0.20),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(236,72,153,0.15),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#eef4fb_50%,#fbf7ff_100%)] p-6 shadow-2xl shadow-slate-900/5 md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex rounded-full border border-white/80 bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur">
                BudgetFlow cockpit
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
                  Your month, reduced to signal.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                  Dashboard evidence turns saved transactions into a clear financial command view.
                </p>
              </div>
              <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                <div className="glass-panel rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur">
                  <p className="font-semibold text-slate-950">Scope</p>
                  <p>Current month</p>
                </div>
                <div className="glass-panel rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur">
                  <p className="font-semibold text-slate-950">Source</p>
                  <p>Saved records</p>
                </div>
                <div className="glass-panel rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur">
                  <p className="font-semibold text-slate-950">Output</p>
                  <p>Decision view</p>
                </div>
              </div>
            </div>

            <div className="financial-cockpit app-preview-focus rounded-[1.75rem] border border-white/80 bg-white/60 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
              <div className="rounded-[1.35rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/25">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Dashboard preview</span>
                  <span>Live evidence</span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-white/50">Income signal</p>
                    <p className="mt-2 text-3xl font-bold">$5.2k</p>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-4/5 rounded-full bg-emerald-300" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-white/50">Expense signal</p>
                    <p className="mt-2 text-3xl font-bold">$2.1k</p>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-3/5 rounded-full bg-fuchsia-300" />
                    </div>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="h-3 rounded-full bg-cyan-300/90" />
                  <div className="h-3 w-4/5 rounded-full bg-fuchsia-300/90" />
                  <div className="h-3 w-2/3 rounded-full bg-blue-300/90" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<DashboardSkeleton />}>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" aria-label="Current month financial metrics">
            <DashboardMetrics />
          </section>

          <section className="grid gap-4 lg:grid-cols-7" aria-label="Current month expense evidence">
            <Card className="rounded-[1.5rem] border-white/70 shadow-sm lg:col-span-7">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>
                  Spending by category for the current month. If no expense transactions exist, no chart is generated.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ExpenseChart />
              </CardContent>
            </Card>
          </section>
        </Suspense>
      </div>
    </AuthGuard>
  );
}
