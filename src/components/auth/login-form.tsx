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
import { auth, db } from '@/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, BarChart3, Database, Loader2, ShieldCheck, Sparkles, TrendingUp, WalletCards } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { subDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define Google Icon as SVG component
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.35 11.1H12.18V13.83H18.4C18.11 15.46 17.25 16.85 15.9 17.81V20.05H18.8C20.92 18.11 21.94 15.4 21.94 12.31C21.94 11.87 21.9 11.48 21.82 11.1H21.35Z" />
    <path d="M12 22C14.47 22 16.51 21.19 18.09 19.92L15.19 17.5C14.31 18.09 13.22 18.4 12 18.4C9.78 18.4 7.87 16.98 7.18 14.98H4.19V17.41C5.78 20.18 8.64 22 12 22Z" />
    <path d="M7.18 14.98C6.96 14.38 6.81 13.71 6.81 13C6.81 12.29 6.96 11.62 7.18 11.02V8.59H4.19C3.47 9.99 3 11.43 3 13C3 14.57 3.47 16.01 4.19 17.41L7.18 14.98Z" />
    <path d="M12 7.6C13.28 7.6 14.36 8.04 15.19 8.82L18.16 5.85C16.51 4.38 14.47 3.6 12 3.6C8.64 3.6 5.78 5.82 4.19 8.59L7.18 11.02C7.87 9.02 9.78 7.6 12 7.6Z" />
  </svg>
);

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

// --- DUMMY DATA SETUP ---
const dummyCategories = [
  { name: 'Groceries', color: '#FFC107' },
  { name: 'Salary', color: '#4CAF50' },
  { name: 'Utilities', color: '#2196F3' },
  { name: 'Rent', color: '#F44336' },
  { name: 'Entertainment', color: '#9C27B0' },
  { name: 'Transportation', color: '#795548' },
  { name: 'Health', color: '#E91E63' },
  { name: 'Shopping', color: '#607D8B' },
  { name: 'Travel', color: '#009688' },
  { name: 'Food Delivery', color: '#FF9800' },
];

