import { AuthGuard } from '@/components/auth/auth-guard';
import { TransactionForm } from '@/components/transactions/transaction-form';

export default function NewTransactionPage() {
  return (
    <AuthGuard>
      <TransactionForm />
    </AuthGuard>
  );
}
