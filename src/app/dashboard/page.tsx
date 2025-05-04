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
         <h1 className="text-3xl font-semibold">Dashboard</h1>
         <Suspense fallback={<DashboardSkeleton />}>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <DashboardMetrics />
           </div>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                 <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>Your spending by category this month.</CardDescription>
                 </CardHeader>
                 <CardContent className="pl-2">
                   <ExpenseChart />
                 </CardContent>
              </Card>
               {/* Add Recent Transactions Preview Card Here */}
               {/* <Card className="col-span-3">
                  <CardHeader>
                     <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                      Placeholder for recent transactions list
                  </CardContent>
               </Card> */}
           </div>
         </Suspense>
       </div>
    </AuthGuard>
  );
}
