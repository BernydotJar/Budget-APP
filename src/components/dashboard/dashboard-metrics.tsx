'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { db } from '@/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardMetricsData {
    balance: number;
    income: number;
    expenses: number;
    transactionCount: number;
}

const emptyMetrics: DashboardMetricsData = {
    balance: 0,
    income: 0,
    expenses: 0,
    transactionCount: 0,
};

const fetchMetrics = async (userId: string): Promise<DashboardMetricsData> => {
    if (!userId) return emptyMetrics;

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const transactionsRef = collection(db, 'transactions');
    const q = query(
        transactionsRef,
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(startOfCurrentMonth)),
        where('date', '<=', Timestamp.fromDate(endOfCurrentMonth))
    );

    const querySnapshot = await getDocs(q);
    let income = 0;
    let expenses = 0;
    let transactionCount = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactionCount += 1;

        if (data.type === 'income') {
            income += data.amount;
        } else if (data.type === 'expense') {
            expenses += data.amount;
        }
    });

    return {
        balance: income - expenses,
        income,
        expenses,
        transactionCount,
    };
};

function MetricErrorCards() {
    const cards = [
        { title: 'Net Position', icon: DollarSign },
        { title: 'Monthly Income', icon: TrendingUp },
        { title: 'Monthly Expenses', icon: TrendingDown },
        { title: 'Data Status', icon: Activity },
    ];

    return (
        <>
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">Unavailable</div>
                        <p className="text-xs text-muted-foreground">Could not load transaction evidence.</p>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}

export function DashboardMetrics() {
    const { user } = useAuth();

    const { data: metrics, isLoading, error } = useQuery({
        queryKey: ['dashboardMetrics', user?.uid],
        queryFn: () => fetchMetrics(user!.uid),
        enabled: !!user,
    });

    if (isLoading) {
        return (
            <>
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
            </>
        );
    }

    if (error) {
        console.error('Error fetching dashboard metrics:', error);
        return <MetricErrorCards />;
    }

    const { balance = 0, income = 0, expenses = 0, transactionCount = 0 } = metrics || emptyMetrics;
    const hasTransactions = transactionCount > 0;

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Position</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
                    <p className="text-xs text-muted-foreground">Income minus expenses this month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(income)}</div>
                    <p className="text-xs text-muted-foreground">Recorded income this month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(expenses)}</div>
                    <p className="text-xs text-muted-foreground">Recorded expenses this month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Data Status</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{transactionCount}</div>
                    <p className="text-xs text-muted-foreground">
                        {hasTransactions ? 'Transactions recorded this month' : 'No transactions recorded this month'}
                    </p>
                </CardContent>
            </Card>
        </>
    );
}
