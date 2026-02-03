"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart, PieChart, Pie, Cell, Area, AreaChart, Legend } from "recharts";

const data = [];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-xl shadow-xl">
        <p className="font-semibold mb-1 text-foreground">{label}</p>
        <p className="text-primary font-bold">
          {typeof payload[0].value === 'number' 
            ? `₺${payload[0].value.toLocaleString()}` 
            : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const CustomTooltipSimple = ({ active, payload, label, unit = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-md border border-border/50 p-3 rounded-xl shadow-xl">
        <p className="font-semibold mb-1 text-foreground">{label}</p>
        <p className="text-primary font-bold">
          {payload[0].value} {unit}
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data }: { data?: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        Veri bulunamadı
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
          <filter id="glow" height="300%" width="300%" x="-100%" y="-100%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          dy={10}
          tick={{ fill: '#6b7280' }}
        />
        <YAxis 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `₺${value}`} 
          dx={-10}
          tick={{ fill: '#6b7280' }}
        />
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }} 
        />
        <Area 
          type="monotone" 
          dataKey="total" 
          stroke="#8b5cf6" 
          strokeWidth={4}
          fillOpacity={1} 
          fill="url(#colorTotal)" 
          filter="url(#glow)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function WorkHoursChart({ data }: { data?: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        Veri bulunamadı
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1}/>
            <stop offset="100%" stopColor="#0284c7" stopOpacity={1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          dx={-10}
        />
        <Tooltip 
          content={<CustomTooltipSimple unit="Saat" />}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
        />
        <Bar 
          dataKey="hours" 
          fill="url(#colorHours)" 
          radius={[8, 8, 0, 0]} 
          maxBarSize={50} 
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

const COLORS = ['#8b5cf6', '#0ea5e9', '#f59e0b', '#10b981'];

export function DepartmentChart({ data }: { data?: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        Veri bulunamadı
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={110}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip 
           contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            color: '#1f2937'
          }}
          itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
