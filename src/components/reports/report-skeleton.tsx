import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ReportSkeleton() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <Skeleton className="mb-2 h-6 w-40" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <Skeleton className="h-10 w-full md:w-[300px]" />
                        <Skeleton className="h-10 w-full md:w-[220px]" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <Skeleton className="mb-2 h-6 w-64" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                 <CardContent>
                    <div className="flex h-[350px] items-center justify-center">
                        <Skeleton className="h-[280px] w-[280px] rounded-full" />
                    </div>
                 </CardContent>
            </Card>
        </div>
    );
}
