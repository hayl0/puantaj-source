"use client";

import { Search, Bell, Sun, Moon, Settings, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import PremiumSidebar from './Sidebar';
import { useSession, signOut } from 'next-auth/react';

export default function PremiumHeader() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <PremiumSidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="search"
              placeholder="Akıllı Arama (Cmd + K)"
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent hover:border-border focus:bg-background focus:border-primary/50 rounded-xl outline-none transition-all duration-300 placeholder:text-muted-foreground/70 text-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden lg:flex gap-1">
              <span className="text-[10px] bg-background border px-1.5 py-0.5 rounded text-muted-foreground font-medium">CMD</span>
              <span className="text-[10px] bg-background border px-1.5 py-0.5 rounded text-muted-foreground font-medium">K</span>
            </div>
          </div>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <Button variant="ghost" size="icon" className="relative hover:bg-secondary/80 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-background"></span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:bg-secondary/80 rounded-xl transition-colors"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
            <span className="sr-only">Tema Değiştir</span>
          </Button>
          
          <div className="h-8 w-px bg-border mx-2 hidden md:block" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-border hover:ring-primary transition-all p-0 overflow-hidden">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name || 'User'}`} alt="@user" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-bold uppercase">
                    {session?.user?.name?.substring(0, 2) || 'US'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session?.user?.name || 'Kullanıcı'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email || 'user@puantaj.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Ayarlar</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Çıkış Yap</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
