
"use client";

import { 
  Home, Users, Calendar, Clock, CreditCard, 
  BarChart3, Settings, Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { Logo } from '@/components/ui/Logo';

const allNavItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard', roles: ['admin', 'user', 'personnel'] },
  { icon: Users, label: 'Personel', href: '/personel', roles: ['admin'] },
  { icon: Calendar, label: 'Puantaj', href: '/puantaj', roles: ['admin', 'user', 'personnel'] },
  { icon: Clock, label: 'Mesai', href: '/mesai', roles: ['admin', 'user', 'personnel'] },
  { icon: Briefcase, label: 'İzin', href: '/izin', roles: ['admin', 'user', 'personnel'] },
  { icon: CreditCard, label: 'Maaş', href: '/maas', roles: ['admin', 'user', 'personnel'] },
  { icon: BarChart3, label: 'Finans', href: '/finans', roles: ['admin'] },
  { icon: BarChart3, label: 'Raporlar', href: '/raporlar', roles: ['admin'] },
  { icon: Settings, label: 'Ayarlar', href: '/ayarlar', roles: ['admin'] },
];

export default function PremiumSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'user'; // Default to user if unknown, but 'personnel' will be explicit

  // Filter items based on role
  // If role is 'user' (which is actually Admin in our schema default, but let's be careful),
  // In authOptions: User -> role: user.role (default 'user').
  // Employee -> role: 'personnel'.
  // So 'user' usually means Admin/Owner. 'personnel' means Employee.
  // I will treat 'user' and 'admin' as having full access for now, or check schema default.
  // Schema: role String @default("user").
  // So Admins have role 'user' by default unless changed.
  // But wait, my Admin Register API sets role: 'admin'.
  // So new Admins are 'admin'. Old/Demo might be 'user'.
  // I should treat 'admin' AND 'user' (legacy admin) as privileged, and 'personnel' as restricted.
  
  const isAdmin = userRole === 'admin' || userRole === 'user';

  const filteredNavItems = allNavItems.filter(item => {
    if (isAdmin) return true; // Admins see everything
    return item.roles.includes('personnel'); // Personnel only see their allowed items
  });

  return (
    <aside className="w-72 bg-card/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-border/50 flex flex-col shadow-2xl z-40">
      <div className="p-8 pb-4">
        <Logo 
          textClassName="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400" 
        />
        <div className="mt-6 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/10 backdrop-blur-sm">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">
            {isAdmin ? 'YÖNETİCİ HESABI' : 'PERSONEL HESABI'}
          </p>
          <p className="text-sm font-bold text-foreground truncate">
            {session?.user?.name || 'Kullanıcı'}
          </p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
              )}
              <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <span className="font-bold text-primary">
                {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-medium truncate">{session?.user?.name || 'Kullanıcı'}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">{userRole === 'user' ? 'Yönetici' : userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
