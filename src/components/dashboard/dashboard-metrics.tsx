'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { db } from '@/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils'; // Assuming you have a currency formatter
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';


const fetchMetrics = async (userId: string) => {
    if (!userId) return { balance: 0, income: 0, expenses: 0 };

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef,
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(startOfCurrentMonth)),
        where('date', '<=', Timestamp.fromDate(endOfCurrentMonth))
    );

    const querySnapshot = await getDocs(q);
    let income = 0;
    let expenses = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === 'income') {
            income += data.amount;
        } else if (data.type === 'expense') {
            expenses += data.amount;
        }
    });

    // For balance, we need all transactions up to now, or adjust logic based on requirements
    // This example calculates balance based only on this month's transactions
    const balance = income - expenses; // Simplified balance calculation

    return { balance, income, expenses };
};


export function DashboardMetrics() {
    const { user } = useAuth();

    const { data: metrics, isLoading, error } = useQuery({
        queryKey: ['dashboardMetrics', user?.uid],
        queryFn: () => fetchMetrics(user!.uid),
        enabled: !!user, // Only run query if user is available
    });

     if (isLoading) {
        return (
           <>
             <Skeleton className="h-[120px] w-full" />
             <Skeleton className="h-[120px] w-full" />
             <Skeleton className="h-[120px] w-full" />
             <Skeleton className="h-[120px] w-full" />
           </>
        )
     }

     if (error) {
        // Handle error state appropriately in UI
        console.error("Error fetching dashboard metrics:", error);
        // return <div>Error loading metrics.</div>;
        // Or show placeholder cards with error indication
        return (
           <>
             <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                   <DollarSign className="h-4 w-4 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold text-destructive">Error</div>
                   <p className="text-xs text-muted-foreground">Could not load data</p>
                 </CardContent>
             </Card>
              <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                   <TrendingUp className="h-4 w-4 text-accent" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold text-destructive">Error</div>
                   <p className="text-xs text-muted-foreground">Could not load data</p>
                 </CardContent>
              </Card>
              <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                   <TrendingDown className="h-4 w-4 text-destructive" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold text-destructive">Error</div>
                    <p className="text-xs text-muted-foreground">Could not load data</p>
                 </CardContent>
              </Card>
              {/* Placeholder for potential 4th card */}
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium">...</CardTitle>
                   {/* Icon */}
                 </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">-</div>
                     <p className="text-xs text-muted-foreground">-</p>
                  </CardContent>
               </Card>
           </>
        )
     }


    const { balance = 0, income = 0, expenses = 0 } = metrics || {};


    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Balance (This Month)
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
                    <p className="text-xs text-muted-foreground">
                        Based on current month's transactions
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(income)}</div>
                    <p className="text-xs text-muted-foreground">
                        Total income this month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(expenses)}</div>
                     <p className="text-xs text-muted-foreground">
                        Total expenses this month
                    </p>
                </CardContent>
            </Card>
             {/* You can add a fourth metric card here if needed */}
             <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">...</CardTitle>
                    {/* Icon */}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">-</div>
                     <p className="text-xs text-muted-foreground">-</p>
                  </CardContent>
            </Card>
        </>
    );
}
