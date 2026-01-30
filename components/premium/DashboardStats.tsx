import { Users, TrendingUp, DollarSign, Target, Clock, Calendar } from 'lucide-react';

export default function DashboardStats() {
  const stats = [
    { 
      title: 'Aktif Personel', 
      value: '47', 
      change: '+3 bu ay', 
      icon: Users,
      color: 'bg-blue-500',
      trend: 'up'
    },
    { 
      title: 'Devam Oranı', 
      value: '94.2%', 
      change: '+2.1%', 
      icon: TrendingUp,
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      title: 'Aylık Gelir', 
      value: '₺125,430', 
      change: '+8.5%', 
      icon: DollarSign,
      color: 'bg-purple-500',
      trend: 'up'
    },
    { 
      title: 'Hedef Tamamlama', 
      value: '78%', 
      change: '+12%', 
      icon: Target,
      color: 'bg-orange-500',
      trend: 'up'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">geçen aya göre</span>
              </div>
            </div>
            <div className={`${stat.color} p-3 rounded-xl`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
