import React from 'react';
import { Zap } from 'lucide-react';
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
        "w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-primary/20",
        iconClassName
      )}>
        <Zap className="w-6 h-6" />
      </div>
      {showText && (
        <span className={cn("text-xl tracking-tight text-foreground", textClassName)}>
          Puantaj<span className="text-primary">Pro</span>
        </span>
      )}
    </div>
  );
}
