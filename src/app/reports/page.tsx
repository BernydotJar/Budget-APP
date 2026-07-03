import { AuthGuard } from '@/components/auth/auth-guard';
import { ReportGenerator } from '@/components/reports/report-generator';
import { ReportSkeleton } from '@/components/reports/report-skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';

export default function ReportsPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardDescription>BudgetFlow</CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">Reports</CardTitle>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Review expense reporting by category, period, and account scope.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="font-medium text-foreground">Report</p>
                <p>Expense categories</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="font-medium text-foreground">Period</p>
                <p>Current month by default</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="font-medium text-foreground">Scope</p>
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
