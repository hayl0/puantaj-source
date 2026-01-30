"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, Users, Calendar, Clock, CreditCard, 
  BarChart3, Settings, LogOut, PieChart,
  FileText, HelpCircle, FileCheck, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';

const allNavItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard', roles: ['admin', 'user'] },
  { icon: Users, label: 'Personel', href: '/personel', roles: ['admin'] },
  { icon: Calendar, label: 'Puantaj', href: '/puantaj', roles: ['admin', 'user'] },
  { icon: Clock, label: 'Mesai', href: '/mesai', roles: ['admin', 'user'] },
  { icon: Briefcase, label: 'Vardiya', href: '/vardiya', roles: ['admin', 'user'] },
  { icon: FileCheck, label: 'İzinler', href: '/izin', roles: ['admin', 'user'] },
  { icon: CreditCard, label: 'Maaş', href: '/maas', roles: ['admin'] },
  { icon: PieChart, label: 'Finans', href: '/finans', roles: ['admin'] },
  { icon: FileText, label: 'Raporlar', href: '/raporlar', roles: ['admin'] },
  { icon: Settings, label: 'Ayarlar', href: '/ayarlar', roles: ['admin'] },
  { icon: HelpCircle, label: 'Yardım', href: '/yardim', roles: ['admin', 'user'] },
];

export default function PremiumSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'user';

  const filteredNavItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="w-72 bg-card/50 backdrop-blur-xl border-r border-border h-screen sticky top-0 flex flex-col z-40 hidden lg:flex"
    >
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image 
              src="/logo.svg" 
              alt="Puantaj Pro Logo" 
              fill 
              className="object-contain drop-shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Puantaj Pro
            </h1>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">ULTRA PREMIUM</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-4 scrollbar-hide">
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menü</p>
        </div>
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="block"
            >
              <div
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden",
                  isActive 
                    ? "text-primary-foreground font-medium shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <item.icon className={cn("w-5 h-5 relative z-10", isActive ? "text-primary-foreground" : "group-hover:text-primary transition-colors")} />
                <span className="relative z-10">{item.label}</span>
                
                {!isActive && (
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Settings className="w-16 h-16 text-primary" />
          </div>
          
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg uppercase">
              {session?.user?.name?.substring(0, 1) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold truncate text-foreground">{session?.user?.name || 'Kullanıcı'}</p>
              <p className="text-xs text-muted-foreground truncate">{session?.user?.email || 'user@puantaj.com'}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-2 h-9"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
