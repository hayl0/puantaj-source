export default function PersonelPage() {
  const employees = [
    { id: 1, name: 'Ahmet Yılmaz', department: 'Yazılım', status: 'Aktif', attendance: '95%' },
    { id: 2, name: 'Ayşe Kaya', department: 'İnsan Kaynakları', status: 'Aktif', attendance: '98%' },
    { id: 3, name: 'Mehmet Demir', department: 'Finans', status: 'İzinli', attendance: '88%' },
    { id: 4, name: 'Fatma Şahin', department: 'Pazarlama', status: 'Aktif', attendance: '92%' },
    { id: 5, name: 'Can Öztürk', department: 'Yazılım', status: 'Aktif', attendance: '96%' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">👥 Personel Yönetimi</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            👤 Yeni Personel Ekle
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
            📊 İstatistikler
          </button>
        </div>
      </div>

      {/* Personel Listesi */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="py-3 text-left">ID</th>
                <th className="py-3 text-left">Ad Soyad</th>
                <th className="py-3 text-left">Departman</th>
                <th className="py-3 text-left">Durum</th>
                <th className="py-3 text-left">Katılım</th>
                <th className="py-3 text-left">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b dark:border-gray-700">
                  <td className="py-3">#{emp.id}</td>
                  <td className="py-3 font-medium">{emp.name}</td>
                  <td className="py-3">{emp.department}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      emp.status === 'Aktif' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 h-2 rounded-full mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: emp.attendance }}
                        ></div>
                      </div>
                      <span>{emp.attendance}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">✏️</button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">🗑️</button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded">👁️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">📊 Departman Dağılımı</h3>
          <div className="space-y-4">
            {[
              { department: 'Yazılım', count: 12, color: 'bg-blue-500' },
              { department: 'İnsan Kaynakları', count: 8, color: 'bg-green-500' },
              { department: 'Finans', count: 6, color: 'bg-yellow-500' },
              { department: 'Pazarlama', count: 10, color: 'bg-purple-500' },
            ].map((dept, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span>{dept.department}</span>
                  <span>{dept.count} kişi</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${dept.color}`}
                    style={{ width: `${(dept.count / 36) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">📈 Personel İstatistikleri</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">48</div>
              <div className="text-sm">Toplam Personel</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">42</div>
              <div className="text-sm">Aktif Çalışan</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">4</div>
              <div className="text-sm">İzinli</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</div>
              <div className="text-sm">Yeni İşe Alım</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
