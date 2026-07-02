import { AuthGuard } from '@/components/auth/auth-guard';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionListSkeleton } from '@/components/transactions/transaction-list-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default function TransactionsPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <CardDescription>BudgetFlow</CardDescription>
              <CardTitle className="text-3xl font-semibold tracking-tight">Transactions</CardTitle>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Review your recorded income and expenses, ordered newest first. Every row reflects saved ledger evidence from your transactions.
              </p>
            </div>
            <Button asChild>
              <Link href="/transactions/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="font-medium text-foreground">Scope</p>
                <p>All recorded transactions</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="font-medium text-foreground">Order</p>
                <p>Newest transaction first</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="font-medium text-foreground">Evidence</p>
                <p>Income and expenses only</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionList />
        </Suspense>
      </div>
    </AuthGuard>
  );
}
