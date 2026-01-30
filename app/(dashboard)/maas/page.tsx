"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CreditCard, Download, Calendar, 
  DollarSign, Wallet, PieChart, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

const salaryHistory = [
  { month: 'Ağu', amount: 110000 },
  { month: 'Eyl', amount: 115000 },
  { month: 'Eki', amount: 112000 },
  { month: 'Kas', amount: 120000 },
  { month: 'Ara', amount: 125000 },
  { month: 'Oca', amount: 135000 },
];

const lastPayments = [
  { id: 1, name: 'Ahmet Yılmaz', role: 'Senior Dev', amount: '₺25,000', status: 'paid', date: '29 Oca' },
  { id: 2, name: 'Ayşe Demir', role: 'İK Uzmanı', amount: '₺18,500', status: 'paid', date: '29 Oca' },
  { id: 3, name: 'Mehmet Kaya', role: 'Muhasebe Müdürü', amount: '₺22,000', status: 'processing', date: '30 Oca' },
  { id: 4, name: 'Fatma Şahin', role: 'Satış Temsilcisi', amount: '₺15,000', status: 'pending', date: '31 Oca' },
];

export default function MaasPage() {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Maaş Yönetimi" 
        description="Ocak 2024 • Toplam ₺135,000 ödeme planı"
      >
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          Ödeme Takvimi
        </Button>
        <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-600/20">
          <CreditCard className="w-4 h-4" />
          Toplu Ödeme Yap
        </Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Stats */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <PremiumCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Ödenen</p>
                <h3 className="text-3xl font-bold mt-2">₺135,000</h3>
                <div className="flex items-center gap-1 mt-1 text-emerald-500">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">+8.2% geçen aya göre</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Wallet className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bekleyen Ödemeler</p>
                <h3 className="text-3xl font-bold mt-2">₺12,450</h3>
                <div className="flex items-center gap-1 mt-1 text-amber-500">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-sm font-medium">3 personel bekliyor</span>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ortalama Maaş</p>
                <h3 className="text-3xl font-bold mt-2">₺18,250</h3>
                <div className="flex items-center gap-1 mt-1 text-blue-500">
                  <PieChart className="w-4 h-4" />
                  <span className="text-sm font-medium">Sektör ortalamasında</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <PieChart className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* Chart Section */}
        <PremiumCard className="md:col-span-2" title="Maaş Gider Analizi">
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salaryHistory}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `₺${value/1000}k`} 
                />
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
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>

        {/* Recent Payments */}
        <PremiumCard title="Son Ödemeler" className="h-full">
          <div className="space-y-4 mt-4">
            {lastPayments.map((payment, index) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-card/50 hover:bg-card border transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-background">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${payment.name}`} />
                    <AvatarFallback>{payment.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm">{payment.name}</h4>
                    <p className="text-xs text-muted-foreground">{payment.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{payment.amount}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] px-2 h-5 border-0 ${
                      payment.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 
                      payment.status === 'processing' ? 'bg-blue-500/10 text-blue-500' : 
                      'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {payment.status === 'paid' ? 'Ödendi' : 
                     payment.status === 'processing' ? 'İşleniyor' : 'Bekliyor'}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-foreground">
              Tümünü Gör
            </Button>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
