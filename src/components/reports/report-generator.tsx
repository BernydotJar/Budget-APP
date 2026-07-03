'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/auth/auth-provider';
import type { Transaction, Category } from '@/types';
import { DateRange } from 'react-day-picker';
import { format, startOfMonth, endOfMonth } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Filter, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ReportPieChart } from './report-pie-chart';
import { cn, formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ReportFilters {
    dateRange: DateRange | undefined;
    accountId?: string;
}

const fetchAccounts = async (userId: string): Promise<string[]> => {
    if (!userId) return [];
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const accounts = new Set<string>();
    querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.account) {
            accounts.add(data.account);
        }
    });
    return Array.from(accounts);
};

const fetchReportData = async (userId: string, filters: ReportFilters) => {
     if (!userId) return [];

     const transactionsRef = collection(db, 'transactions');
     let conditions = [
         where('userId', '==', userId),
         where('type', '==', 'expense')
     ];

     if (filters.dateRange?.from && filters.dateRange?.to) {
         conditions.push(where('date', '>=', Timestamp.fromDate(filters.dateRange.from)));
         conditions.push(where('date', '<=', Timestamp.fromDate(filters.dateRange.to)));
     } else if (filters.dateRange?.from) {
         conditions.push(where('date', '>=', Timestamp.fromDate(filters.dateRange.from)));
     }

     if (filters.accountId && filters.accountId !== 'all') {
         conditions.push(where('account', '==', filters.accountId));
     }

     const q = query(transactionsRef, ...conditions);

     const categoriesRef = collection(db, 'categories');
     const catQ = query(categoriesRef, where('userId', '==', userId));

     const [querySnapshot, catSnapshot] = await Promise.all([
         getDocs(q),
         getDocs(catQ)
     ]);

     const categoryMap = new Map<string, { name: string; color?: string }>();
     catSnapshot.forEach(doc => {
         categoryMap.set(doc.id, { name: doc.data().name, color: doc.data().color });
     });

     const expenseByCategory: { [key: string]: number } = {};

     querySnapshot.forEach((doc) => {
         const data = doc.data();
         const categoryId = data.categoryId;
         const categoryName = categoryMap.get(categoryId)?.name || 'Uncategorized';
         if (categoryId) {
            if (!expenseByCategory[categoryName]) {
                expenseByCategory[categoryName] = 0;
            }
            expenseByCategory[categoryName] += data.amount;
         }
     });

     const colorPool = [
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
        'hsl(var(--chart-5))',
        'hsl(260 60% 55%)',
        'hsl(310 70% 60%)',
        'hsl(180 55% 50%)',
     ];
     let colorIndex = 0;

     const chartData = Object.entries(expenseByCategory).map(([category, amount]) => {
       const categoryInfo = Array.from(categoryMap.values()).find(cat => cat.name === category);
       let fillColor = categoryInfo?.color;

       if (!fillColor) {
           fillColor = colorPool[colorIndex % colorPool.length];
           colorIndex++;
       }
       return {
           category,
           amount,
           fill: fillColor,
       };
    });

    return chartData;
};

const formatDateRangeLabel = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
        return `${format(range.from, 'LLL dd, y')} - ${format(range.to, 'LLL dd, y')}`;
    }

    if (range?.from) {
        return `From ${format(range.from, 'LLL dd, y')}`;
    }

    return 'No period selected';
};

export function ReportGenerator() {
    const { user } = useAuth();
    const [filters, setFilters] = useState<ReportFilters>({
        dateRange: {
            from: startOfMonth(new Date()),
            to: endOfMonth(new Date()),
        },
        accountId: 'all',
    });

    const { data: accounts = [], isLoading: isLoadingAccounts } = useQuery<string[]>({
        queryKey: ['accounts', user?.uid],
        queryFn: () => fetchAccounts(user!.uid),
        enabled: !!user,
    });

    const { data: reportData = [], isLoading: isLoadingReport } = useQuery({
        queryKey: ['reportData', user?.uid, filters],
        queryFn: () => fetchReportData(user!.uid, filters),
        enabled: !!user,
    });

    const totalExpenses = useMemo(() => {
        return reportData.reduce((total, item) => total + item.amount, 0);
    }, [reportData]);

    const activePeriod = formatDateRangeLabel(filters.dateRange);
    const activeAccount = filters.accountId && filters.accountId !== 'all' ? filters.accountId : 'All accounts';

    const handleFilterChange = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <Filter className="h-5 w-5" /> Report filters
                    </CardTitle>
                     <CardDescription>
                        Choose the period and account scope for the expense category report.
                     </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                        <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="font-medium text-foreground">Period</p>
                            <p>{activePeriod}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="font-medium text-foreground">Account</p>
                            <p>{activeAccount}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="font-medium text-foreground">Data Type</p>
                            <p>Expenses only</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                     <Popover>
                         <PopoverTrigger asChild>
                           <Button
                             id="date"
                             variant="outline"
                             className={cn(
                               'w-full justify-start text-left font-normal md:w-[300px]',
                               !filters.dateRange && 'text-muted-foreground'
                             )}
                           >
                             <CalendarIcon className="mr-2 h-4 w-4" />
                             {activePeriod}
                           </Button>
                         </PopoverTrigger>
                         <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                             initialFocus
                             mode="range"
                             defaultMonth={filters.dateRange?.from}
                             selected={filters.dateRange}
                             onSelect={(range) => handleFilterChange('dateRange', range)}
                             numberOfMonths={2}
                           />
                         </PopoverContent>
                     </Popover>

                      <div className="w-full md:w-[220px]">
                         <Select
                            value={filters.accountId}
                            onValueChange={(value) => handleFilterChange('accountId', value)}
                            disabled={isLoadingAccounts}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All accounts</SelectItem>
                                {isLoadingAccounts ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                ) : (
                                    accounts.map(acc => <SelectItem key={acc} value={acc}>{acc}</SelectItem>)
                                )}
                            </SelectContent>
                        </Select>
                      </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" /> Expense breakdown by category
                    </CardTitle>
                     <CardDescription>
                        Showing {formatCurrency(totalExpenses)} in expenses for {activePeriod} across {activeAccount.toLowerCase()}.
                     </CardDescription>
                </CardHeader>
                 <CardContent>
                     {isLoadingReport ? (
                         <div className="flex h-[350px] items-center justify-center">
                             <Skeleton className="h-[280px] w-[280px] rounded-full" />
                          </div>
                     ) : reportData.length > 0 ? (
                        <ReportPieChart data={reportData} />
                     ) : (
                        <div className="flex h-[350px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
                             <p className="text-lg font-semibold">No matching expense records</p>
                             <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                No saved expense transactions match the selected period and account scope. Adjust the filters or add expense transactions to populate this report.
                             </p>
                        </div>
                     )}
                 </CardContent>
            </Card>
        </div>
    );
}
