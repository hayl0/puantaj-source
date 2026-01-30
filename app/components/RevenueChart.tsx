import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Oca', gelir: 125430 },
  { name: 'Şub', gelir: 115200 },
  { name: 'Mar', gelir: 138900 },
  { name: 'Nis', gelir: 142300 },
  { name: 'May', gelir: 148500 },
  { name: 'Haz', gelir: 152000 },
];

export default function RevenueChart() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <BarChart
        width={800}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`₺${Number(value).toLocaleString()}`, 'Gelir']} />
        <Legend />
        <Bar dataKey="gelir" fill="#4f46e5" name="Aylık Gelir (₺)" />
      </BarChart>
    </div>
  );
}
