export default function GelirGiderPage() {
  const transactions = [
    { id: 1, type: 'Gelir', description: 'Proje Tamamlandı', amount: '₺25,000', date: '15 Oca 2024', category: 'Proje' },
    { id: 2, type: 'Gider', description: 'Maaş Ödemeleri', amount: '₺18,500', date: '14 Oca 2024', category: 'Personel' },
    { id: 3, type: 'Gelir', description: 'Danışmanlık', amount: '₺8,000', date: '13 Oca 2024', category: 'Hizmet' },
    { id: 4, type: 'Gider', description: 'Ofis Kirası', amount: '₺5,000', date: '12 Oca 2024', category: 'Kira' },
    { id: 5, type: 'Gelir', description: 'Yazılım Lisans', amount: '₺12,000', date: '11 Oca 2024', category: 'Lisans' },
  ]

  const summary = {
    totalIncome: '₺245,800',
    totalExpense: '₺84,200',
    netProfit: '₺161,600',
    incomeChange: '+15%',
    expenseChange: '+8%'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">💰 Gelir-Gider Takibi</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            💰 Gelir Ekle
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            💸 Gider Ekle
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
            📊 Rapor Al
          </button>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Toplam Gelir</p>
              <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">{summary.totalIncome}</p>
              <p className="text-sm mt-1 text-green-500">{summary.incomeChange} geçen aya göre</p>
            </div>
            <div className="text-3xl p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              📈
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Toplam Gider</p>
              <p className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">{summary.totalExpense}</p>
              <p className="text-sm mt-1 text-red-500">{summary.expenseChange} geçen aya göre</p>
            </div>
            <div className="text-3xl p-3 rounded-full bg-red-100 dark:bg-red-900/30">
              📉
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Net Kar</p>
              <p className="text-3xl font-bold mt-2">{summary.netProfit}</p>
              <p className="text-sm mt-1 text-green-500">+23% kar marjı</p>
            </div>
            <div className="text-3xl p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              💰
            </div>
          </div>
        </div>
      </div>

      {/* İşlem Tablosu */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-lg font-semibold mb-4">📋 Son İşlemler</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="py-3 text-left">ID</th>
                <th className="py-3 text-left">Tür</th>
                <th className="py-3 text-left">Açıklama</th>
                <th className="py-3 text-left">Kategori</th>
                <th className="py-3 text-left">Tutar</th>
                <th className="py-3 text-left">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => (
                <tr key={trx.id} className="border-b dark:border-gray-700">
                  <td className="py-3">#{trx.id}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      trx.type === 'Gelir' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {trx.type}
                    </span>
                  </td>
                  <td className="py-3 font-medium">{trx.description}</td>
                  <td className="py-3">{trx.category}</td>
                  <td className={`py-3 font-bold ${
                    trx.type === 'Gelir' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trx.amount}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{trx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kategori Dağılımı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">📊 Gelir Kategorileri</h3>
          <div className="space-y-4">
            {[
              { category: 'Projeler', amount: '₺120,000', percentage: '49%', color: 'bg-blue-500' },
              { category: 'Danışmanlık', amount: '₺65,000', percentage: '26%', color: 'bg-green-500' },
              { category: 'Lisanslar', amount: '₺45,000', percentage: '18%', color: 'bg-yellow-500' },
              { category: 'Diğer', amount: '₺15,800', percentage: '7%', color: 'bg-purple-500' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span>{item.category}</span>
                  <span>{item.amount}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full">
                  <div 
                    className={`h-3 rounded-full ${item.color}`}
                    style={{ width: item.percentage }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">{item.percentage}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">📊 Gider Kategorileri</h3>
          <div className="space-y-4">
            {[
              { category: 'Personel', amount: '₺48,000', percentage: '57%', color: 'bg-red-500' },
              { category: 'Kira', amount: '₺15,000', percentage: '18%', color: 'bg-orange-500' },
              { category: 'Yazılım', amount: '₺12,000', percentage: '14%', color: 'bg-pink-500' },
              { category: 'Diğer', amount: '₺9,200', percentage: '11%', color: 'bg-gray-500' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span>{item.category}</span>
                  <span>{item.amount}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full">
                  <div 
                    className={`h-3 rounded-full ${item.color}`}
                    style={{ width: item.percentage }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">{item.percentage}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
