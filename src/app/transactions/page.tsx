import { AuthGuard } from '@/components/auth/auth-guard';
import { TransactionList } from '@/components/transactions/transaction-list';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { TransactionListSkeleton } from '@/components/transactions/transaction-list-skeleton';

export default function TransactionsPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
              <h1 className="text-3xl font-semibold">Transactions</h1>
              <Button asChild>
                   <Link href="/transactions/new">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
                   </Link>
              </Button>
          </div>
          {/* Add filtering options here later */}
          <Suspense fallback={<TransactionListSkeleton />}>
            <TransactionList />
          </Suspense>
      </div>
    </AuthGuard>
  );
}
