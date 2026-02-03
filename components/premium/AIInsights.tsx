"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, TrendingUp, Users, AlertCircle, BrainCircuit, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

export default function AIInsights() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);

  const generateInsights = () => {
    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setInsights([
        {
          icon: TrendingUp,
          color: "text-emerald-500",
          bg: "bg-emerald-100 dark:bg-emerald-900/20",
          title: "Verimlilik Artışı",
          description: "Son 7 günde personel katılımı %12 artış gösterdi."
        },
        {
          icon: Users,
          color: "text-blue-500",
          bg: "bg-blue-100 dark:bg-blue-900/20",
          title: "Vardiya Dağılımı",
          description: "Vardiya yükü bu hafta optimum seviyede (%95)."
        },
        {
          icon: AlertCircle,
          color: "text-amber-500",
          bg: "bg-amber-100 dark:bg-amber-900/20",
          title: "Mesai Uyarısı",
          description: "2 personel yasal mesai sınırına yaklaşıyor."
        },
        {
          icon: BrainCircuit,
          color: "text-violet-500",
          bg: "bg-violet-100 dark:bg-violet-900/20",
          title: "AI Önerisi",
          description: "Gelecek hafta için Cuma vardiyasında yoğunluk bekleniyor."
        }
      ]);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    generateInsights();
  }, []);

  const handleRefresh = () => {
    generateInsights();
    toast({
      title: "AI Analizi Başlatıldı",
      description: "Veriler yeniden işleniyor ve analiz ediliyor...",
    });
  };

  return (
    <Card className="glass-card border-0 shadow-xl relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles className="w-32 h-32 text-primary" />
      </div>
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
            <Sparkles className="w-6 h-6 text-violet-500" />
            Puantaj AI
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={loading} className="hover:bg-violet-100 dark:hover:bg-violet-900/20 rounded-full">
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Yapay zeka destekli operasyonel analizler
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 space-y-4"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-violet-200 dark:border-violet-900/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
                <BrainCircuit className="absolute inset-0 m-auto w-6 h-6 text-violet-500 animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground font-medium animate-pulse">Veriler Analiz Ediliyor...</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex items-start gap-4 p-3 rounded-xl border border-transparent hover:border-violet-200 dark:hover:border-violet-800 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className={`p-2.5 rounded-xl ${insight.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <insight.icon className={`w-5 h-5 ${insight.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground/90">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </CardContent>

      <div className="p-4 pt-0 mt-auto relative z-10">
        <Button className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-lg shadow-violet-500/25 border-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
          <BrainCircuit className="w-4 h-4 mr-2" />
          Detaylı Rapor Oluştur
        </Button>
      </div>
    </Card>
  );
}
