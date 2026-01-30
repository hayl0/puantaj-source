"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, Calendar as CalendarIcon, CheckCircle, XCircle, Clock, Filter,
  Plane, AlertCircle, FileText
} from 'lucide-react';
import { useSession } from 'next-auth/react';

const leaveRequests = [
  { id: 1, name: 'Ahmet Yılmaz', type: 'Yıllık İzin', startDate: '2024-02-10', endDate: '2024-02-15', days: 5, status: 'pending', avatar: '/avatars/01.png' },
  { id: 2, name: 'Ayşe Demir', type: 'Hastalık İzni', startDate: '2024-01-28', endDate: '2024-01-30', days: 2, status: 'approved', avatar: '/avatars/02.png' },
  { id: 3, name: 'Mehmet Kaya', type: 'Mazeret İzni', startDate: '2024-02-05', endDate: '2024-02-05', days: 1, status: 'rejected', avatar: '/avatars/03.png' },
  { id: 4, name: 'Fatma Şahin', type: 'Yıllık İzin', startDate: '2024-03-01', endDate: '2024-03-10', days: 9, status: 'pending', avatar: '/avatars/04.png' },
];

const leaveBalances = [
  { type: 'Yıllık İzin', total: 14, used: 5, remaining: 9, color: 'bg-purple-500', icon: Plane },
  { type: 'Hastalık İzni', total: 10, used: 2, remaining: 8, color: 'bg-pink-500', icon: AlertCircle },
  { type: 'Mazeret İzni', total: 5, used: 1, remaining: 4, color: 'bg-blue-500', icon: FileText },
];

export default function IzinPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'user';

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
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-600/20">
          <Plus className="w-4 h-4" />
          İzin Talebi Oluştur
        </Button>
      </PageHeader>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaveBalances.map((balance, i) => (
          <PremiumCard key={i} className="relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${balance.color} bg-opacity-10 text-${balance.color.split('-')[1]}-500`}>
                <balance.icon className="w-6 h-6" />
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
            <Progress value={(balance.used / balance.total) * 100} className="h-2" />
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
            className="rounded-xl border border-border/50 w-full flex justify-center bg-secondary/20 p-4"
            selected={{
              from: new Date(2024, 1, 10),
              to: new Date(2024, 1, 15)
            }}
          />
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Yaklaşan İzinler</h4>
            {leaveRequests.filter(r => r.status === 'approved').slice(0, 2).map((req) => (
              <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={req.avatar} />
                  <AvatarFallback>{req.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{req.name}</p>
                  <p className="text-xs text-muted-foreground">{req.startDate} - {req.endDate}</p>
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
            {leaveRequests.map((req) => (
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
                    <h4 className="font-medium">{req.name}</h4>
                    <p className="text-sm text-muted-foreground">{req.type} • {req.days} Gün</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="text-sm font-medium">{req.startDate}</p>
                    <p className="text-xs text-muted-foreground">{req.endDate}</p>
                  </div>
                  
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
            ))}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
