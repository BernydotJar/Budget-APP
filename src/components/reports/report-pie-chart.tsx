'use client';

import React, { useMemo, useState } from 'react';
import { Label, Pie, PieChart as RechartsPieChart, Cell } from 'recharts';

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

interface ReportPieChartProps {
    data: ExpenseData[];
}

export function ReportPieChart({ data }: ReportPieChartProps) {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);


    const totalAmount = useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.amount, 0);
    }, [data]);

    // Dynamically build chartConfig based on fetched data
    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        data.forEach(item => {
            config[item.category] = { // Use category name as the key
                label: item.category,
                color: item.fill, // Use the fetched fill color
            };
        });
        // Add a fallback for tooltip rendering if needed
        config.amount = { label: 'Amount' };
        return config;
    }, [data]);


    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[400px]" // Adjust size as needed
            ref={chartRef}
        >
            <RechartsPieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel nameKey="category" />} // Use category for nameKey
                />
                <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="category" // Use category for nameKey
                    innerRadius={60}
                    outerRadius={120} // Adjust outer radius
                    strokeWidth={5}
                    activeIndex={data.findIndex(item => item.category === activeCategory)}
                    activeShape={({ outerRadius = 0, ...props }) => (
                         <g>
                           <props.sector outerRadius={outerRadius + 10} />
                           <props.sector outerRadius={outerRadius} stroke={props.fill} />
                         </g>
                     )}
                     onMouseOver={(d, index) => setActiveCategory(d.category)}
                     onMouseLeave={() => setActiveCategory(null)}
                >
                    {data.map((entry, index) => (
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
                                             {totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
