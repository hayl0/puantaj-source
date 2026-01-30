"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
const data = [{ personel: 'Ahmet Y.', mesai: 42 }, { personel: 'Ayşe D.', mesai: 38 }, { personel: 'Mehmet K.', mesai: 45 }, { personel: 'Zeynep T.', mesai: 40 }, { personel: 'Can B.', mesai: 36 }]
export default function EmployeeChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Personel Mesai Saatleri</h3>
      <div style={{ width: '100%', height: '320px' }}>
        <BarChart width={800} height={320} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="personel" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} saat`, 'Mesai']} />
          <Bar dataKey="mesai" fill="#10b981" />
        </BarChart>
      </div>
    </div>
  )
}
