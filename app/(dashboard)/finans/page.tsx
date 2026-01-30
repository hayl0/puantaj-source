"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, TrendingDown, DollarSign, 
  ArrowUpRight, ArrowDownRight, Download, Filter,
  CreditCard, Wallet, Building, MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const transactions = [
  { id: 1, desc: 'Haziran Ayı Maaş Ödemeleri', category: 'Maaş', amount: -125000, date: '30 Haz 2024', status: 'completed' },
  { id: 2, desc: 'ABC Lojistik Fatura Ödemesi', category: 'Satış', amount: 45000, date: '29 Haz 2024', status: 'completed' },
  { id: 3, desc: 'AWS Sunucu Giderleri', category: 'Altyapı', amount: -450, date: '28 Haz 2024', status: 'pending' },
  { id: 4, desc: 'Ofis Kira Ödemesi', category: 'Kira', amount: -15000, date: '27 Haz 2024', status: 'completed' },
  { id: 5, desc: 'XYZ Yazılım Danışmanlık', category: 'Hizmet', amount: 28000, date: '26 Haz 2024', status: 'completed' },
];

export default function FinansPage() {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Finansal Genel Bakış" 
        description="Şirket gelir/gider durumu ve finansal raporlar"
      >
        <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtrele
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20">
            <Download className="w-4 h-4" />
            Rapor İndir
            </Button>
        </div>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <PremiumCard className="lg:col-span-2" title="Gelir & Gider Analizi">
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

        {/* Expense Distribution & Quick Stats */}
        <div className="space-y-6">
            <PremiumCard title="Gider Dağılımı">
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
                    />
                </div>
                ))}
            </div>
            </PremiumCard>
            
            <PremiumCard title="Varlıklar">
                <div className="space-y-4 mt-2">
                    <div className="flex items-center justify-between p-3 bg-card/50 border rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Kasa Nakit</p>
                                <p className="text-xs text-muted-foreground">Ana Kasa</p>
                            </div>
                        </div>
                        <p className="font-bold">₺12,450</p>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-card/50 border rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                <Building className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Banka</p>
                                <p className="text-xs text-muted-foreground">İş Bankası</p>
                            </div>
                        </div>
                        <p className="font-bold">₺145,200</p>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-card/50 border rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Kredi Kartı</p>
                                <p className="text-xs text-muted-foreground">Limit</p>
                            </div>
                        </div>
                        <p className="font-bold">₺50,000</p>
                    </div>
                </div>
            </PremiumCard>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <PremiumCard title="Son Finansal İşlemler">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İşlem Açıklaması</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">Tutar</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="group cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${transaction.amount > 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                            {transaction.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        {transaction.desc}
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant="secondary" className="font-normal">
                        {transaction.category}
                    </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                <TableCell>
                    <Badge 
                        variant="outline" 
                        className={
                            transaction.status === 'completed' 
                            ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/10' 
                            : 'text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/10'
                        }
                    >
                        {transaction.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                    </Badge>
                </TableCell>
                <TableCell className={`text-right font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}₺{Math.abs(transaction.amount).toLocaleString()}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Detayları Gör</DropdownMenuItem>
                            <DropdownMenuItem>Faturayı İndir</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">İşlemi İptal Et</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PremiumCard>
    </div>
  );
}
