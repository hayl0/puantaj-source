"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, TrendingDown, DollarSign, 
  ArrowUpRight, ArrowDownRight, Download, Filter, Loader2, Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { redirect } from 'next/navigation';

export default function FinancePage() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Satis'
  });
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

  const fetchData = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  const handleCreateIncome = async () => {
    if (!incomeForm.amount || !incomeForm.date) {
      toast.error("Lütfen tutar ve tarih giriniz");
      return;
    }

    try {
      const res = await fetch('/api/finance/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incomeForm)
      });

      if (res.ok) {
        toast.success("Gelir başarıyla eklendi");
        setIsIncomeDialogOpen(false);
        setIncomeForm({
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          category: 'Satis'
        });
        fetchData();
      } else {
        toast.error("Gelir eklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Error creating income:", error);
      toast.error("Bir hata oluştu");
    }
  };

  const handleDownloadReport = () => {
    if (!data.incomeData.length) {
      toast.error("İndirilecek veri bulunamadı");
      return;
    }

    try {
      // CSV Header
      let csvContent = "Ay,Gelir,Gider,Net Durum\n";

      // CSV Rows
      data.incomeData.forEach((row: any) => {
        const net = row.income - row.expense;
        csvContent += `${row.month},${row.income},${row.expense},${net}\n`;
      });

      // Add Summary Section
      csvContent += "\n\n--- Ozet Raporu ---\n";
      csvContent += `Toplam Net Kar,${data.summary.totalNetProfit}\n`;
      csvContent += `Aylik Gelir,${data.summary.monthlyIncome}\n`;
      csvContent += `Aylik Gider,${data.summary.monthlyExpense}\n`;
      csvContent += `Yillik Buyume,%${data.summary.yearlyGrowth}\n`;

      // Create Blob and Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Finans_Raporu_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Rapor başarıyla indirildi");
    } catch (error) {
      console.error("Rapor indirme hatası:", error);
      toast.error("Rapor oluşturulurken bir hata oluştu");
    }
  };

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
        
        <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 border-0">
              <Plus className="w-4 h-4" />
              Gelir Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Yeni Gelir Ekle</DialogTitle>
              <DialogDescription>
                Şirket kasasına giren yeni bir geliri kaydedin.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Tutar</Label>
                <div className="col-span-3 relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">₺</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    value={incomeForm.amount}
                    onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                    className="pl-8" 
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Tarih</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={incomeForm.date}
                  onChange={(e) => setIncomeForm({...incomeForm, date: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Kategori</Label>
                <Select 
                  value={incomeForm.category} 
                  onValueChange={(value) => setIncomeForm({...incomeForm, category: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Satis">Satış</SelectItem>
                    <SelectItem value="Hizmet">Hizmet</SelectItem>
                    <SelectItem value="Yatirim">Yatırım</SelectItem>
                    <SelectItem value="Diger">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Açıklama</Label>
                <Input 
                  id="description" 
                  value={incomeForm.description}
                  onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
                  className="col-span-3" 
                  placeholder="Opsiyonel açıklama"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateIncome}>Kaydet</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button onClick={handleDownloadReport} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20">
          <Download className="w-4 h-4" />
          Rapor İndir
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Summary Cards */}
        <PremiumCard className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
          <div className="p-2">
            <p className="text-blue-100 font-medium mb-1">Toplam Net Kâr (Yıllık)</p>
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
                +{data.summary.yearlyGrowth}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Aylık Gelir</p>
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
