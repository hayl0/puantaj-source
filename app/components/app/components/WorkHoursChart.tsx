import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const employeeData = [
  { name: 'Ahmet Y.', saat: 186 },
  { name: 'Ayşe D.', saat: 178 },
  { name: 'Mehmet K.', saat: 192 },
  { name: 'Zeynep T.', saat: 165 },
  { name: 'Can B.', saat: 180 },
];

export default function WorkHoursChart() {
  return (
    <div className="w-full h-[400px] min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={employeeData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Çalışma Saati', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => [`${value} saat`, 'Çalışma Süresi']} />
          <Legend />
          <Bar dataKey="saat" fill="#10b981" name="Çalışma Saatleri" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
