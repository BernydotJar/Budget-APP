'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/auth/auth-provider';
import type { Transaction, Category } from '@/types';
import { DateRange } from 'react-day-picker';
import { addDays, format, startOfMonth, endOfMonth } from 'date-fns';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Loader2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ReportPieChart } from './report-pie-chart'; // Separate chart component
import { cn } from '@/lib/utils';
import { ReportSkeleton } from './report-skeleton';


interface ReportFilters {
    dateRange: DateRange | undefined;
    accountId?: string; // Optional account filter
}

// Fetch categories for filter dropdown
const fetchAccounts = async (userId: string): Promise<string[]> => {
    if (!userId) return [];
    const transactionsRef = collection(db, 'transactions');
    // Query distinct accounts - Firestore doesn't directly support distinct, so we fetch all and process client-side
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


// Fetch filtered transaction data for the chart
const fetchReportData = async (userId: string, filters: ReportFilters) => {
     if (!userId) return [];

     const transactionsRef = collection(db, 'transactions');
     let conditions = [
         where('userId', '==', userId),
         where('type', '==', 'expense') // Only expenses for this chart
     ];

     // Date Range Filter
     if (filters.dateRange?.from && filters.dateRange?.to) {
         conditions.push(where('date', '>=', Timestamp.fromDate(filters.dateRange.from)));
         conditions.push(where('date', '<=', Timestamp.fromDate(filters.dateRange.to)));
     } else if (filters.dateRange?.from) {
         // Handle case where only 'from' date is selected (e.g., filter from this date onwards)
         conditions.push(where('date', '>=', Timestamp.fromDate(filters.dateRange.from)));
     }
     // Note: Firestore requires range filters on the same field after inequality filters
     // You might need adjustments if combining date ranges with other range/inequality filters

     // Account Filter
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

       // Define a pool of colors for categories without a specific color
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


export function ReportGenerator() {
    const { user } = useAuth();
    const [filters, setFilters] = useState<ReportFilters>({
        dateRange: {
            from: startOfMonth(new Date()),
            to: endOfMonth(new Date()),
        },
        accountId: 'all', // Default to all accounts
    });

    // Fetch available accounts for the filter dropdown
    const { data: accounts = [], isLoading: isLoadingAccounts } = useQuery<string[]>({
        queryKey: ['accounts', user?.uid],
        queryFn: () => fetchAccounts(user!.uid),
        enabled: !!user,
    });


    // Fetch report data based on current filters
    const { data: reportData, isLoading: isLoadingReport, refetch } = useQuery({
        queryKey: ['reportData', user?.uid, filters],
        queryFn: () => fetchReportData(user!.uid, filters),
        enabled: !!user, // Only run query if user is available
    });

    const handleFilterChange = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Trigger refetch when filters change (already handled by queryKey dependency)
    // but you could explicitly call refetch if needed, e.g., on a button click.


    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <Filter className="h-5 w-5" /> Report Filters
                    </CardTitle>
                     <CardDescription>Adjust the filters below to generate your report.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Date Range Picker */}
                     <Popover>
                         <PopoverTrigger asChild>
                           <Button
                             id="date"
                             variant={"outline"}
                             className={cn(
                               "w-full md:w-[300px] justify-start text-left font-normal",
                               !filters.dateRange && "text-muted-foreground"
                             )}
                           >
                             <CalendarIcon className="mr-2 h-4 w-4" />
                             {filters.dateRange?.from ? (
                               filters.dateRange.to ? (
                                 <>
                                   {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                                   {format(filters.dateRange.to, "LLL dd, y")}
                                 </>
                               ) : (
                                 format(filters.dateRange.from, "LLL dd, y")
                               )
                             ) : (
                               <span>Pick a date range</span>
                             )}
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

                      {/* Account Filter Dropdown */}
                      <div className="w-full md:w-[200px]">
                         <Select
                            value={filters.accountId}
                            onValueChange={(value) => handleFilterChange('accountId', value)}
                            disabled={isLoadingAccounts}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Account" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Accounts</SelectItem>
                                {isLoadingAccounts ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                ) : (
                                    accounts.map(acc => <SelectItem key={acc} value={acc}>{acc}</SelectItem>)
                                )}
                            </SelectContent>
                        </Select>
                      </div>

                      {/* Optional: Add a Generate Report Button if needed */}
                      {/* <Button onClick={() => refetch()} disabled={isLoadingReport}>
                          {isLoadingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Generate Report
                      </Button> */}
                </CardContent>
            </Card>

             {/* Report Display Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Expense Breakdown by Category</CardTitle>
                     <CardDescription>
                        Showing expenses for the selected period {filters.accountId && filters.accountId !== 'all' ? `and account "${filters.accountId}"` : ''}.
                     </CardDescription>
                </CardHeader>
                 <CardContent>
                     {isLoadingReport ? (
                         <div className="flex justify-center items-center h-[350px]">
                             <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                     ) : reportData && reportData.length > 0 ? (
                        <ReportPieChart data={reportData} />
                     ) : (
                        <div className="flex justify-center items-center h-[350px] text-muted-foreground">
                             No expense data found for the selected filters.
                        </div>
                     )}
                 </CardContent>
            </Card>
        </div>
    );
}
