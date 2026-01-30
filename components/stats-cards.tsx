export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div><p className="text-gray-500 dark:text-gray-400 text-sm">Toplam Personel</p><p className="text-3xl font-bold mt-2">47</p><p className="text-green-500 text-sm mt-1">+3 bu ay</p></div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><span className="text-blue-600 dark:text-blue-300 text-2xl">👥</span></div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div><p className="text-gray-500 dark:text-gray-400 text-sm">Devam Oranı</p><p className="text-3xl font-bold mt-2">94.2%</p><p className="text-green-500 text-sm mt-1">+2.1% artış</p></div>
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><span className="text-green-600 dark:text-green-300 text-2xl">📈</span></div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div><p className="text-gray-500 dark:text-gray-400 text-sm">Aylık Gelir</p><p className="text-3xl font-bold mt-2">₺125,430</p><p className="text-green-500 text-sm mt-1">+8.5% artış</p></div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full"><span className="text-purple-600 dark:text-purple-300 text-2xl">💰</span></div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div><p className="text-gray-500 dark:text-gray-400 text-sm">Hedef Tamamlanma</p><p className="text-3xl font-bold mt-2">78%</p><p className="text-yellow-500 text-sm mt-1">%12 kaldı</p></div>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full"><span className="text-yellow-600 dark:text-yellow-300 text-2xl">🎯</span></div>
        </div>
      </div>
    </div>
  )
}
