import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/auth-provider';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <SidebarProvider>
              <Sidebar>
                <SidebarHeader className="border-b border-sidebar-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                      BF
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold text-primary">BudgetFlow</h2>
                      <p className="truncate text-xs text-sidebar-foreground/70">Evidence-first budget workspace</p>
                    </div>
                  </div>
                </SidebarHeader>
                <SidebarContent className="px-2 py-3">
                  <Suspense fallback={<SidebarNavSkeleton />}>
                    <MainNav />
                  </Suspense>
                </SidebarContent>
                <SidebarFooter className="border-t border-sidebar-border p-4">
                  <p className="text-xs text-sidebar-foreground/70">
                    Review totals, records, reports, and setup from one authenticated shell.
                  </p>
                </SidebarFooter>
              </Sidebar>
              <SidebarInset>
                <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:h-16 sm:px-6">
                  <div className="flex items-center gap-3">
                    <SidebarTrigger className="sm:hidden" />
                    <div>
                      <p className="text-sm font-medium">Budget workspace</p>
                      <p className="hidden text-xs text-muted-foreground sm:block">
                        Navigate between dashboard evidence, transaction activity, reports, and setup.
                      </p>
                    </div>
                  </div>
                </header>
                <main className="flex-1 p-4 sm:px-6 sm:py-6">{children}</main>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function SidebarNavSkeleton() {
  return (
    <div className="space-y-4 p-2">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
