"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, TrendingDown, DollarSign, 
  ArrowUpRight, ArrowDownRight, Download, Filter 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const incomeData = [
  { month: 'Oca', income: 45000, expense: 32000 },
  { month: 'Şub', income: 52000, expense: 34000 },
  { month: 'Mar', income: 48000, expense: 30000 },
  { month: 'Nis', income: 61000, expense: 40000 },
  { month: 'May', income: 55000, expense: 38000 },
  { month: 'Haz', income: 67000, expense: 42000 },
];

const expenseCategories = [
  { name: 'Personel Maaşları', value: 65, color: '#8b5cf6' },
  { name: 'Ofis Giderleri', value: 15, color: '#f43f5e' },
  { name: 'Yazılım Lisansları', value: 10, color: '#0ea5e9' },
  { name: 'Vergi & Stopaj', value: 10, color: '#f59e0b' },
];

export default function FinancePage() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  
  // Protect Admin Route
  const userRole = (session?.user as any)?.role;
  if (session && userRole !== 'admin' && userRole !== 'user') {
    redirect('/dashboard');
  }

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
            <p className="text-blue-100 font-medium mb-1">Toplam Net Kâr (Yıllık)</p>
            <h2 className="text-4xl font-bold mb-4">₺485,250</h2>
            <div className="flex items-center gap-2 text-blue-100 bg-white/10 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">+24.5% geçen yıla göre</span>
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
            <p className="text-sm text-muted-foreground">Aylık Gelir</p>
            <h3 className="text-2xl font-bold mt-1">₺67,000</h3>
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
            <p className="text-sm text-muted-foreground">Aylık Gider</p>
            <h3 className="text-2xl font-bold mt-1">₺42,000</h3>
          </div>
        </PremiumCard>

        {/* Charts */}
        <PremiumCard className="md:col-span-3" title="Gelir & Gider Analizi">
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeData}>
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
          </div>
        </PremiumCard>

        {/* Expense Distribution */}
        <PremiumCard className="md:col-span-1" title="Gider Dağılımı">
          <div className="space-y-6 mt-4">
            {expenseCategories.map((item, index) => (
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
            ))}
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
