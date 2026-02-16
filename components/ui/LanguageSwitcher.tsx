"use client"

import { useLocale } from 'next-intl';
import { usePathname, Link } from '@/i18n/routing';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
]

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full w-10 h-10">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Dil Değiştir / Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#0B0F19] border-white/10 text-slate-300 min-w-[150px] max-h-[400px] overflow-y-auto">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            asChild
            className={`cursor-pointer hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white ${locale === lang.code ? 'text-indigo-400 font-medium bg-indigo-500/10' : ''}`}
          >
            <Link href={pathname} locale={lang.code} className="flex items-center gap-2 w-full">
              <span>{lang.flag}</span> {lang.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
