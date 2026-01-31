"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AIInsights() {
  const insights = [
    {
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/20",
      title: "Verimlilik Artışı",
      description: "Geçen haftaya göre personel verimliliğinde %12 artış tespit edildi."
    },
    {
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      title: "Vardiya Dengesi",
      description: "Vardiya dağılımı bu hafta %95 oranında dengeli."
    },
    {
      icon: AlertCircle,
      color: "text-yellow-500",
      bg: "bg-yellow-100 dark:bg-yellow-900/20",
      title: "Mesai Uyarısı",
      description: "2 personel haftalık 45 saat sınırına yaklaşıyor."
    }
  ];

  return (
    <Card className="glass-card border-0 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-24 h-24" />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Asistanı
        </CardTitle>
        <CardDescription>
          Yapay zeka tabanlı işletme analizleri
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${insight.bg}`}>
              <insight.icon className={`w-5 h-5 ${insight.color}`} />
            </div>
            <div>
              <h4 className="font-medium text-sm">{insight.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {insight.description}
              </p>
            </div>
          </motion.div>
        ))}
        
        <Button className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20">
          <Sparkles className="w-4 h-4 mr-2" />
          Detaylı Rapor Oluştur
        </Button>
      </CardContent>
    </Card>
  );
}
