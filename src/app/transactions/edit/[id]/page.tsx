import { AuthGuard } from '@/components/auth/auth-guard';
import { TransactionForm } from '@/components/transactions/transaction-form';

interface EditTransactionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = await params;

  return (
    <AuthGuard>
      <TransactionForm transactionId={id} />
    </AuthGuard>
  );
}
