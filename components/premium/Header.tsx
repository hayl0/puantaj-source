"use client";

import { Search, Bell, Sun, Moon, User, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useSidebar } from '@/components/providers/SidebarProvider';
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
    <header className="sticky top-0 z-30 h-20 glass border-b border-border/40 px-4 md:px-8 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-6 h-6" />
        </Button>
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
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative w-10 h-10 rounded-xl hover:bg-secondary/80"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
          <span className="sr-only">Tema Değiştir</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative w-10 h-10 rounded-xl hover:bg-secondary/80">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
        </Button>
        
        <div className="h-8 w-[1px] bg-border/50 mx-2" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 pl-2 cursor-pointer group">
              <div className="text-right hidden md:block group-hover:opacity-80 transition-opacity">
                <p className="text-sm font-semibold text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-lg ring-2 ring-transparent group-hover:ring-primary transition-all">
                <AvatarImage src="/placeholder-user.jpg" />
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
              onClick={() => signOut()}
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
