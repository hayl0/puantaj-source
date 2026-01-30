"use client";

import { motion } from 'framer-motion';
import { Calendar, Download, Sparkles, Clock, CalendarDays, Wallet, Users, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/premium/DashboardStats';
import { RevenueChart, WorkHoursChart, DepartmentChart } from '@/components/premium/Charts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { PremiumCard } from '@/components/premium/PremiumCard';

export default function DashboardPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'user';
  const userName = session?.user?.name || 'Kullanıcı';

  const currentDate = new Date().toLocaleDateString('tr-TR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // --- ADMIN DASHBOARD ---
  if (userRole === 'admin') {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight">
              Hoş Geldin, <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{userName}!</span> 👋
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Bugün <span className="font-semibold text-foreground">{currentDate}</span>. İşler yolunda görünüyor.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-3"
          >
            <Button variant="outline" className="gap-2 rounded-xl h-11 border-primary/20 hover:bg-primary/5 hover:text-primary">
              <Calendar className="w-4 h-4" />
              Takvim
            </Button>
            <Button className="gap-2 rounded-xl h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              <Download className="w-4 h-4" />
              Rapor Al
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Personel Ekle', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', href: '/personel' },
            { label: 'İzin Talebi', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10', href: '/izin' },
            { label: 'Mesai Gir', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10', href: '/mesai' },
            { label: 'Rapor Oluştur', icon: Download, color: 'text-green-500', bg: 'bg-green-500/10', href: '/raporlar' },
          ].map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className={`p-3 rounded-xl ${action.bg}`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className="font-medium text-sm">{action.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <RevenueChart />
          <div className="col-span-4 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <WorkHoursChart />
            <DepartmentChart />
          </div>
        </div>

        {/* Recent Activity & Team Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Son Aktiviteler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { user: 'Ahmet Yılmaz', action: 'Puantaj girişi yaptı', time: '10 dakika önce', avatar: 'AY', bg: 'bg-blue-100 text-blue-600' },
                  { user: 'Ayşe Demir', action: 'Yıllık izin talebi oluşturdu', time: '25 dakika önce', avatar: 'AD', bg: 'bg-pink-100 text-pink-600' },
                  { user: 'Mehmet Kaya', action: 'Mesai kaydı düzenlendi', time: '1 saat önce', avatar: 'MK', bg: 'bg-purple-100 text-purple-600' },
                  { user: 'Fatma Şahin', action: 'Aylık raporu dışa aktardı', time: '2 saat önce', avatar: 'FŞ', bg: 'bg-orange-100 text-orange-600' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm group-hover:scale-110 transition-transform">
                      <AvatarFallback className={activity.bg}>{activity.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        <span className="font-bold text-foreground">{activity.user}</span> {activity.action.toLowerCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Detay
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-xl bg-gradient-to-br from-primary/90 to-purple-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Premium Özellikler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <h4 className="font-bold mb-1">Yapay Zeka Asistanı</h4>
                <p className="text-sm text-blue-100">Personel verilerinizi analiz edin ve öneriler alın.</p>
                <Button size="sm" className="mt-3 w-full bg-white text-primary hover:bg-blue-50">
                  Şimdi Dene
                </Button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <h4 className="font-bold mb-1">Otomatik Bordro</h4>
                <p className="text-sm text-blue-100">Tek tıkla tüm maaşları hesaplayın ve gönderin.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- USER DASHBOARD ---
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight">
            Merhaba, <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{userName}!</span> 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Bugün <span className="font-semibold text-foreground">{currentDate}</span>. İyi çalışmalar!
          </p>
        </motion.div>
      </div>

      {/* Personal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-100 dark:border-blue-900">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bu Ay Çalışılan</p>
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">142 Saat</h3>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-100 dark:border-purple-900">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600">
              <CalendarDays className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kalan İzin</p>
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400">12 Gün</h3>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-100 dark:border-emerald-900">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tahmini Hakediş</p>
              <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">₺24.500</h3>
            </div>
          </div>
        </PremiumCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shifts */}
        <Card className="glass-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Son Çalışmalarım</CardTitle>
            <CardDescription>Son 5 günlük mesai kayıtlarınız</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { day: 'Bugün', date: '30 Oca', status: 'Mesai', time: '09:00 - 18:00', type: 'Tam Zamanlı' },
                { day: 'Dün', date: '29 Oca', status: 'Mesai', time: '09:00 - 18:00', type: 'Tam Zamanlı' },
                { day: 'Pazartesi', date: '28 Oca', status: 'İzinli', time: '-', type: 'Yıllık İzin' },
                { day: 'Pazar', date: '27 Oca', status: 'Tatil', time: '-', type: 'Hafta Sonu' },
                { day: 'Cumartesi', date: '26 Oca', status: 'Tatil', time: '-', type: 'Hafta Sonu' },
              ].map((shift, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary font-bold">
                      <span className="text-xs uppercase">{shift.date.split(' ')[1]}</span>
                      <span className="text-lg">{shift.date.split(' ')[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{shift.day}</p>
                      <p className="text-xs text-muted-foreground">{shift.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      shift.status === 'Mesai' ? 'bg-green-100 text-green-800' : 
                      shift.status === 'İzinli' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {shift.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{shift.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
            <CardDescription>Sık kullandığınız işlemler</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2 border-dashed hover:border-solid hover:border-primary hover:bg-primary/5 transition-all">
              <Clock className="w-6 h-6 text-primary" />
              <span>Giriş/Çıkış Yap</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 border-dashed hover:border-solid hover:border-purple-500 hover:bg-purple-50 transition-all">
              <CalendarDays className="w-6 h-6 text-purple-600" />
              <span>İzin Talep Et</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 border-dashed hover:border-solid hover:border-emerald-500 hover:bg-emerald-50 transition-all">
              <Download className="w-6 h-6 text-emerald-600" />
              <span>Bordro İndir</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 border-dashed hover:border-solid hover:border-orange-500 hover:bg-orange-50 transition-all">
              <HelpCircle className="w-6 h-6 text-orange-600" />
              <span>Destek Talebi</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
