import { AuthGuard } from '@/components/auth/auth-guard';
import { ReportGenerator } from '@/components/reports/report-generator';
import { ReportSkeleton } from '@/components/reports/report-skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';

export default function ReportsPage() {
  return (
    <AuthGuard>
      <div className="budgetflow-motion-shell flex flex-col gap-6">
        <Card className="scroll-story overflow-hidden rounded-[2rem] border-white/70 bg-[radial-gradient(circle_at_14%_16%,rgba(168,85,247,0.15),transparent_30%),radial-gradient(circle_at_90%_12%,rgba(34,211,238,0.16),transparent_32%),linear-gradient(135deg,#fbfbff_0%,#f0f6fb_50%,#f9f6ff_100%)] shadow-2xl shadow-slate-900/5">
          <CardHeader className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div className="space-y-5">
              <CardDescription className="inline-flex w-fit rounded-full border border-white/80 bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur">
                Insight studio
              </CardDescription>
              <div className="space-y-3">
                <CardTitle className="max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
                  Turn spending into a visual report.
                </CardTitle>
                <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                  Category evidence, period scope, and saved expense records come together in one report-ready view.
                </p>
              </div>
            </div>

            <div className="financial-cockpit app-preview-focus rounded-[1.75rem] border border-white/80 bg-white/60 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
              <div className="rounded-[1.35rem] bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Report preview</span>
                  <span>Current month</span>
                </div>
                <div className="mt-6 grid grid-cols-4 items-end gap-3">
                  <div className="h-20 rounded-t-2xl bg-cyan-300" />
                  <div className="h-32 rounded-t-2xl bg-fuchsia-300" />
                  <div className="h-24 rounded-t-2xl bg-blue-300" />
                  <div className="h-36 rounded-t-2xl bg-emerald-300" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-xs text-white/50">Top category</p>
                    <p className="mt-1 font-semibold">Groceries</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-xs text-white/50">Report scope</p>
                    <p className="mt-1 font-semibold">Expenses only</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 md:px-8 md:pb-8">
            <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
              <div className="glass-panel rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur">
                <p className="font-semibold text-slate-950">Report</p>
                <p>Expense categories</p>
              </div>
              <div className="glass-panel rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur">
                <p className="font-semibold text-slate-950">Period</p>
                <p>Current month by default</p>
              </div>
              <div className="glass-panel rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur">
                <p className="font-semibold text-slate-950">Scope</p>
                <p>Saved expense transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Suspense fallback={<ReportSkeleton />}>
          <ReportGenerator />
        </Suspense>
      </div>
    </AuthGuard>
  );
}
