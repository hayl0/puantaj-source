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
import { useState, useEffect } from 'react';

export default function MesaiPage() {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'user';
  
  const [data, setData] = useState({
    overtimeData: [],
    pendingRequests: [],
    recentActivity: []
  });

  useEffect(() => {
      const fetchData = async () => {
          if (!session) return;
          try {
              const res = await fetch('/api/overtime/stats');
              if (res.ok) {
                  const jsonData = await res.json();
                  setData(jsonData);
              }
          } catch (error) {
              console.error('Error fetching overtime stats:', error);
          }
      };
      fetchData();
  }, [session]);

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
                Güncel
              </Badge>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.overtimeData}>
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
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorHours)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>

        {/* Recent Requests */}
        <div className="space-y-6">
          <PremiumCard title="Bekleyen Talepler">
            <div className="space-y-4">
              {data.pendingRequests.length > 0 ? (
                  data.pendingRequests.map((req: any) => (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold">
                          {req.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{req.name}</p>
                          <p className="text-xs text-muted-foreground">{req.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{req.hours} Saat</p>
                        <p className="text-xs text-muted-foreground">{req.date}</p>
                      </div>
                    </div>
                  ))
              ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">Bekleyen talep yok.</p>
              )}
            </div>
          </PremiumCard>

          <PremiumCard title="Son İşlemler">
            <div className="space-y-4">
              {data.recentActivity.length > 0 ? (
                  data.recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {activity.type === 'approved' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.name}</p>
                          <p className="text-xs text-muted-foreground">Onaylayan: {activity.approver}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{activity.hours} Saat</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))
              ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">İşlem yok.</p>
              )}
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
