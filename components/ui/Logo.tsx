import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

export function Logo({ className, iconClassName, textClassName, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 font-bold group", className)}>
      <div className={cn(
        "w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white relative overflow-hidden group-hover:shadow-indigo-500/30 transition-all duration-300",
        iconClassName
      )}>
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Abstract Person/User shape - Head */}
          <circle cx="50" cy="35" r="12" fill="currentColor" className="opacity-90" />
          
          {/* Abstract Person/User shape - Body (curved) */}
          <path d="M25 80 C25 60, 35 55, 50 55 C65 55, 75 60, 75 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="opacity-90" />
          
          {/* Checkmark / Success indicator (bottom right) */}
          <path d="M65 75 L75 85 L90 65" stroke="#4ade80" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Clock/Time indicator (top right small accent) */}
          <circle cx="80" cy="25" r="8" stroke="#fbbf24" strokeWidth="4" className="opacity-80" />
          <path d="M80 25 L80 21" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
          <path d="M80 25 L83 25" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      {showText && (
        <div className={cn("flex flex-col justify-center leading-none", textClassName)}>
          <span className="text-xl tracking-tight font-black text-foreground">
            Puantaj<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Pro</span>
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase opacity-80 pl-0.5 whitespace-nowrap">
            Personel Yönetimi
          </span>
        </div>
      )}
    </div>
  );
}
