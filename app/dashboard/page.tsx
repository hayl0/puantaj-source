import { TrendingUp, Users, Clock, DollarSign, Activity, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    { title: 'Toplam Personel', value: '48', change: '+12%', icon: <Users className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    { title: 'Aktif Çalışan', value: '42', change: '+8%', icon: <Activity className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
    { title: 'Puantaj Oranı', value: '94%', change: '+3%', icon: <Clock className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
    { title: 'Aylık Gelir', value: '₺245.8K', change: '+15%', icon: <DollarSign className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Hoş Geldiniz, Halil Bey 👋</h1>
          <p className="text-gray-400">Bugün {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Takvim
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:opacity-90 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change} geçen aya göre
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <div className="text-white">{stat.icon}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                  style={{ width: `${parseInt(stat.change) + 80}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Haftalık Çalışma Saatleri</h3>
            <span className="text-sm text-gray-400">Son 7 gün</span>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {[65, 80, 75, 90, 85, 95, 70].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-400 mt-2">Pzt.{index+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Son Aktiviteler</h3>
          <div className="space-y-4">
            {[
              { user: 'Ahmet Yılmaz', action: 'Puantaj girişi yaptı', time: '08:30', color: 'bg-blue-500' },
              { user: 'Ayşe Kaya', action: 'İzin başvurusu gönderdi', time: '09:15', color: 'bg-green-500' },
              { user: 'Mehmet Demir', action: 'Mesai kaydı oluşturdu', time: '10:45', color: 'bg-purple-500' },
              { user: 'Fatma Şahin', action: 'Rapor oluşturdu', time: '11:30', color: 'bg-yellow-500' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-800/50 rounded-lg">
                <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center mr-3`}>
                  <span className="text-white text-xs">{activity.user.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.user} <span className="text-gray-400">{activity.action}</span></p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">Hızlı İşlemler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all group">
            <div className="text-2xl mb-2">👤</div>
            <p className="text-white text-sm">Personel Ekle</p>
            <p className="text-xs text-gray-400 group-hover:text-gray-300">Yeni çalışan</p>
          </button>
          <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all group">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-white text-sm">Ödeme Yap</p>
            <p className="text-xs text-gray-400 group-hover:text-gray-300">Maaş ödemesi</p>
          </button>
          <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all group">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-white text-sm">Rapor Al</p>
            <p className="text-xs text-gray-400 group-hover:text-gray-300">Aylık analiz</p>
          </button>
          <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all group">
            <div className="text-2xl mb-2">⚙️</div>
            <p className="text-white text-sm">Ayarlar</p>
            <p className="text-xs text-gray-400 group-hover:text-gray-300">Sistem ayarları</p>
          </button>
        </div>
      </div>
    </div>
  )
}
