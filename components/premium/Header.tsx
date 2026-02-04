"use client";

import { Search, Bell, Sun, Moon, User, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { Link } from '@/i18n/routing';
import { useSidebar } from '@/components/providers/SidebarProvider';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function PremiumHeader() {
  const { setTheme, theme } = useTheme();
  const { data: session } = useSession();
  const { toggle } = useSidebar();

  const user = session?.user;
  const userName = user?.name || "Kullanıcı";
  const userEmail = user?.email || "kullanici@puantaj.com";
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const userRole = (user as any)?.role === 'admin' ? 'Yönetici' : 'Personel';

  return (
    <header className="sticky top-0 z-30 h-20 bg-background/60 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <Button
          variant="outline"
          size="icon"
          onClick={toggle}
          className="lg:hidden h-10 w-10 md:h-12 md:w-12 rounded-lg border-2 border-primary/20 bg-background/50 backdrop-blur-md shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:border-primary/50 transition-all active:scale-95 group"
        >
          <Menu className="w-5 h-5 md:w-7 md:h-7 text-primary group-hover:scale-110 transition-transform" />
        </Button>
        
        <div className="block lg:hidden ml-2 md:ml-4 shrink-0">
          <Logo className="text-xl md:text-2xl" />
        </div>
        <div className="hidden lg:block mr-4 shrink-0">
          <Logo className="text-2xl" />
        </div>

        <div className="relative group flex-1 hidden md:block">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="search"
            placeholder="Arama yap..."
            className="w-full pl-12 pr-12 py-3 bg-secondary/50 dark:bg-slate-900/50 border border-transparent hover:border-border/50 focus:border-primary/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative w-12 h-12 rounded-xl hover:bg-secondary/80">
              <Bell className="w-6 h-6 text-muted-foreground" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 glass-card border-border/50 p-0">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h4 className="font-semibold">Bildirimler</h4>
              <span className="text-xs text-muted-foreground">0 okunmamış</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-4 text-center text-muted-foreground text-sm">
              <p>Yeni bildiriminiz yok.</p>
            </div>
            <div className="p-2 border-t border-border/50">
              <Button variant="ghost" className="w-full text-xs h-8" disabled>Tümünü Okundu İşaretle</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="h-8 w-[1px] bg-border/50 mx-2" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 pl-2 cursor-pointer group">
              <div className="text-right hidden md:block group-hover:opacity-80 transition-opacity">
                <p className="text-sm font-semibold text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-lg ring-2 ring-transparent group-hover:ring-primary transition-all">
                <AvatarImage src={session?.user?.image || "/placeholder-user.jpg"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-bold">{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card border-border/50 p-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem asChild>
              <Link href="/profil" className="w-full cursor-pointer flex items-center focus:bg-primary/10 rounded-lg">
                <User className="mr-2 h-4 w-4 text-primary" />
                <span>Profilim</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/ayarlar" className="w-full cursor-pointer flex items-center focus:bg-primary/10 rounded-lg">
                <Settings className="mr-2 h-4 w-4 text-primary" />
                <span>Ayarlar</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem 
              className="focus:bg-red-500/10 text-red-600 focus:text-red-600 cursor-pointer rounded-lg"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
