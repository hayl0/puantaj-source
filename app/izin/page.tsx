"use client"
import { Calendar, UserCheck, UserX, Clock } from 'lucide-react'
import { useState } from 'react'

const leaveRequests = [
  { id: 1, personel: 'Ahmet Yılmaz', tip: 'Yıllık İzin', baslangic: '01.02.2024', bitis: '07.02.2024', gun: '5', durum: 'Onaylandı' },
  { id: 2, personel: 'Ayşe Demir', tip: 'Hastalık', baslangic: '29.01.2024', bitis: '31.01.2024', gun: '3', durum: 'Beklemede' },
  { id: 3, personel: 'Mehmet Kaya', tip: 'Ücretsiz İzin', baslangic: '15.02.2024', bitis: '16.02.2024', gun: '2', durum: 'Reddedildi' },
  { id: 4, personel: 'Zeynep Türk', tip: 'Doğum İzni', baslangic: '01.03.2024', bitis: '01.06.2024', gun: '65', durum: 'Onaylandı' },
]

export default function IzinPage() {
  const [requests, setRequests] = useState(leaveRequests)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          İzin Yönetimi
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          İzin talepleri ve onay süreçleri
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Toplam İzin</p>
              <p className="text-2xl font-bold dark:text-white">75 gün</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Onaylanan</p>
              <p className="text-2xl font-bold dark:text-white">42</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-4" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Bekleyen</p>
              <p className="text-2xl font-bold dark:text-white">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-red-500 mr-4" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Reddedilen</p>
              <p className="text-2xl font-bold dark:text-white">5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white">İzin Talepleri</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Yeni İzin Talebi
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">Personel</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">İzin Tipi</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">Başlangıç</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">Bitiş</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">Gün</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">Durum</th>
                <th className="text-left p-4 text-gray-700 dark:text-gray-300">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="p-4 dark:text-white">{request.personel}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{request.tip}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{request.baslangic}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{request.bitis}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{request.gun} gün</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      request.durum === 'Onaylandı' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      request.durum === 'Beklemede' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {request.durum}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                      Onayla
                    </button>
                    <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                      Reddet
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
