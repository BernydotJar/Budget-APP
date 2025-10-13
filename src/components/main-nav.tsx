'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    List,
    FileText,
    Settings,
    LogOut,
    PlusCircle,
    PieChart
} from 'lucide-react';
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Use next/navigation

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transactions', icon: List },
    { href: '/transactions/new', label: 'New Transaction', icon: PlusCircle },
    { href: '/reports', label: 'Reports', icon: PieChart },
    { href: '/categories', label: 'Categories', icon: Settings },
];

export function MainNav() {
    const pathname = usePathname();
    const { toast } = useToast();
    const router = useRouter(); // Use useRouter from next/navigation

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({ title: "Logged Out", description: "You have been successfully logged out." });
            router.push('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error("Logout failed:", error);
            toast({
                variant: "destructive",
                title: "Logout Failed",
                description: "Could not log out. Please try again.",
            });
        }
    };


    return (
        <SidebarMenu>
            {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                        tooltip={item.label}
                    >
                        <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
             <SidebarSeparator />
             <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </SidebarMenuButton>
             </SidebarMenuItem>
        </SidebarMenu>
    );
}
