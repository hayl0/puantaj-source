"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, TrendingDown, DollarSign, 
  ArrowUpRight, ArrowDownRight, Download, Filter, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function FinancePage() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    incomeData: [],
    expenseCategories: [],
    summary: {
      totalNetProfit: 0,
      monthlyIncome: 0,
      monthlyExpense: 0,
      yearlyGrowth: 0
    }
  });
  
  // Protect Admin Route
  const userRole = (session?.user as any)?.role;
  if (session && userRole !== 'admin' && userRole !== 'user') {
    redirect('/dashboard');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/finance/stats');
        if (res.ok) {
          const jsonData = await res.json();
          setData(jsonData);
        }
      } catch (error) {
        console.error('Error fetching finance stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (session) fetchData();
  }, [session]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Finansal Genel Bakış" 
        description="Şirket gelir/gider durumu ve finansal raporlar"
      >
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtrele
        </Button>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20">
          <Download className="w-4 h-4" />
          Rapor İndir
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Summary Cards */}
        <PremiumCard className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
          <div className="p-2">
            <p className="text-blue-100 font-medium mb-1">Toplam Net Kâr (Yıllık Tahmini)</p>
            <h2 className="text-4xl font-bold mb-4">₺{data.summary.totalNetProfit.toLocaleString('tr-TR')}</h2>
            <div className="flex items-center gap-2 text-blue-100 bg-white/10 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">+{data.summary.yearlyGrowth}% geçen yıla göre</span>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard>
          <div className="p-1">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/10">
                +12%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Aylık Gelir (Tahmini)</p>
            <h3 className="text-2xl font-bold mt-1">₺{data.summary.monthlyIncome.toLocaleString('tr-TR')}</h3>
          </div>
        </PremiumCard>

        <PremiumCard>
          <div className="p-1">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 dark:bg-red-900/10">
                +5%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Aylık Gider (Personel)</p>
            <h3 className="text-2xl font-bold mt-1">₺{data.summary.monthlyExpense.toLocaleString('tr-TR')}</h3>
          </div>
        </PremiumCard>

        {/* Charts */}
        <PremiumCard className="md:col-span-3" title="Gelir & Gider Analizi">
          <div className="h-[400px] w-full mt-4">
            {loading ? (
               <div className="flex items-center justify-center h-full text-muted-foreground"><Loader2 className="animate-spin mr-2" /> Yükleniyor...</div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.incomeData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₺${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  name="Gelir"
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  name="Gider"
                  stroke="#ef4444" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </PremiumCard>

        {/* Expense Distribution */}
        <PremiumCard className="md:col-span-1" title="Gider Dağılımı">
          <div className="space-y-6 mt-4">
            {data.expenseCategories.length > 0 ? (
                data.expenseCategories.map((item: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">%{item.value}</span>
                    </div>
                    <Progress 
                      value={item.value} 
                      className="h-2" 
                      indicatorColor={item.color}
                      style={{
                        '--progress-background': item.color
                      } as any}
                    />
                  </div>
                ))
            ) : (
                <div className="text-center text-muted-foreground py-10">Veri bulunamadı</div>
            )}
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Toplam aylık giderlerin kategori bazlı dağılımı
              </p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