const addDummyData = async (userId: string) => {
  try {
    console.log('Starting to add dummy data for user:', userId);
    // 1. Add dummy categories and get their new document IDs
    const categoryDocs = await Promise.all(
      dummyCategories.map(cat => addDoc(collection(db, 'categories'), { ...cat, userId }))
    );
    const categoryIdMap = new Map(dummyCategories.map((cat, i) => [cat.name, categoryDocs[i].id]));
    console.log('Dummy categories added:', categoryIdMap);

    // 2. Create a list of dummy transactions
    const now = new Date();
    const transactionsToAdd = [];
    const descriptions = {
      Groceries: ['SuperMart', 'Local Grocer', 'Farm Fresh'],
      Salary: ['Monthly Paycheck', 'Project Bonus'],
      Utilities: ['Electricity Bill', 'Internet Bill', 'Water Bill'],
      Rent: ['Monthly Rent Payment'],
      Entertainment: ['Movie Tickets', 'Concert', 'Streaming Service'],
      Transportation: ['Gas Station', 'Train Ticket', 'Bus Fare'],
      Health: ['Pharmacy', 'Doctors Visit'],
      Shopping: ['New Clothes', 'Electronics Store', 'Bookstore'],
      Travel: ['Flight tickets', 'Hotel booking'],
      FoodDelivery: ['Pizza Night', 'Sushi Delivery'],
    };

    // Generate transactions for the last 3 months
    for (let month = 0; month < 3; month++) {
      const date = subDays(now, month * 30);

      // Income
      transactionsToAdd.push({
        type: 'income',
        amount: 3500 + Math.random() * 500,
        categoryId: categoryIdMap.get('Salary'),
        description: descriptions.Salary[month % descriptions.Salary.length],
        date: subDays(date, 5),
      });

      // Expenses
      for (const cat of dummyCategories) {
        if (cat.name !== 'Salary') {
          for (let i = 0; i < (Math.random() * 3) + 1; i++) { // 1-4 transactions per category per month
            transactionsToAdd.push({
              type: 'expense',
              amount: Math.round((Math.random() * 100 + 10) * 100) / 100, // 10-110
              categoryId: categoryIdMap.get(cat.name),
              description: descriptions[cat.name as keyof typeof descriptions][i % descriptions[cat.name as keyof typeof descriptions].length],
              date: subDays(date, Math.floor(Math.random() * 28)), // Random day within the month
            });
          }
        }
      }
    }

    console.log(`Adding ${transactionsToAdd.length} dummy transactions.`);
    // 3. Add all transactions to Firestore
    await Promise.all(
      transactionsToAdd.map(t => addDoc(collection(db, 'transactions'), {
        ...t,
        userId,
        date: Timestamp.fromDate(t.date),
      }))
    );
    console.log('Dummy data successfully added.');
  } catch (error) {
    console.error('Error adding dummy data: ', error);
    // Optionally show a toast to the user
    // toast({ variant: "destructive", title: "Could not add sample data", description: error.message });
  }
};

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

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
        toast({ title: 'Login Successful', description: 'Welcome back!' });
        router.push('/dashboard');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        toast({ title: 'Sign Up Successful', description: 'Adding some sample data for you...' });

        // Add dummy data for the new user
        await addDummyData(user.uid);

        toast({ title: 'Welcome to BudgetFlow!', description: 'Sample data has been added to get you started.' });
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: err.message || 'An error occurred. Please try again.',
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
      toast({ title: 'Google Sign-In Successful', description: 'Welcome!' });
      // Here you might want to check if the user is new and add dummy data.
      // For simplicity, we'll skip that for Google Sign-In for now.
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: err.message || 'An error occurred. Please try again.',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    form.reset();
  };

  return (
    <div className="admin-shell-free-auth budgetflow-motion-shell relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.20),transparent_28%),radial-gradient(circle_at_85%_5%,rgba(236,72,153,0.16),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#edf3fb_45%,#f9f6fb_100%)] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-center gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-2xl shadow-slate-900/20">
              BF
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">BudgetFlow</p>
              <p className="text-sm text-slate-500">Premium savings cockpit</p>
            </div>
          </div>
          <div className="hidden rounded-full border border-white/70 bg-white/55 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur md:block">
            Firebase-secured access
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="scroll-story space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                BudgetFlow access
              </div>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
                  Command your budget before the month moves.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  A focused entry into transactions, categories, reports, and dashboard evidence from one secure financial cockpit.
                </p>
              </div>
            </div>

            <div className="financial-cockpit relative max-w-3xl rounded-[2rem] border border-white/80 bg-white/55 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/25">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Monthly signal</span>
                  <span>Live workspace</span>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.8fr]">
                  <div>
                    <p className="text-sm text-white/60">Available focus</p>
                    <p className="mt-1 text-4xl font-bold tracking-tight">$4,820</p>
                    <div className="mt-5 space-y-3">
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-2 w-3/4 rounded-full bg-cyan-300" />
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-2 w-1/2 rounded-full bg-fuchsia-300" />
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-2 w-2/3 rounded-full bg-emerald-300" />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">Next view</p>
                    <p className="mt-2 text-2xl font-semibold">Dashboard</p>
                    <p className="mt-2 text-sm text-white/60">Totals, category evidence, and report-ready history.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="glass-panel rounded-2xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur">
                  <ShieldCheck className="h-5 w-5 text-sky-600" />
                  <p className="mt-3 text-sm font-semibold">Secure gate</p>
                  <p className="mt-1 text-xs text-slate-500">Email or Google.</p>
                </div>
                <div className="glass-panel rounded-2xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur">
                  <TrendingUp className="h-5 w-5 text-fuchsia-600" />
                  <p className="mt-3 text-sm font-semibold">Dashboard first</p>
                  <p className="mt-1 text-xs text-slate-500">Evidence after login.</p>
                </div>
                <div className="glass-panel rounded-2xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur">
                  <Database className="h-5 w-5 text-emerald-600" />
                  <p className="mt-3 text-sm font-semibold">Starter data</p>
                  <p className="mt-1 text-xs text-slate-500">Ready on sign-up.</p>
                </div>
              </div>
            </div>
          </section>

          <Card className="glass-panel w-full rounded-[2rem] border-white/80 bg-white/75 shadow-2xl shadow-slate-900/12 backdrop-blur-xl">
            <CardHeader className="space-y-3 pb-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                <WalletCards className="h-3.5 w-3.5" />
                {isLogin ? 'Welcome back' : 'Create cockpit'}
              </div>
              <div>
                <CardTitle className="text-3xl tracking-tight">{isLogin ? 'Enter BudgetFlow' : 'Start with sample signal'}</CardTitle>
                <CardDescription className="mt-2 text-base">
                  {isLogin
                    ? 'Return to your dashboard, records, reports, and category setup.'
                    : 'Create an account and seed the workspace with starter budget data.'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isLogin && (
                <Alert className="border-sky-200 bg-sky-50/80">
                  <Database className="h-4 w-4" />
                  <AlertTitle>Sample data will be added</AlertTitle>
                  <AlertDescription>
                    Sign-up creates starter categories and recent transactions for your new account. You can edit or delete them later.
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl bg-white/80" placeholder="m@example.com" {...field} type="email" />
                        </FormControl>
                        <FormDescription>Used only to authenticate this budget workspace.</FormDescription>
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
                          <Input className="h-12 rounded-xl bg-white/80" type="password" {...field} />
                        </FormControl>
                        <FormDescription>Use at least 6 characters.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="h-12 w-full rounded-xl" disabled={loading || googleLoading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? (isLogin ? 'Logging in...' : 'Creating account...') : (isLogin ? 'Login' : 'Sign Up')}
                  </Button>
                </form>
              </Form>

              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs uppercase text-muted-foreground">Or continue with</span>
                <Separator className="flex-1" />
              </div>

              <Button
                variant="outline"
                className="h-12 w-full rounded-xl bg-white/70"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                {googleLoading ? 'Connecting...' : 'Google'}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2">
              <Button variant="link" onClick={toggleMode} className="text-sm">
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
