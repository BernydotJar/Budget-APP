import { AuthGuard } from '@/components/auth/auth-guard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Suspense } from 'react';
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col gap-6">
        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">BudgetFlow</p>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Current month financial overview based on your recorded transactions.
              </p>
            </div>
          </div>
        </section>

        <Suspense fallback={<DashboardSkeleton />}>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" aria-label="Current month financial metrics">
            <DashboardMetrics />
          </section>

          <section className="grid gap-4 lg:grid-cols-7" aria-label="Current month expense evidence">
            <Card className="lg:col-span-7">
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
