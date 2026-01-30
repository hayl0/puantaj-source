import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function PuantajPage() {
  const attendanceData = [
    { id: 1, name: 'Ahmet Yılmaz', date: '2024-01-29', checkIn: '09:00', checkOut: '18:00', hours: 9, status: 'present' },
    { id: 2, name: 'Ayşe Demir', date: '2024-01-29', checkIn: '08:45', checkOut: '17:30', hours: 8.75, status: 'present' },
    { id: 3, name: 'Mehmet Kaya', date: '2024-01-29', checkIn: '09:15', checkOut: '18:30', hours: 9.25, status: 'present' },
    { id: 4, name: 'Fatma Şahin', date: '2024-01-29', checkIn: '10:00', checkOut: '19:00', hours: 9, status: 'late' },
    { id: 5, name: 'Can Yıldız', date: '2024-01-29', checkIn: '-', checkOut: '-', hours: 0, status: 'absent' },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'present': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'late': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'absent': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'present': return 'Tamamlandı';
      case 'late': return 'Geç Geldi';
      case 'absent': return 'Devamsız';
      default: return 'Bekliyor';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Puantaj Takibi</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            29 Ocak 2024 • 47 personelden 42'si tamamladı
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Takvim Görünümü
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <CheckCircle className="w-4 h-4" />
            Toplu Onayla
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Tamamlanan</p>
                <p className="text-3xl font-bold mt-2">42</p>
                <p className="text-blue-200 text-sm mt-1">%89.4 oran</p>
              </div>
              <CheckCircle className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Ortalama Mesai</p>
                <p className="text-3xl font-bold mt-2">8.7s</p>
                <p className="text-green-200 text-sm mt-1">günlük</p>
              </div>
              <Clock className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Geç Gelenler</p>
                <p className="text-3xl font-bold mt-2">3</p>
                <p className="text-yellow-200 text-sm mt-1">%6.4 oran</p>
              </div>
              <AlertCircle className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Devamsızlar</p>
                <p className="text-3xl font-bold mt-2">2</p>
                <p className="text-red-200 text-sm mt-1">%4.3 oran</p>
              </div>
              <XCircle className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Günlük Puantaj Kayıtları</CardTitle>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Son Güncelleme: Bugün 18:30
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Personel</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Tarih</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Giriş</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Çıkış</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Mesai</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Durum</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {record.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium dark:text-white">{record.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 dark:text-white">{record.date}</td>
                    <td className="py-3 px-4 dark:text-white">{record.checkIn}</td>
                    <td className="py-3 px-4 dark:text-white">{record.checkOut}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-blue-600 dark:text-blue-400">{record.hours} saat</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className={`font-medium ${
                          record.status === 'present' ? 'text-green-600 dark:text-green-400' :
                          record.status === 'late' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {getStatusText(record.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Düzenle</Button>
                        {record.status !== 'present' && (
                          <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                            Onayla
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
