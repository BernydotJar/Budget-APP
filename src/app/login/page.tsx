import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="fixed inset-0 z-50 min-h-screen overflow-y-auto bg-[#f4f7fb]">
      <LoginForm />
    </main>
  );
}
