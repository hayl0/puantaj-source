"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  LogOut,
  Moon,
  Sun,
  Laptop
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Komut yazın veya arama yapın..." />
      <CommandList>
        <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
        <CommandGroup heading="Sayfalar">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/personel"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Personel</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/vardiya"))}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Vardiya</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/izin"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>İzinler</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/maas"))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Maaşlar</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/raporlar"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Raporlar</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Ayarlar">
          <CommandItem onSelect={() => runCommand(() => router.push("/profil"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/ayarlar"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Ayarlar</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tema">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Aydınlık</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Karanlık</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Laptop className="mr-2 h-4 w-4" />
            <span>Sistem</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Hesap">
          <CommandItem onSelect={() => runCommand(() => signOut())}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Çıkış Yap</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
