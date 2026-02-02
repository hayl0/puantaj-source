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
    <div className={cn("flex items-center gap-2 font-bold", className)}>
      <div className={cn(
        "w-10 h-10 rounded-xl bg-[#1e293b] flex items-center justify-center shadow-lg shadow-slate-900/20",
        iconClassName
      )}>
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Circle (Background) */}
          <circle cx="50" cy="50" r="35" stroke="#475569" strokeWidth="12" fill="none" />
          
          {/* Accent Segment (Progress/Value) - Top Right Quadrant */}
          <path d="M 50 15 A 35 35 0 0 1 85 50" stroke="#6366f1" strokeWidth="12" strokeLinecap="round" fill="none" />
          
          {/* Optional: Add a small dot or detail for extra 'tech' feel if needed, but keeping it clean for now */}
        </svg>
      </div>
      {showText && (
        <span className={cn("text-xl tracking-tight text-foreground", textClassName)}>
          Puantaj<span className="text-primary">Pro</span>
        </span>
      )}
    </div>
  );
}
