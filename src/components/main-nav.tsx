'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  List,
  Settings,
  LogOut,
  PlusCircle,
  PieChart,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    description: 'Budget evidence and totals',
    icon: LayoutDashboard,
  },
  {
    href: '/transactions',
    label: 'Transactions',
    description: 'Review income and expenses',
    icon: List,
  },
  {
    href: '/transactions/new',
    label: 'New',
    description: 'Record a budget event',
    icon: PlusCircle,
  },
  {
    href: '/reports',
    label: 'Reports',
    description: 'Analyze budget patterns',
    icon: PieChart,
  },
  {
    href: '/categories',
    label: 'Categories',
    description: 'Maintain classification rules',
    icon: Settings,
  },
];

function isRouteActive(pathname: string, href: string) {
  return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
}

export function MainNav() {
  const pathname = usePathname();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'Could not log out. Please try again.',
      });
    }
  };

  return (
    <div className="premium-shell-nav-wrap relative max-w-full overflow-hidden">
      <nav
        aria-label="Primary budget workspace navigation"
        className="premium-shell-chips mobile-safe-nav-scroll flex max-w-full snap-x items-center gap-1.5 overflow-x-auto rounded-full border border-white/70 bg-white/65 p-1 shadow-sm backdrop-blur-xl sm:gap-2 lg:justify-end"
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = isRouteActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.description}
              data-motion-delay={index}
              className={`motion-nav-chip group inline-flex h-9 shrink-0 snap-start items-center gap-2 rounded-full px-3 text-xs font-medium transition-all duration-300 sm:h-10 sm:px-4 sm:text-sm ${
                isActive
                  ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/15'
                  : 'text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm'
              }`}
            >
              <Icon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          data-motion-delay="5"
          className="motion-nav-chip inline-flex h-9 shrink-0 snap-start items-center gap-2 rounded-full px-3 text-xs font-medium text-slate-500 transition-all duration-300 hover:bg-white hover:text-slate-950 hover:shadow-sm sm:h-10 sm:px-4 sm:text-sm"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
