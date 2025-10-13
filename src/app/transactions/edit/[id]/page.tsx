import { AuthGuard } from '@/components/auth/auth-guard';
import { TransactionForm } from '@/components/transactions/transaction-form';

interface EditTransactionPageProps {
  params: {
    id: string;
  };
}

export default function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = params;

  return (
    <AuthGuard>
      <TransactionForm transactionId={id} />
    </AuthGuard>
  );
}
