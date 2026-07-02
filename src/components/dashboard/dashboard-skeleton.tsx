import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <section className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-4 w-full max-w-xl" />
                </div>
            </section>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
            </div>

            <div className="grid gap-4 lg:grid-cols-7">
                <Card className="lg:col-span-7">
                    <CardHeader>
                        <Skeleton className="mb-2 h-6 w-48" />
                        <Skeleton className="h-4 w-full max-w-lg" />
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Skeleton className="h-[350px] w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
