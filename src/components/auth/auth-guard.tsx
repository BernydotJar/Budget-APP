'use client';

import type React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login page if not authenticated and not loading
    }
  }, [user, loading, router]);

  if (loading) {
    // Show a loading indicator while checking auth status
     return (
       <div className="flex flex-col space-y-3 p-4">
        <Skeleton className="h-10 w-full mb-4 rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
           <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[70%]" />
           <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
      </div>
    );
  }

  if (!user) {
    // Render nothing or a minimal component while redirecting
    return null;
  }

  // If authenticated, render the children components
  return <>{children}</>;
};
