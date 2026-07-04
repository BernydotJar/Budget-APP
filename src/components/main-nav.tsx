'use client';

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
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        href: '/dashboard',
        label: 'Dashboard',
        description: 'Budget evidence and totals',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Activity',
    items: [
      {
        href: '/transactions',
        label: 'Transactions',
        description: 'Review income and expenses',
        icon: List,
      },
      {
        href: '/transactions/new',
        label: 'New Transaction',
        description: 'Record a budget event',
        icon: PlusCircle,
      },
    ],
  },
  {
    label: 'Insights',
    items: [
      {
        href: '/reports',
        label: 'Reports',
        description: 'Analyze budget patterns',
        icon: PieChart,
      },
    ],
  },
  {
    label: 'Setup',
    items: [
      {
        href: '/categories',
        label: 'Categories',
        description: 'Maintain classification rules',
        icon: Settings,
      },
    ],
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
    <div className="space-y-2">
      {navGroups.map((group) => (
        <SidebarGroup key={group.label} className="p-0">
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = isRouteActive(pathname, item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      size="lg"
                      className="h-auto items-start py-2"
                    >
                      <Link href={item.href}>
                        <Icon className="mt-0.5 h-4 w-4" />
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate text-sm font-medium">{item.label}</span>
                          <span className="truncate text-xs font-normal text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}

      <SidebarSeparator />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
