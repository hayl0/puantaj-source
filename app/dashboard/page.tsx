import DashboardStats from '@/components/premium/DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Users, Download, Calendar, Clock } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Hoş geldiniz! Sistem performansınız ve özet bilgileriniz aşağıdadır.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Bugün: {new Date().toLocaleDateString('tr-TR')}
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Download className="w-4 h-4" />
            Hızlı Rapor
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Canlı Performans Takibi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Canlı grafikler yakında eklenecek</p>
                <p className="text-sm text-gray-400 mt-2">Recharts entegrasyonu aktifleştiriliyor</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Takım Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { department: 'Yazılım', count: 12, progress: 85, color: 'bg-blue-500' },
                { department: 'İnsan Kaynakları', count: 8, progress: 72, color: 'bg-green-500' },
                { department: 'Muhasebe', count: 6, progress: 90, color: 'bg-purple-500' },
                { department: 'Satış', count: 10, progress: 65, color: 'bg-orange-500' },
              ].map((dept) => (
                <div key={dept.department} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium dark:text-white">{dept.department}</span>
                    <span className="text-gray-500 dark:text-gray-400">{dept.count} kişi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${dept.color} transition-all duration-500`}
                        style={{ width: `${dept.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-10 text-right">{dept.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Son Aktivite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: 'Ahmet Yılmaz', action: 'Puantaj girişi yaptı', time: '10 dakika önce' },
                { user: 'Ayşe Demir', action: 'İzin talebi gönderdi', time: '25 dakika önce' },
                { user: 'Mehmet Kaya', action: 'Mesai kaydı ekledi', time: '1 saat önce' },
                { user: 'Fatma Şahin', action: 'Rapor oluşturdu', time: '2 saat önce' },
              ].map((activity) => (
                <div key={activity.user} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium dark:text-white">{activity.user}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-20 flex flex-col gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Users className="w-6 h-6" />
                <span className="text-sm">Personel Ekle</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Puantaj Gir</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Download className="w-6 h-6" />
                <span className="text-sm">Rapor Al</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <Clock className="w-6 h-6" />
                <span className="text-sm">Mesai Kaydı</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
