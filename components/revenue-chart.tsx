"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
const data = [{ ay: 'Oca', gelir: 42000 }, { ay: 'Şub', gelir: 52000 }, { ay: 'Mar', gelir: 61000 }, { ay: 'Nis', gelir: 78000 }, { ay: 'May', gelir: 89000 }, { ay: 'Haz', gelir: 125430 }]
export default function RevenueChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Aylık Gelir Trendi</h3>
      <div style={{ width: '100%', height: '320px' }}>
        <LineChart width={800} height={320} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ay" />
          <YAxis />
          <Tooltip formatter={(value) => [`₺${value}`, 'Gelir']} />
          <Line type="monotone" dataKey="gelir" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </div>
    </div>
  )
}
