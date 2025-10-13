import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function TransactionListSkeleton() {
    return (
         <div className="rounded-lg border overflow-hidden">
         <Table>
            <TableCaption>Loading recent transactions...</TableCaption>
            <TableHeader>
                 <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="text-right w-[120px]">Amount</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                 </TableRow>
            </TableHeader>
             <TableBody>
                {[...Array(5)].map((_, index) => ( // Render 5 skeleton rows
                    <TableRow key={index}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    );
}
