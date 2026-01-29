import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Target, Wallet } from 'lucide-react'

export default function StatsCards() {
  const stats = [
    { title: "Toplam Personel", value: "47", change: "+3 bu ay", icon: <Users className="h-5 w-5" /> },
    { title: "Devam Oranı", value: "94.2%", change: "+2.1% artış", icon: <TrendingUp className="h-5 w-5" /> },
    { title: "Aylık Gelir", value: "₺125,430", change: "+8.5% artış", icon: <Wallet className="h-5 w-5" /> },
    { title: "Hedef Tamamlanma", value: "78%", change: "%12 kaldı", icon: <Target className="h-5 w-5" /> },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
