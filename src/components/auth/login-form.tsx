'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'eduardo.sacahui@gmail.com',
      password: '123456',
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Enter your email below to login to your account.' : 'Enter your email and password to create an account.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                 {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLogin ? 'Login' : 'Sign Up'}
                  </Button>
                </form>
             </Form>
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
