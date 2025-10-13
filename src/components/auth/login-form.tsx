
// src/components/auth/login-form.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Define Google Icon as SVG component
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.35 11.1H12.18V13.83H18.4C18.11 15.46 17.25 16.85 15.9 17.81V20.05H18.8C20.92 18.11 21.94 15.4 21.94 12.31C21.94 11.87 21.9 11.48 21.82 11.1H21.35Z"/>
    <path d="M12 22C14.47 22 16.51 21.19 18.09 19.92L15.19 17.5C14.31 18.09 13.22 18.4 12 18.4C9.78 18.4 7.87 16.98 7.18 14.98H4.19V17.41C5.78 20.18 8.64 22 12 22Z"/>
    <path d="M7.18 14.98C6.96 14.38 6.81 13.71 6.81 13C6.81 12.29 6.96 11.62 7.18 11.02V8.59H4.19C3.47 9.99 3 11.43 3 13C3 14.57 3.47 16.01 4.19 17.41L7.18 14.98Z"/>
    <path d="M12 7.6C13.28 7.6 14.36 8.04 15.19 8.82L18.16 5.85C16.51 4.38 14.47 3.6 12 3.6C8.64 3.6 5.78 5.82 4.19 8.59L7.18 11.02C7.87 9.02 9.78 7.6 12 7.6Z"/>
  </svg>
);


const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'user@example.com',
      password: 'password',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: "Login Successful", description: "Welcome back!" });
        // Redirect is handled by the AuthGuard or page logic
      } else {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: "Sign Up Successful", description: "Welcome to BudgetFlow!" });
         // Automatically logs in the user after signup, redirect handled elsewhere
      }
    } catch (err: any) {
      setError(err.message);
      toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: err.message || "An error occurred. Please try again.",
       });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Google Sign-In Successful", description: "Welcome!" });
      // Redirect is handled by the AuthGuard or page logic
    } catch (err: any) {
      setError(err.message);
       toast({
          variant: "destructive",
          title: "Google Sign-In Failed",
          description: err.message || "An error occurred. Please try again.",
       });
    } finally {
       setGoogleLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Enter your email below to login to your account.' : 'Enter your email and password to create an account.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                   <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLogin ? 'Login' : 'Sign Up'}
                  </Button>
                </form>
             </Form>

             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>

             <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
             >
               {googleLoading ? (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               ) : (
                 <GoogleIcon /> // Use the SVG icon component
               )}
               Google
            </Button>

            {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}

          </CardContent>
           <CardFooter className="flex flex-col items-center space-y-2">
                <Button variant="link" onClick={() => { setIsLogin(!isLogin); setError(null); form.reset(); }} className="text-sm">
                  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                </Button>
           </CardFooter>
        </Card>
    </div>
  );
}
