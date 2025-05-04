import { AuthGuard } from '@/components/auth/auth-guard';
import { ReportGenerator } from '@/components/reports/report-generator';
import { Suspense } from 'react';
import { ReportSkeleton } from '@/components/reports/report-skeleton';

export default function ReportsPage() {
  return (
    <AuthGuard>
       <div className="flex flex-col gap-6">
         <h1 className="text-3xl font-semibold">Reports</h1>
         <Suspense fallback={<ReportSkeleton />}>
            <ReportGenerator />
         </Suspense>
       </div>
    </AuthGuard>
  );
}
