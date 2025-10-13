import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/auth-provider';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from "@/components/ui/toaster"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter
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
                <SidebarHeader className="flex items-center justify-between p-4">
                  <h2 className="text-xl font-semibold text-primary">BudgetFlow</h2>
                </SidebarHeader>
                <SidebarContent>
                 <Suspense fallback={<SidebarNavSkeleton />}>
                    <MainNav />
                 </Suspense>
                </SidebarContent>
                <SidebarFooter>
                  {/* Footer content like User Profile/Logout can go here */}
                </SidebarFooter>
              </Sidebar>
              <SidebarInset>
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                  <SidebarTrigger className="sm:hidden"/>
                   {/* Optionally add breadcrumbs or page title here */}
                </header>
                <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
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
    <div className="p-4 space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
    </div>
  )
}