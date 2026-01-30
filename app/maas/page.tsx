import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, CreditCard, Download, Calendar, CheckCircle } from 'lucide-react';

export default function MaasPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Maaş Yönetimi</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Ocak 2024 • Toplam ₺125,430 maaş ödemesi
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          <CreditCard className="w-4 h-4" />
          Toplu Ödeme Yap
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ocak 2024 Maaş Özeti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Toplam Maaş</span>
                <span className="font-bold text-green-600 dark:text-green-400">₺125,430</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ortalama Maaş</span>
                <span className="font-bold">₺14,850</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ödenen</span>
                <span className="font-bold text-green-600 dark:text-green-400">47/47</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start gap-2">
                <DollarSign className="w-4 h-4" />
                Maaş Bordrosu Oluştur
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Download className="w-4 h-4" />
                Bordro İndir
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Calendar className="w-4 h-4" />
                Ödeme Takvimi
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Son Ödemeler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya'].map((name, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="dark:text-white">{name}</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">₺{25_000 - i * 5000}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
