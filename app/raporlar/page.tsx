import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart, PieChart, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function RaporlarPage() {
  const reports = [
    { id: 1, title: 'Aylık Personel Performansı', type: 'pdf', size: '2.4 MB', date: '01 Şub 2024', downloads: 42 },
    { id: 2, title: 'Finansal Durum Raporu', type: 'excel', size: '3.1 MB', date: '31 Oca 2024', downloads: 38 },
    { id: 3, title: 'Puantaj Analiz Raporu', type: 'pdf', size: '1.8 MB', date: '30 Oca 2024', downloads: 51 },
    { id: 4, title: 'Vergi ve SGK Özeti', type: 'pdf', size: '4.2 MB', date: '29 Oca 2024', downloads: 29 },
    { id: 5, title: 'Yıllık Performans Karşılaştırması', type: 'excel', size: '5.6 MB', date: '28 Oca 2024', downloads: 23 },
    { id: 6, title: 'Departman Bazlı Analiz', type: 'pdf', size: '2.9 MB', date: '27 Oca 2024', downloads: 31 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Raporlar ve Analizler</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Toplam 24 rapor • Son 30 günde 214 indirme
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Download className="w-4 h-4" />
          Tüm Raporları İndir
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Toplam Rapor</p>
                <p className="text-3xl font-bold mt-2">24</p>
                <p className="text-blue-200 text-sm mt-1">aktif</p>
              </div>
              <FileText className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Aylık İndirme</p>
                <p className="text-3xl font-bold mt-2">214</p>
                <p className="text-green-200 text-sm mt-1">+18% geçen aya göre</p>
              </div>
              <Download className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Ortalama Boyut</p>
                <p className="text-3xl font-bold mt-2">3.2MB</p>
                <p className="text-purple-200 text-sm mt-1">PDF/Excel</p>
              </div>
              <BarChart className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">En Popüler</p>
                <p className="text-3xl font-bold mt-2">Puantaj Analiz</p>
                <p className="text-orange-200 text-sm mt-1">51 indirme</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rapor Arşivi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      report.type === 'pdf' 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{report.title}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{report.date}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{report.size}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{report.downloads} indirme</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    İndir
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hızlı Rapor Oluştur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full h-20 flex flex-col gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Users className="w-6 h-6" />
                <span>Personel Raporu</span>
              </Button>
              <Button className="w-full h-20 flex flex-col gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <DollarSign className="w-6 h-6" />
                <span>Finans Raporu</span>
              </Button>
              <Button className="w-full h-20 flex flex-col gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Calendar className="w-6 h-6" />
                <span>Puantaj Raporu</span>
              </Button>
              <Button className="w-full h-20 flex flex-col gap-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <PieChart className="w-6 h-6" />
                <span>Analiz Raporu</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rapor İstatistikleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">%94</div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">PDF Formatında</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">3.2s</div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Ort. Oluşturma Süresi</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">18</div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Otomatik Rapor</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">98%</div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Memnuniyet Oranı</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
