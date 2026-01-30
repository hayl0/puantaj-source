"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, Users, Clock, Calendar, BarChart3, CreditCard, 
  Moon, Settings, HelpCircle, LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const allMenuItems = [
    { href: '/dashboard', icon: <Home size={20} />, label: 'Dashboard', roles: ['admin', 'user'] },
    { href: '/personel', icon: <Users size={20} />, label: 'Personel', roles: ['admin'] },
    { href: '/puantaj', icon: <Clock size={20} />, label: 'Puantaj', roles: ['admin', 'user'] },
    { href: '/izin', icon: <Calendar size={20} />, label: 'İzinler', roles: ['admin', 'user'] },
    { href: '/finans', icon: <CreditCard size={20} />, label: 'Finans', roles: ['admin'] },
    { href: '/mesai', icon: <Moon size={20} />, label: 'Mesai', roles: ['admin', 'user'] },
    { href: '/raporlar', icon: <BarChart3 size={20} />, label: 'Raporlar', roles: ['admin'] },
    { href: '/ayarlar', icon: <Settings size={20} />, label: 'Ayarlar', roles: ['admin', 'user'] },
  ];

  const userRole = (session?.user as any)?.role || 'user';

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-72 bg-card/50 backdrop-blur-xl border-r border-border h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-sm">Pro</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Puantaj Pro
            </h1>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">
              {userRole === 'admin' ? 'ENTERPRISE' : 'PERSONEL'}
            </p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <h3 className="text-xs uppercase text-muted-foreground font-bold mb-4 px-4 tracking-wider">
            Ana Menü
          </h3>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden",
                    isActive 
                      ? "text-primary-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <span className={cn("relative z-10 mr-3 transition-colors", isActive ? "text-white" : "group-hover:text-primary")}>
                    {item.icon}
                  </span>
                  <span className="relative z-10 text-sm">{item.label}</span>
                  
                  {!isActive && (
                    <span className="ml-auto relative z-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-primary">
                      →
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xs uppercase text-muted-foreground font-bold mb-4 px-4 tracking-wider">
            Destek
          </h3>
          <Link
            href="/yardim"
            className="flex items-center px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all group"
          >
            <HelpCircle size={20} className="mr-3 group-hover:text-primary transition-colors" />
            <span className="text-sm">Yardım Merkezi</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="bg-gradient-to-br from-card to-muted p-4 rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-sm">
                  {session?.user?.name?.substring(0, 2).toUpperCase() || 'TR'}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{session?.user?.name || 'Kullanıcı'}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{userRole}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900"
          >
            <LogOut size={14} />
            <span>Oturumu Kapat</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
