import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/auth-provider';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/toaster';
import { MainNav } from '@/components/main-nav';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BudgetFlow',
  description: 'Track your income and expenses with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#f5f8fc] antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <div className="min-h-screen bg-[radial-gradient(circle_at_8%_0%,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_92%_0%,rgba(236,72,153,0.10),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f3f7fb_48%,#ffffff_100%)]">
              <header className="premium-top-dock sticky top-0 z-40 border-b border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-2xl sm:px-6">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-2xl shadow-slate-900/20">
                      BF
                    </div>
                    <div>
                      <p className="text-base font-semibold tracking-tight text-slate-950">BudgetFlow</p>
                      <p className="text-xs text-slate-500 sm:text-sm">Premium savings cockpit</p>
                    </div>
                  </div>

                  <Suspense fallback={<TopNavSkeleton />}>
                    <MainNav />
                  </Suspense>
                </div>
              </header>

              <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
            </div>
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function TopNavSkeleton() {
  return (
    <div className="flex gap-2 rounded-full border border-white/70 bg-white/65 p-1 shadow-sm backdrop-blur-xl">
      <Skeleton className="h-9 w-28 rounded-full" />
      <Skeleton className="h-9 w-32 rounded-full" />
      <Skeleton className="h-9 w-24 rounded-full" />
      <Skeleton className="h-9 w-28 rounded-full" />
    </div>
  );
}
