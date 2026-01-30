"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp } from "lucide-react";

const revenueData = [
  { name: "Ocak", total: 4500, previous: 4000 },
  { name: "Şubat", total: 5200, previous: 4200 },
  { name: "Mart", total: 4800, previous: 4500 },
  { name: "Nisan", total: 6100, previous: 4800 },
  { name: "Mayıs", total: 5500, previous: 5000 },
  { name: "Haziran", total: 6700, previous: 5200 },
  { name: "Temmuz", total: 7200, previous: 5800 },
];

const workHoursData = [
  { name: "Pzt", hours: 8.5 },
  { name: "Sal", hours: 9.2 },
  { name: "Çar", hours: 8.8 },
  { name: "Per", hours: 9.5 },
  { name: "Cum", hours: 7.5 },
  { name: "Cmt", hours: 4.0 },
  { name: "Paz", hours: 0 },
];

const departmentData = [
  { name: "Yazılım", value: 35, color: "hsl(var(--chart-1))" },
  { name: "İK", value: 15, color: "hsl(var(--chart-2))" },
  { name: "Satış", value: 25, color: "hsl(var(--chart-3))" },
  { name: "Pazarlama", value: 20, color: "hsl(var(--chart-4))" },
  { name: "Yönetim", value: 5, color: "hsl(var(--chart-5))" },
];

export function RevenueChart() {
  const { theme } = useTheme();

  return (
    <Card className="col-span-4 lg:col-span-2 glass-card border-0 shadow-2xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Aylık Gelir Analizi
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Geçen yıla göre <span className="text-green-500 font-bold">+12.5%</span> artış
          </p>
        </div>
        <div className="p-2 bg-primary/10 rounded-xl">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `₺${value}`} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.8)", 
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px", 
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" 
                }}
                labelStyle={{ color: "#666" }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="previous"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorPrevious)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function WorkHoursChart() {
  return (
    <Card className="col-span-4 lg:col-span-1 glass-card border-0 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Haftalık Mesai</CardTitle>
        <p className="text-xs text-muted-foreground">Ortalama 7.8 saat / gün</p>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workHoursData}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.8)", 
                  backdropFilter: "blur(10px)",
                  borderRadius: "8px", 
                  border: "none" 
                }}
              />
              <Bar 
                dataKey="hours" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              >
                {workHoursData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.hours > 9 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function DepartmentChart() {
  return (
    <Card className="col-span-4 lg:col-span-1 glass-card border-0 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Departman Dağılımı</CardTitle>
        <p className="text-xs text-muted-foreground">Toplam 5 Departman</p>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.8)", 
                  backdropFilter: "blur(10px)",
                  borderRadius: "8px", 
                  border: "none" 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <span className="text-2xl font-bold">100</span>
              <p className="text-xs text-muted-foreground">Personel</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {departmentData.map((entry) => (
            <Badge key={entry.name} variant="secondary" className="bg-secondary/50 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
