'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart as RechartsPieChart, Cell } from 'recharts'; // Renamed to avoid conflict
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/auth/auth-provider';
import { startOfMonth, endOfMonth } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

interface ExpenseData {
    category: string;
    amount: number;
    fill: string; // Color for the chart segment
}

const fetchExpenseData = async (userId: string): Promise<ExpenseData[]> => {
    if (!userId) return [];

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const transactionsRef = collection(db, 'transactions');
    const q = query(
        transactionsRef,
        where('userId', '==', userId),
        where('type', '==', 'expense'),
        where('date', '>=', Timestamp.fromDate(startOfCurrentMonth)),
        where('date', '<=', Timestamp.fromDate(endOfCurrentMonth))
    );

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
        const categoryId = data.categoryId; // Assume category is stored as ID
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
        'hsl(260 60% 55%)', // Additional colors if needed
        'hsl(310 70% 60%)',
        'hsl(180 55% 50%)',
    ];
    let colorIndex = 0;

     const chartData: ExpenseData[] = Object.entries(expenseByCategory).map(([category, amount]) => {
        // Find the category color from the map, default to pool if not found or undefined
        const categoryInfo = Array.from(categoryMap.values()).find(cat => cat.name === category);
        let fillColor = categoryInfo?.color;

        if (!fillColor) {
            fillColor = colorPool[colorIndex % colorPool.length];
            colorIndex++;
        }

        return {
            category,
            amount,
            fill: fillColor, // Assign color here
        };
    });

    return chartData;
};

export function ExpenseChart() {
    const { user } = useAuth();
    const chartRef = React.useRef<HTMLDivElement>(null);
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);


    const { data: chartData = [], isLoading, error } = useQuery<ExpenseData[]>({
        queryKey: ['expenseChartData', user?.uid],
        queryFn: () => fetchExpenseData(user!.uid),
        enabled: !!user,
    });

     const totalExpenses = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.amount, 0);
    }, [chartData]);

    // Dynamically build chartConfig based on fetched data
    const chartConfig = React.useMemo(() => {
         const config: ChartConfig = {};
         chartData.forEach(item => {
             config[item.category] = { // Use category name as the key
                 label: item.category,
                 color: item.fill, // Use the fetched fill color
             };
         });
         // Add a fallback for tooltip rendering if needed
         config.amount = { label: 'Amount' };
         return config;
     }, [chartData]);


    if (isLoading) {
       return <Skeleton className="h-[350px] w-full" />;
    }

    if (error) {
       return (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Loading Chart</AlertTitle>
              <AlertDescription>
                Could not fetch expense data. Please try again later.
              </AlertDescription>
            </Alert>
        )
    }

     if (chartData.length === 0) {
         return (
             <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                 No expense data available for this month.
             </div>
         );
     }


    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[350px]"
            ref={chartRef}
        >
            <RechartsPieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel nameKey="category" />} // Use category for nameKey
                />
                <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="category" // Use category for nameKey
                    innerRadius={60}
                    strokeWidth={5}
                    activeIndex={chartData.findIndex(item => item.category === activeCategory)}
                    activeShape={({ outerRadius = 0, ...props }) => (
                         <g>
                           <props.sector outerRadius={outerRadius + 10} />
                           <props.sector outerRadius={outerRadius} stroke={props.fill} />
                         </g>
                     )}
                     onMouseOver={(data, index) => setActiveCategory(data.category)}
                     onMouseLeave={() => setActiveCategory(null)}

                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}

                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Total Expenses
                                        </tspan>
                                    </text>
                                );
                            }
                            return null;
                        }}
                    />
                </Pie>
            </RechartsPieChart>
        </ChartContainer>
    );
}
