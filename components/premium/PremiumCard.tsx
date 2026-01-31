import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PremiumCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function PremiumCard({ children, className, gradient, ...props }: PremiumCardProps) {
  return (
    <Card 
      className={cn(
        "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md",
        gradient && "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
        className
      )} 
      {...props}
    >
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}
