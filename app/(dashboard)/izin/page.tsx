"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, Calendar as CalendarIcon, CheckCircle, XCircle, Clock, Filter,
  Plane, AlertCircle, FileText, Loader2, CalendarDays
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";
import { createGoogleCalendarUrl } from '@/lib/calendar';
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

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason?: string;
  employee?: {
    name: string;
    email: string | null;
  };
}

import { DateRange } from "react-day-picker";

export default function IzinPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const userRole = (session?.user as any)?.role || 'user';
  const userEmail = (session?.user as any)?.email;
  
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);
  const [stats, setStats] = useState({
    balances: [
      { type: 'Yıllık İzin', total: 14, used: 0, remaining: 14, color: 'bg-purple-500', iconName: 'Plane' },
      { type: 'Hastalık İzni', total: 10, used: 0, remaining: 10, color: 'bg-pink-500', iconName: 'AlertCircle' },
      { type: 'Mazeret İzni', total: 5, used: 0, remaining: 5, color: 'bg-blue-500', iconName: 'FileText' },
    ],
    upcomingLeaves: []
  });
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 5)),
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    type: '',
    startDate: '',
    endDate: '',
    days: 0,
    reason: '',
    employeeId: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch leaves
        const leavesRes = await fetch('/api/leaves');
        if (leavesRes.ok) {
          const data = await leavesRes.json();
          setLeaves(data);
        }

        // Fetch stats (balances & upcoming)
        const statsRes = await fetch('/api/leave/stats');
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }

        // Fetch employees if admin
        if (userRole === 'admin' || userRole === 'user') {
          const empRes = await fetch('/api/employees');
          if (empRes.ok) {
            const data = await empRes.json();
            setEmployees(data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Veriler yüklenirken bir sorun oluştu.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session, userRole, toast]);

  const handleCreateLeave = async () => {
    if (!newLeave.type || !newLeave.startDate || !newLeave.endDate || !newLeave.days) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Lütfen tüm zorunlu alanları doldurun.",
      });
      return;
    }

    if ((userRole === 'admin' || userRole === 'user') && !newLeave.employeeId) {
      toast({
        variant: "destructive",
        title: "Personel Seçimi",
        description: "Lütfen bir personel seçin.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeave),
      });

      if (res.ok) {
        toast({
          title: "Başarılı",
          description: "İzin talebi oluşturuldu.",
        });
        setIsDialogOpen(false);
        setNewLeave({ type: '', startDate: '', endDate: '', days: 0, reason: '', employeeId: '' });
        // Refresh data
        const leavesRes = await fetch('/api/leaves');
        if (leavesRes.ok) {
          const data = await leavesRes.json();
          setLeaves(data);
        }
      } else {
        const error = await res.json();
        toast({
          variant: "destructive",
          title: "Hata",
          description: error.error || "İzin oluşturulamadı.",
        });
      }
    } catch (error) {
      console.error("Error creating leave:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Bir hata oluştu.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate balances (Mock logic based on usage)
  // const calculateBalances = () => { ... } // Removed

  // const leaveBalances = calculateBalances(); // Removed

  return (
    <div className="space-y-8">
      <PageHeader 
        title="İzin Yönetimi" 
        description={userRole === 'admin' 
          ? "Personel izin taleplerini onaylayın ve takvimi yönetin" 
          : "İzin durumunuzu görüntüleyin ve yeni talep oluşturun"}
      >
        <Button variant="outline" className="gap-2">
          <CalendarIcon className="w-4 h-4" />
          Yıllık Plan
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-600/20">
              <Plus className="w-4 h-4" />
              İzin Talebi Oluştur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Yeni İzin Talebi</DialogTitle>
              <DialogDescription>
                İzin detaylarını giriniz.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {(userRole === 'admin' || userRole === 'user') && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee" className="text-right">
                    Personel
                  </Label>
                  <Select 
                    onValueChange={(val) => setNewLeave({...newLeave, employeeId: val})}
                    value={newLeave.employeeId}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Personel Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  İzin Türü
                </Label>
                <Select 
                  onValueChange={(val) => setNewLeave({...newLeave, type: val})}
                  value={newLeave.type}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Tür Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yıllık İzin">Yıllık İzin</SelectItem>
                    <SelectItem value="Hastalık İzni">Hastalık İzni</SelectItem>
                    <SelectItem value="Mazeret İzni">Mazeret İzni</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start" className="text-right">
                  Başlangıç
                </Label>
                <Input
                  id="start"
                  type="date"
                  className="col-span-3"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end" className="text-right">
                  Bitiş
                </Label>
                <Input
                  id="end"
                  type="date"
                  className="col-span-3"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="days" className="text-right">
                  Gün Sayısı
                </Label>
                <Input
                  id="days"
                  type="number"
                  className="col-span-3"
                  value={newLeave.days}
                  onChange={(e) => setNewLeave({...newLeave, days: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Açıklama
                </Label>
                <Input
                  id="reason"
                  className="col-span-3"
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateLeave} disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Oluştur
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.balances.map((balance, i) => (
          <PremiumCard key={i} className="relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${balance.color} bg-opacity-10 text-${balance.color.split('-')[1]}-500`}>
                {/* Dynamically render icon based on name if needed, or fallback */}
                {balance.type === 'Yıllık İzin' ? <Plane className="w-6 h-6" /> : 
                 balance.type === 'Hastalık İzni' ? <AlertCircle className="w-6 h-6" /> : 
                 <FileText className="w-6 h-6" />}
              </div>
              <Badge variant="outline" className="text-lg font-bold">
                {balance.remaining} Gün Kaldı
              </Badge>
            </div>
            <h3 className="font-bold text-lg mb-1">{balance.type}</h3>
            <div className="flex justify-between text-sm text-muted-foreground mb-3">
              <span>Toplam: {balance.total} gün</span>
              <span>Kullanılan: {balance.used} gün</span>
            </div>
            <Progress value={Math.min((balance.used / balance.total) * 100, 100)} className="h-2" />
          </PremiumCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <PremiumCard className="lg:col-span-1">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            İzin Takvimi
          </h3>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
          />
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Yaklaşan İzinler</h4>
            {loading ? (
               <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
            ) : leaves.filter(r => r.status === 'approved').slice(0, 2).map((req) => (
              <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{(req.employee?.name || "P")[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{req.employee?.name || "Personel"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PremiumCard>

        {/* Requests List */}
        <PremiumCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">İzin Talepleri</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
               <div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8" /></div>
            ) : leaves.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">İzin talebi bulunmuyor.</div>
            ) : (
              leaves.map((req) => (
                <div key={req.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-secondary/30 transition-colors gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center shrink-0
                      ${req.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 
                        req.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                    `}>
                      {req.status === 'pending' ? <Clock className="w-5 h-5" /> : 
                       req.status === 'approved' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{req.employee?.name || "Personel"}</h4>
                      <p className="text-sm text-muted-foreground">{req.type} • {req.days} Gün</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(req.startDate).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">{new Date(req.endDate).toLocaleDateString()}</p>
                    </div>
                    
                    {req.status === 'approved' && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title="Google Takvim'e Ekle"
                            onClick={() => {
                                const url = createGoogleCalendarUrl({
                                    title: `İzin: ${req.type}`,
                                    description: `Personel: ${req.employee?.name || "Ben"}\nSebep: ${req.reason || "-"}`,
                                    startDate: new Date(req.startDate),
                                    endDate: new Date(req.endDate),
                                    location: 'Ofis Dışı'
                                });
                                window.open(url, '_blank');
                            }}
                        >
                            <CalendarDays className="w-4 h-4" />
                        </Button>
                    )}

                    {userRole === 'admin' && req.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-8">Onayla</Button>
                        <Button size="sm" variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10 h-8">Reddet</Button>
                      </div>
                    ) : (
                      <Badge variant={req.status === 'pending' ? 'secondary' : req.status === 'approved' ? 'default' : 'destructive'}>
                        {req.status === 'pending' ? 'Bekliyor' : req.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
