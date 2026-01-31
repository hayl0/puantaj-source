
import { Users, TrendingUp, Wallet, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function DashboardStats() {
  const [data, setData] = useState({
    totalEmployees: 0,
    attendanceRate: 0,
    totalMonthlyCost: 0,
    pendingLeaves: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const jsonData = await res.json();
          setData(jsonData);
        }
      } catch (error) {
        console.error('Stats fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { 
      title: 'Aktif Personel', 
      value: data.totalEmployees.toString(), 
      change: 'Toplam', 
      icon: Users,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-500/30',
      bg: 'bg-blue-500/10',
      trend: 'neutral'
    },
    { 
      title: 'Devam Oranı', 
      value: `%${data.attendanceRate}`, 
      change: 'Bugün', 
      icon: TrendingUp,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      shadow: 'shadow-green-500/30',
      bg: 'bg-green-500/10',
      trend: 'neutral'
    },
    { 
      title: 'Aylık Maliyet', 
      value: `₺${data.totalMonthlyCost.toLocaleString('tr-TR')}`, 
      change: 'Tahmini Maaş', 
      icon: Wallet,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      shadow: 'shadow-purple-500/30',
      bg: 'bg-purple-500/10',
      trend: 'neutral'
    },
    { 
      title: 'Bekleyen İzinler', 
      value: data.pendingLeaves.toString(), 
      change: 'Onay Bekliyor', 
      icon: Clock,
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      shadow: 'shadow-orange-500/30',
      bg: 'bg-orange-500/10',
      trend: 'neutral'
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat) => (
        <motion.div 
          key={stat.title} 
          variants={item}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-2xl p-6 border border-white/10 bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all group"
        >
          {/* Background decorative blob */}
          <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:opacity-100 transition-opacity blur-2xl`} />
          
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold tracking-tight text-foreground mb-2">{stat.value}</h3>
              
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${stat.bg} text-foreground/80`}>
                  {stat.change}
                </span>
              </div>
            </div>
            
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadow}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
