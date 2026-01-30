import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

export default function IzinPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">İzin Yönetimi</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Onaylanan İzinler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">18</div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Bu ay</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Bekleyen İzinler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">5</div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Onay bekliyor</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Toplam İzin Günü
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">142</div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Yıllık kullanılan</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>İzin Talepleri</CardTitle>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Yeni İzin Talebi
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">İzin talepleri listesi burada görüntülenecek</p>
        </CardContent>
      </Card>
    </div>
  );
}
