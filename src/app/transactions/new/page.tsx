import { AuthGuard } from '@/components/auth/auth-guard';
import { TransactionForm } from '@/components/transactions/transaction-form';

export default function NewTransactionPage() {
  return (
    <AuthGuard>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <TransactionForm />
      </div>
    </AuthGuard>
  );
}
