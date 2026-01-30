"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PremiumCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function PremiumCard({ 
  title, 
  description, 
  children, 
  footer,
  className,
  delay = 0 
}: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn(
        "glass-card border-0 shadow-xl overflow-hidden relative group",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle className="text-xl font-bold">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        
        <CardContent>
          {children}
        </CardContent>
        
        {footer && (
          <CardFooter>
            {footer}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
