import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const employeeData = [
  { name: 'Ahmet Y.', saat: 186 },
  { name: 'Ayşe D.', saat: 178 },
  { name: 'Mehmet K.', saat: 192 },
  { name: 'Zeynep T.', saat: 165 },
  { name: 'Can B.', saat: 180 },
];

export default function WorkHoursChart() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <BarChart
        width={800}
        height={400}
        data={employeeData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} saat`, 'Çalışma Süresi']} />
        <Legend />
        <Bar dataKey="saat" fill="#10b981" name="Çalışma Saatleri" />
      </BarChart>
    </div>
  );
}
