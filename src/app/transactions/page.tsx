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
      <div className="budgetflow-motion-shell flex flex-col gap-6">
        <Card className="scroll-story overflow-hidden rounded-[2rem] border-white/70 bg-[radial-gradient(circle_at_10%_10%,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_92%_18%,rgba(168,85,247,0.13),transparent_32%),linear-gradient(135deg,#fbfdff_0%,#eef5fb_54%,#fbf8ff_100%)] shadow-2xl shadow-slate-900/5">
          <CardHeader className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div className="space-y-5">
              <CardDescription className="inline-flex w-fit rounded-full border border-white/80 bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur">
                Ledger activity
              </CardDescription>
              <div className="space-y-3">
                <CardTitle className="max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
                  Every transaction becomes budget evidence.
                </CardTitle>
                <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                  Review income and expenses in a focused ledger built for fast correction, audit, and monthly signal.
                </p>
              </div>
              <Button asChild className="rounded-full px-5">
                <Link href="/transactions/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
                </Link>
              </Button>
            </div>

            <div className="financial-cockpit app-preview-focus rounded-[1.75rem] border border-white/80 bg-white/60 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
              <div className="rounded-[1.35rem] bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Transaction stream</span>
                  <span>Newest first</span>
                </div>
                <div className="mt-5 space-y-3">
                  {['Salary deposit', 'Groceries', 'Utilities'].map((label, index) => (
                    <div key={label} className="rounded-2xl bg-white/10 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{label}</span>
                        <span className={index === 0 ? 'text-emerald-300' : 'text-fuchsia-300'}>
                          {index === 0 ? '+$3,850' : index === 1 ? '-$82' : '-$146'}
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 rounded-full bg-white/10">
                        <div className={`h-1.5 rounded-full ${index === 0 ? 'w-5/6 bg-emerald-300' : index === 1 ? 'w-1/2 bg-fuchsia-300' : 'w-2/3 bg-cyan-300'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 md:px-8 md:pb-8">
            <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
              <div className="glass-panel rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur">
                <p className="font-semibold text-slate-950">Scope</p>
                <p>All recorded transactions</p>
              </div>
              <div className="glass-panel rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur">
                <p className="font-semibold text-slate-950">Order</p>
                <p>Newest transaction first</p>
              </div>
              <div className="glass-panel rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur">
                <p className="font-semibold text-slate-950">Evidence</p>
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
