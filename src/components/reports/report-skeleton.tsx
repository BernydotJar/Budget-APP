import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ReportSkeleton() {
    return (
        <div className="space-y-6">
            {/* Filter Section Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-center">
                     <Skeleton className="h-10 w-full md:w-[300px]" />
                     <Skeleton className="h-10 w-full md:w-[200px]" />
                    {/* Optional: Skeleton for Generate button */}
                    {/* <Skeleton className="h-10 w-32" /> */}
                </CardContent>
            </Card>

            {/* Report Display Section Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                 <CardContent>
                    <div className="flex justify-center items-center h-[350px]">
                        <Skeleton className="h-[300px] w-[300px] rounded-full" />
                    </div>
                 </CardContent>
            </Card>
        </div>
    );
}
