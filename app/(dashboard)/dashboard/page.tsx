"use client";

import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Download, 
  Sparkles, 
  Clock, 
  CalendarDays, 
  Wallet, 
  Users, 
  HelpCircle,
  Briefcase,
  CheckCircle2,
  Activity,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/premium/DashboardStats';
import { RevenueChart, WorkHoursChart, DepartmentChart } from '@/components/premium/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { createGoogleCalendarUrl } from '@/lib/calendar';
import { tr } from 'date-fns/locale';

export default function DashboardPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'user';
  const userName = session?.user?.name || 'Kullanıcı';
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [chartData, setChartData] = useState({
    revenueData: [],
    workHoursData: [],
    deptData: [],
    activities: [],
    departmentStatus: []
  });

  useEffect(() => {
    const fetchCharts = async () => {
      if (userRole !== 'admin') return;
      try {
        const res = await fetch('/api/dashboard/charts');
        if (res.ok) {
          const data = await res.json();
          setChartData(data);
        }
      } catch (error) {
        console.error('Failed to fetch chart data', error);
      }
    };
    fetchCharts();
  }, [userRole]);

  const currentDate = new Date().toLocaleDateString('tr-TR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // --- ADMIN DASHBOARD ---
  if (userRole === 'admin') {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-10"
      >
        {/* Welcome Section with Gradient Mesh Background */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-purple-500/5 border border-white/10 p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 text-primary mb-2">
                👋 Hoş Geldin, Yönetici
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Merhaba, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{userName}</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Bugün <span className="font-semibold text-foreground">{currentDate}</span>. Şirket genel durumu stabil ve verimlilik yüksek.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setIsCalendarOpen(true)} className="gap-2 h-12 px-6 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background border-white/10 transition-all hover:scale-105">
                <CalendarIcon className="w-4 h-4" />
                Takvim
              </Button>
              <Button className="gap-2 h-12 px-6 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40">
                <Download className="w-4 h-4" />
                Hızlı Rapor
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Charts & Quick Actions) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions App Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Hızlı İşlemler
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Personel Ekle', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-200/20', href: '/personel' },
                  { label: 'İzin Talepleri', icon: CalendarDays, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-200/20', href: '/izin' },
                  { label: 'Mesai Girişi', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-200/20', href: '/mesai' },
                  { label: 'Bordro Hesapla', icon: Wallet, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-200/20', href: '/maas' },
                ].map((action, i) => (
                  <Link href={action.href} key={i}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className={`group relative p-6 rounded-2xl border ${action.border} bg-background/50 backdrop-blur-sm hover:bg-background shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden h-full`}
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 ${action.bg} rounded-bl-full -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="relative z-10 flex flex-col items-start gap-4">
                        <div className={`p-3 rounded-xl ${action.bg} ${action.color} shadow-sm`}>
                          <action.icon className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Main Chart */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Finansal Genel Bakış</h3>
                  <p className="text-sm text-muted-foreground">Son 6 aylık personel maliyetleri</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">Detaylı Analiz</Button>
              </div>
              <RevenueChart data={chartData.revenueData} />
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Çalışma Saatleri</h3>
                <WorkHoursChart data={chartData.workHoursData} />
              </div>
              <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Departman Dağılımı</h3>
                <DepartmentChart data={chartData.deptData} />
              </div>
            </div>
          </div>

          {/* Right Column (Activity & Insights) */}
          <div className="space-y-8 sticky top-6 h-fit">
            
            {/* AI Insights Card */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-6 shadow-2xl"
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/20 rounded-full blur-2xl animate-pulse" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg">AI Asistan Önerisi</h3>
                </div>
                
                <p className="text-indigo-100 mb-6 leading-relaxed">
                  "Bu ay Yazılım departmanında fazla mesai oranları geçen aya göre %15 arttı. Ekip yorgunluğu riskini azaltmak için vardiya planlamasını optimize etmeyi düşünebilirsiniz."
                </p>
                
                <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 border-0 shadow-lg">
                  Detayları İncele
                </Button>
              </div>
            </motion.div>

            {/* Recent Activity Feed */}
            <Card className="glass-card border-0 shadow-xl bg-background/60 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Canlı Akış
                </CardTitle>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Canlı</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {chartData.activities.length > 0 ? (
                    chartData.activities.map((activity: any, i) => (
                      <div key={i} className="flex items-start gap-4 group">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                            <AvatarFallback className={activity.bg}>{activity.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                            {activity.type === 'attendance' ? (
                              <CheckCircle2 className={`w-3 h-3 ${activity.bg.split(' ')[1]}`} />
                            ) : activity.type === 'leave' ? (
                              <CalendarDays className={`w-3 h-3 ${activity.bg.split(' ')[1]}`} />
                            ) : (
                              <Users className={`w-3 h-3 ${activity.bg.split(' ')[1]}`} />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-none text-foreground">
                            {activity.user}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {activity.action}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap bg-secondary/50 px-2 py-1 rounded-full">
                          {activity.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Henüz aktivite yok.</p>
                  )}
                </div>
                <Button variant="ghost" className="w-full mt-6 text-muted-foreground hover:text-primary">
                  Tüm Aktiviteleri Gör
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats List */}
            <Card className="glass-card border-0 shadow-xl bg-background/60 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Departman Durumu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {chartData.departmentStatus.length > 0 ? (
                  chartData.departmentStatus.map((dept: any, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${dept.color}`} />
                        <span className="font-medium">{dept.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-bold">{dept.count}/{dept.total}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Departman verisi yok.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Takvim</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={tr}
              />
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    );
  }

  // --- USER (PERSONNEL) DASHBOARD ---
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      {/* User Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 md:p-10 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-16 -mr-16 animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-emerald-100 mb-2">
               <Briefcase className="w-4 h-4" />
               <span className="text-sm font-medium uppercase tracking-wider">Personel Paneli</span>
             </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Merhaba, {userName} 👋
            </h1>
            <p className="text-emerald-50 text-lg max-w-xl">
              İyi çalışmalar! Bugün <span className="font-semibold text-white">{currentDate}</span>.
              <br/>
              Bir sonraki vardiyan yarın 09:00'da başlıyor.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
             <div className="text-right">
               <p className="text-xs text-emerald-200 uppercase font-bold tracking-wider">Şu Anki Durum</p>
               <p className="text-xl font-bold text-white flex items-center justify-end gap-2">
                 <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                 Mesai Dışı
               </p>
             </div>
             <Button variant="secondary" className="h-12 px-6 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform">
               Giriş Yap
             </Button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Kalan İzin', value: '14 Gün', sub: 'Yıllık izin hakkı', icon: CalendarDays, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Bu Ay Mesai', value: '12 Saat', sub: 'Onay bekleyen: 2 saat', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Son Maaş', value: '₺32.450', sub: 'Ödeme tarihi: 15.01.2025', icon: Wallet, color: 'text-green-500', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="glass-card p-6 rounded-2xl border border-border/50 bg-background/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & Shift */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions Grid */}
          <div>
            <h3 className="text-lg font-semibold mb-4 px-2">Hızlı İşlemler</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {[
                 { label: 'İzin İste', icon: CalendarDays, color: 'bg-purple-100 text-purple-600', href: '/izin-talep' },
                 { label: 'Mesai Ekle', icon: Clock, color: 'bg-orange-100 text-orange-600', href: '/mesai-ekle' },
                 { label: 'Bordro Görüntüle', icon: Wallet, color: 'bg-green-100 text-green-600', href: '/bordro' },
                 { label: 'Profil Düzenle', icon: Users, color: 'bg-blue-100 text-blue-600', href: '/profil' },
               ].map((action, i) => (
                 <Link href={action.href} key={i} className="group">
                   <div className="glass-card p-6 rounded-2xl border border-border/50 hover:border-primary/50 bg-background/60 hover:bg-background transition-all text-center flex flex-col items-center gap-4 h-full cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1">
                     <div className={`w-14 h-14 rounded-full flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                       <action.icon className="w-6 h-6" />
                     </div>
                     <span className="font-medium text-sm">{action.label}</span>
                   </div>
                 </Link>
               ))}
            </div>
          </div>

          {/* Upcoming Shifts Timeline */}
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Vardiya Programım</span>
                <Button variant="ghost" size="sm" className="text-primary">Tümünü Gör</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {[
                  { day: 'Bugün', date: '30 Oca', time: '09:00 - 18:00', type: 'Normal Mesai', status: 'active' },
                  { day: 'Yarın', date: '31 Oca', time: '09:00 - 18:00', type: 'Normal Mesai', status: 'upcoming' },
                  { day: 'Cuma', date: '01 Şub', time: '09:00 - 18:00', type: 'Normal Mesai', status: 'upcoming' },
                ].map((shift, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                       {shift.status === 'active' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-900">{shift.day} <span className="text-slate-400 font-normal text-sm">({shift.date})</span></div>
                        <div className="flex items-center gap-2">
                            <time className="font-mono text-xs font-medium text-slate-500">{shift.time}</time>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-slate-400 hover:text-emerald-600"
                                onClick={() => {
                                    const now = new Date();
                                    const url = createGoogleCalendarUrl({
                                        title: `Vardiya: ${shift.type}`,
                                        description: "Puantaj Pro Vardiyası",
                                        startDate: now,
                                        endDate: new Date(now.getTime() + 9 * 60 * 60 * 1000),
                                        location: 'Ofis'
                                    });
                                    window.open(url, '_blank');
                                }}
                            >
                                <CalendarDays className="w-3 h-3" />
                            </Button>
                        </div>
                      </div>
                      <div className="text-slate-500 text-sm">{shift.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Notifications & Support */}
        <div className="space-y-8">
           <Card className="glass-card border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
             <CardHeader>
               <CardTitle className="text-lg">Bildirimler</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                {[
                  { title: 'İzin Talebiniz Onaylandı', desc: 'Yıllık izin talebiniz yönetici tarafından onaylandı.', time: '2 saat önce', icon: CheckCircle2, color: 'text-green-500' },
                  { title: 'Yeni Vardiya Programı', desc: 'Şubat ayı vardiya listesi yayınlandı.', time: '1 gün önce', icon: CalendarDays, color: 'text-blue-500' },
                  { title: 'Maaş Bordrosu', desc: 'Ocak 2025 maaş bordronuz görüntülenebilir.', time: '2 gün önce', icon: Wallet, color: 'text-purple-500' },
                ].map((notif, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-xl bg-white/50 hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-border/50">
                    <div className={`mt-1 ${notif.color}`}>
                      <notif.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">{notif.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{notif.desc}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-2">{notif.time}</p>
                    </div>
                  </div>
                ))}
             </CardContent>
           </Card>

           <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-8 -mr-8" />
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Yardım mı lazım?
                </h3>
                <p className="text-pink-100 text-sm mb-4">
                  İnsan kaynakları departmanına direkt mesaj gönderin veya sıkça sorulan soruları inceleyin.
                </p>
                <Button size="sm" variant="secondary" className="w-full text-pink-600 hover:text-pink-700 font-semibold">
                  Destek Talebi Oluştur
                </Button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}
