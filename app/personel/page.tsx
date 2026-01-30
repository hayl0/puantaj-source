import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Download, Mail, Phone, Building } from 'lucide-react';

const employees = [
  { id: 1, name: 'Ahmet Yılmaz', department: 'Yazılım', position: 'Senior Dev', salary: '₺25,000', joinDate: '2022-03-15', status: 'active' },
  { id: 2, name: 'Ayşe Demir', department: 'İnsan Kaynakları', position: 'Uzman', salary: '₺18,500', joinDate: '2021-08-22', status: 'active' },
  { id: 3, name: 'Mehmet Kaya', department: 'Muhasebe', position: 'Müdür', salary: '₺22,000', joinDate: '2020-11-30', status: 'active' },
  { id: 4, name: 'Fatma Şahin', department: 'Satış', position: 'Temsilci', salary: '₺15,000', joinDate: '2023-01-10', status: 'probation' },
  { id: 5, name: 'Can Yıldız', department: 'Yazılım', position: 'Junior Dev', salary: '₺14,000', joinDate: '2023-06-05', status: 'active' },
  { id: 6, name: 'Zeynep Arslan', department: 'Pazarlama', position: 'Uzman', salary: '₺17,000', joinDate: '2022-09-18', status: 'active' },
];

export default function PersonelPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personel Yönetimi</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Toplam 47 personel • 6 aktif departman
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4" />
          Yeni Personel Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Personel Listesi</CardTitle>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Personel ara..." className="pl-10 w-full md:w-64" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-800">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Personel</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Departman</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Pozisyon</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Maaş</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Durum</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium dark:text-white">{emp.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {emp.id.toString().padStart(3, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="dark:text-white">{emp.department}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 dark:text-white">{emp.position}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-green-600 dark:text-green-400">{emp.salary}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          emp.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {emp.status === 'active' ? 'Aktif' : 'Deneme Süresi'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Detay</Button>
                          <Button size="sm">Düzenle</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Departman Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Yazılım', count: 12, color: 'bg-blue-500' },
                { name: 'İnsan Kaynakları', count: 8, color: 'bg-green-500' },
                { name: 'Muhasebe', count: 6, color: 'bg-purple-500' },
                { name: 'Satış', count: 10, color: 'bg-orange-500' },
                { name: 'Pazarlama', count: 7, color: 'bg-pink-500' },
                { name: 'Yönetim', count: 4, color: 'bg-indigo-500' },
              ].map((dept) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${dept.color} rounded-full`} />
                    <span className="dark:text-white">{dept.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium dark:text-white">{dept.count}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">kişi</span>
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
