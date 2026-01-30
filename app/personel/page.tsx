export default function PersonelPage() {
  const employees = [
    { id: 1, name: 'Ahmet Yılmaz', department: 'Yazılım', email: 'ahmet@firma.com', status: 'Aktif', hours: 186 },
    { id: 2, name: 'Ayşe Demir', department: 'İnsan Kaynakları', email: 'ayse@firma.com', status: 'Aktif', hours: 178 },
    { id: 3, name: 'Mehmet Kaya', department: 'Satış', email: 'mehmet@firma.com', status: 'Aktif', hours: 192 },
    { id: 4, name: 'Zeynep Türk', department: 'Muhasebe', email: 'zeynep@firma.com', status: 'İzinli', hours: 165 },
    { id: 5, name: 'Can Bakan', department: 'Pazarlama', email: 'can@firma.com', status: 'Aktif', hours: 180 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Personel Yönetimi</h1>
        <p className="text-gray-600">Tüm personellerin bilgilerini görüntüleyin ve yönetin</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Personel Listesi</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Yeni Personel Ekle
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-gray-700">Personel</th>
                <th className="text-left p-4 text-gray-700">Departman</th>
                <th className="text-left p-4 text-gray-700">E-posta</th>
                <th className="text-left p-4 text-gray-700">Durum</th>
                <th className="text-left p-4 text-gray-700">Çalışma Saati</th>
                <th className="text-left p-4 text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{employee.name}</td>
                  <td className="p-4 text-gray-600">{employee.department}</td>
                  <td className="p-4 text-gray-600">{employee.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      employee.status === 'Aktif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{employee.hours} saat</td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">Düzenle</button>
                    <button className="text-red-600 hover:text-red-800">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
