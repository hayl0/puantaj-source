"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
      </div>
      <p className="mt-4 text-muted-foreground animate-pulse">Yükleniyor...</p>
    </div>
  );
}
