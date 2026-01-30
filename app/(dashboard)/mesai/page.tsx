"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from "@/components/ui/progress";
import { 
  Clock, Plus, Filter, Download, 
  TrendingUp, Calendar, ArrowRight,
  CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const overtimeData = [
  { name: 'Pzt', hours: 4.5 },
  { name: 'Sal', hours: 3.2 },
  { name: 'Çar', hours: 5.8 },
  { name: 'Per', hours: 2.1 },
  { name: 'Cum', hours: 6.4 },
  { name: 'Cmt', hours: 8.0 },
  { name: 'Paz', hours: 0 },
];

const pendingRequests = [
  { id: 1, name: 'Can Yıldız', reason: 'Proje Teslimi', date: '30 Ocak', hours: 3, status: 'pending' },
  { id: 2, name: 'Zeynep Arslan', reason: 'Müşteri Toplantısı', date: '30 Ocak', hours: 2, status: 'pending' },
];

const recentActivity = [
  { id: 1, name: 'Ahmet Yılmaz', type: 'approved', hours: 2.5, date: 'Dün', approver: 'Sistem' },
  { id: 2, name: 'Mehmet Kaya', type: 'rejected', hours: 4, date: 'Dün', approver: 'Admin' },
  { id: 3, name: 'Ayşe Demir', type: 'approved', hours: 1, date: '28 Ocak', approver: 'Sistem' },
];

export default function MesaiPage() {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'user';

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Mesai Takibi" 
        description={userRole === 'admin' 
          ? "Fazla mesai taleplerini yönetin ve analiz edin" 
          : "Mesai taleplerinizi oluşturun ve durumlarını takip edin"}
      >
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Rapor
        </Button>
        <Button className="gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/20">
          <Plus className="w-4 h-4" />
          Talep Oluştur
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <PremiumCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Haftalık Mesai Özeti</h3>
              <p className="text-sm text-muted-foreground">Son 7 günlük fazla mesai dağılımı</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </Badge>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overtimeData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--muted-foreground)' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorHours)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>

        {/* Quick Stats & Pending */}
        <div className="space-y-6">
          <PremiumCard className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-none">
            <div className="mb-4">
              <p className="text-orange-100 mb-1">Bu Ay Toplam</p>
              <h3 className="text-4xl font-bold">142.5s</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-orange-100">
                <span>Bütçe Kullanımı</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2 bg-black/20" indicatorClassName="bg-white" />
              <p className="text-xs text-orange-200 mt-2">Geçen aya göre 12 saat daha az</p>
            </div>
          </PremiumCard>

          {userRole === 'admin' && (
            <PremiumCard>
              <h3 className="font-bold mb-4 flex items-center justify-between">
                Onay Bekleyenler
                <Badge variant="secondary">{pendingRequests.length}</Badge>
              </h3>
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                    <div>
                      <p className="font-medium text-sm">{req.name}</p>
                      <p className="text-xs text-muted-foreground">{req.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{req.hours}s</p>
                      <div className="flex gap-1 mt-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-green-500 hover:text-green-600 hover:bg-green-500/10">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-500/10">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCard>
          )}
        </div>
      </div>

      {/* Recent Activity List */}
      <PremiumCard>
        <h3 className="text-lg font-bold mb-6">Son Hareketler</h3>
        <div className="space-y-1">
          {recentActivity.map((activity, i) => (
            <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-secondary/30 rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${activity.type === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                `}>
                  {activity.type === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.type === 'approved' ? 'Mesai onaylandı' : 'Mesai reddedildi'} • {activity.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="h-8 px-3">
                  {activity.hours} Saat
                </Badge>
                <div className="text-right text-sm text-muted-foreground hidden sm:block">
                  <p>İşlem yapan:</p>
                  <p className="font-medium text-foreground">{activity.approver}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}
