import RevenueChart from './components/RevenueChart';
import WorkHoursChart from './components/WorkHoursChart';

export default function Home() {
  return (
    <div className="space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Toplam Personel</h3>
          <p className="text-3xl font-bold mt-2">47</p>
          <p className="text-green-500 text-sm">+3 bu ay</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Devam Oranı</h3>
          <p className="text-3xl font-bold mt-2">94.2%</p>
          <p className="text-green-500 text-sm">+2.1% artış</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Aylık Gelir</h3>
          <p className="text-3xl font-bold mt-2">₺125,430</p>
          <p className="text-green-500 text-sm">+8.5% artış</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Hedef Tamamlanma</h3>
          <p className="text-3xl font-bold mt-2">78%</p>
          <p className="text-yellow-500 text-sm">%12 kaldı</p>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Gelir Dağılımı</h3>
          <RevenueChart />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Çalışma Saatleri</h3>
          <WorkHoursChart />
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Son İşlemler</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-gray-600">Personel</th>
                <th className="text-left py-3 text-gray-600">Tarih</th>
                <th className="text-left py-3 text-gray-600">İşlem</th>
                <th className="text-left py-3 text-gray-600">Durum</th>
                <th className="text-left py-3 text-gray-600">Süre</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">Ahmet Yılmaz</td>
                <td className="py-3 text-gray-600">29.01.2024</td>
                <td className="py-3 text-gray-600">Mesai Girişi</td>
                <td className="py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Tamamlandı</span></td>
                <td className="py-3 text-gray-600">8 saat</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Ayşe Demir</td>
                <td className="py-3 text-gray-600">29.01.2024</td>
                <td className="py-3 text-gray-600">İzin Talebi</td>
                <td className="py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Beklemede</span></td>
                <td className="py-3 text-gray-600">-</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Mehmet Kaya</td>
                <td className="py-3 text-gray-600">28.01.2024</td>
                <td className="py-3 text-gray-600">Fazla Mesai</td>
                <td className="py-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Onaylandı</span></td>
                <td className="py-3 text-gray-600">2 saat</td>
              </tr>
              <tr>
                <td className="py-3">Zeynep Türk</td>
                <td className="py-3 text-gray-600">27.01.2024</td>
                <td className="py-3 text-gray-600">Hastalık İzni</td>
                <td className="py-3"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Reddedildi</span></td>
                <td className="py-3 text-gray-600">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
