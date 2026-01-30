"use client";

import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Target } from 'lucide-react';

export default function DashboardStats() {
  const stats = [
    { 
      title: 'Aktif Personel', 
      value: '47', 
      change: '+3 bu ay', 
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      trend: 'up'
    },
    { 
      title: 'Devam Oranı', 
      value: '94.2%', 
      change: '+2.1%', 
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      trend: 'up'
    },
    { 
      title: 'Aylık Gelir', 
      value: '₺125,430', 
      change: '+8.5%', 
      icon: DollarSign,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      trend: 'up'
    },
    { 
      title: 'Hedef Tamamlama', 
      value: '78%', 
      change: '+12%', 
      icon: Target,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      trend: 'up'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="glass-card p-6 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-white/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</h3>
              <div className="flex items-center mt-2 gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stat.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">geçen aya göre</span>
              </div>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-lg ring-1 ring-inset ring-black/5`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
