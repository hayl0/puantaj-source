"use client"
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react'

const salaryData = [
  { id: 1, personel: 'Ahmet Yılmaz', maas: 25000, prim: 5000, kesinti: 1500, net: 28500, durum: 'Ödendi' },
  { id: 2, personel: 'Ayşe Demir', maas: 22000, prim: 3000, kesinti: 1200, net: 23800, durum: 'Ödendi' },
  { id: 3, personel: 'Mehmet Kaya', maas: 28000, prim: 7000, kesinti: 2000, net: 33000, durum: 'Bekliyor' },
  { id: 4, personel: 'Zeynep Türk', maas: 23000, prim: 4000, kesinti: 1300, net: 25700, durum: 'Ödendi' },
]

export default function MaasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Maaş Yönetimi
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personel maaşları, primler ve bordro işlemleri
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Toplam Ödeme</p>
              <p className="text-2xl font-bold dark:text-white">₺287,400</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Ortalama Maaş</p>
              <p className="text-2xl font-bold dark:text-white">₺24,500</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-red-500 mr-4" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Toplam Kesinti</p>
              <p className="text-2xl font-bold dark:text-white">₺18,750</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500 mr-4" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Personel Sayısı</p>
              <p className="text-2xl font-bold dark:text-white">47</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white">Ocak Ayı Bordrosu</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Bordro Oluştur
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">Personel</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">Maaş</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">Prim</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">Kesinti</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">Net Ödeme</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">Durum</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {salaryData.map((salary) => (
                <tr key={salary.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="p-4 dark:text-white">{salary.personel}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">₺{salary.maas.toLocaleString()}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">₺{salary.prim.toLocaleString()}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">₺{salary.kesinti.toLocaleString()}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">₺{salary.net.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      salary.durum === 'Ödendi' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {salary.durum}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                      Düzenle
                    </button>
                    <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                      Öde
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
