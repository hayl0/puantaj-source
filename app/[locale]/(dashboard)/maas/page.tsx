"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CreditCard, Download, Calendar, 
  DollarSign, Wallet, PieChart, ArrowUpRight, ArrowDownRight,
  Loader2, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";
import { format, subMonths, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Payroll {
  id: string;
  month: string;
  amount: number;
  status: string; // pending, paid
  generatedAt: string;
  paidAt?: string;
  employee: {
    name: string;
    position: string;
    department: string;
  };
}

export default function MaasPage() {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [generating, setGenerating] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const userRole = (session?.user as any)?.role || 'user';

  // Generate last 6 months options
  const monthOptions = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(new Date(), i);
      return {
          value: format(date, 'yyyy-MM'),
          label: format(date, 'MMMM yyyy', { locale: tr })
      };
  });

  useEffect(() => {
    if (session) {
      fetchPayrolls();
    }
  }, [session, selectedMonth]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/payrolls?month=${selectedMonth}`);
      if (res.ok) {
        const data = await res.json();
        setPayrolls(data);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Maaş verileri yüklenirken bir sorun oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayroll = async () => {
    try {
        setGenerating(true);
        const res = await fetch('/api/payrolls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month: selectedMonth })
        });

        const data = await res.json();

        if (res.ok) {
            toast({
                title: "Başarılı",
                description: `${data.count} personel için maaş bordrosu oluşturuldu.`,
            });
            setIsGenerateDialogOpen(false);
            fetchPayrolls();
        } else {
            toast({
                variant: "destructive",
                title: "Hata",
                description: data.error || "Maaşlar oluşturulurken bir hata oluştu.",
            });
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Hata",
            description: "Bir sunucu hatası oluştu.",
        });
    } finally {
        setGenerating(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
      try {
        const res = await fetch('/api/payrolls', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        });

        if (res.ok) {
            toast({
                title: "Güncellendi",
                description: "Ödeme durumu güncellendi.",
            });
            fetchPayrolls();
        }
      } catch (error) {
          console.error(error);
      }
  };

  // Calculate stats
  const totalAmount = payrolls.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payrolls.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payrolls.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payrolls.filter(p => p.status === 'pending').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Maaş Yönetimi" 
        description={`${monthOptions.find(m => m.value === selectedMonth)?.label || selectedMonth} Dönemi`}
      >
        <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ay Seçin" />
                </SelectTrigger>
                <SelectContent>
                    {monthOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {userRole === 'admin' && (
                 <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                 <DialogTrigger asChild>
                    <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-600/20">
                        <CreditCard className="w-4 h-4" />
                        Maaşları Hesapla
                    </Button>
                 </DialogTrigger>
                 <DialogContent>
                   <DialogHeader>
                     <DialogTitle>Maaş Bordrosu Oluştur</DialogTitle>
                     <DialogDescription>
                       {monthOptions.find(m => m.value === selectedMonth)?.label} dönemi için tüm personellerin maaş bordroları oluşturulacak. 
                       <br/><br/>
                       Mevcut maaş bilgileri kullanılacaktır. Devam etmek istiyor musunuz?
                     </DialogDescription>
                   </DialogHeader>
                   <DialogFooter>
                     <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>İptal</Button>
                     <Button onClick={handleGeneratePayroll} disabled={generating}>
                        {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Oluştur
                     </Button>
                   </DialogFooter>
                 </DialogContent>
               </Dialog>
            )}
        </div>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Stats */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <PremiumCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Tutar</p>
                <h3 className="text-3xl font-bold mt-2">{formatCurrency(totalAmount)}</h3>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <span className="text-sm font-medium">{payrolls.length} kayıt</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Wallet className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ödenen</p>
                <h3 className="text-3xl font-bold mt-2 text-emerald-600">{formatCurrency(paidAmount)}</h3>
                <div className="flex items-center gap-1 mt-1 text-emerald-500">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Tamamlandı</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <CreditCard className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bekleyen</p>
                <h3 className="text-3xl font-bold mt-2 text-amber-600">{formatCurrency(pendingAmount)}</h3>
                <div className="flex items-center gap-1 mt-1 text-amber-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{pendingCount} personel bekliyor</span>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* Payroll List */}
        <div className="md:col-span-3">
            <PremiumCard title="Maaş Listesi">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : payrolls.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                        Bu ay için henüz maaş kaydı oluşturulmamış.
                    </div>
                ) : (
                    <div className="space-y-4 mt-4">
                        {payrolls.map((payroll) => (
                        <div key={payroll.id} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-lg bg-card/50 hover:bg-card border transition-colors gap-4">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                            <Avatar className="w-10 h-10 border-2 border-background">
                                <AvatarFallback>{payroll.employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-semibold text-sm">{payroll.employee.name}</h4>
                                <p className="text-xs text-muted-foreground">{payroll.employee.position} • {payroll.employee.department}</p>
                            </div>
                            </div>
                            
                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right mr-4">
                                    <p className="font-bold text-sm">{formatCurrency(payroll.amount)}</p>
                                    <p className="text-xs text-muted-foreground">Net Maaş</p>
                                </div>
                                
                                <Badge 
                                    variant="outline" 
                                    className={`px-3 py-1 ${
                                    payroll.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    }`}
                                >
                                    {payroll.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                                </Badge>

                                {userRole === 'admin' && payroll.status === 'pending' && (
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                        onClick={() => handleUpdateStatus(payroll.id, 'paid')}
                                    >
                                        Öde
                                    </Button>
                                )}
                                {userRole === 'admin' && payroll.status === 'paid' && (
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        className="text-muted-foreground"
                                        onClick={() => handleUpdateStatus(payroll.id, 'pending')}
                                    >
                                        İptal
                                    </Button>
                                )}
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </PremiumCard>
        </div>
      </div>
    </div>
  );
}
