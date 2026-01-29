import StatsCards from '@/components/stats-cards'
import RevenueChart from '@/components/revenue-chart'
import EmployeeChart from '@/components/employee-chart'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          İş Takip Panosu
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personel, puantaj ve finans takibi
        </p>
      </div>
      
      {/* Stats Cards */}
      <StatsCards />
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart />
        <EmployeeChart />
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          Son İşlemler
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 text-gray-700 dark:text-gray-300">Personel</th>
                <th className="text-left py-3 text-gray-700 dark:text-gray-300">Tarih</th>
                <th className="text-left py-3 text-gray-700 dark:text-gray-300">İşlem</th>
                <th className="text-left py-3 text-gray-700 dark:text-gray-300">Durum</th>
                <th className="text-left py-3 text-gray-700 dark:text-gray-300">Süre</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 text-gray-800 dark:text-gray-200">Ahmet Yılmaz</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">29.01.2024</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">Mesai Girişi</td>
                <td className="py-3">
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-sm">
                    Tamamlandı
                  </span>
                </td>
                <td className="py-3 text-gray-600 dark:text-gray-400">8 saat</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 text-gray-800 dark:text-gray-200">Ayşe Demir</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">29.01.2024</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">İzin Talebi</td>
                <td className="py-3">
                  <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-sm">
                    Beklemede
                  </span>
                </td>
                <td className="py-3 text-gray-600 dark:text-gray-400">-</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 text-gray-800 dark:text-gray-200">Mehmet Kaya</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">28.01.2024</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">Fazla Mesai</td>
                <td className="py-3">
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-sm">
                    Onaylandı
                  </span>
                </td>
                <td className="py-3 text-gray-600 dark:text-gray-400">2 saat</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-800 dark:text-gray-200">Zeynep Türk</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">27.01.2024</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">Hastalık İzni</td>
                <td className="py-3">
                  <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-sm">
                    Reddedildi
                  </span>
                </td>
                <td className="py-3 text-gray-600 dark:text-gray-400">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
