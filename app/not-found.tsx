"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10 space-y-8 px-4"
      >
        <div className="relative">
          <h1 className="text-9xl font-black text-primary/10 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Sayfa Bulunamadı
            </span>
          </div>
        </div>

        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600">
              <Home className="mr-2 h-4 w-4" />
              Ana Sayfaya Git
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
