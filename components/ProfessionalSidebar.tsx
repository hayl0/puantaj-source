"use client"
import { 
  Home, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  HelpCircle
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Personel', href: '/personel' },
  { icon: Clock, label: 'Puantaj', href: '/puantaj' },
  { icon: Clock, label: 'Mesai', href: '/mesai' },
  { icon: Calendar, label: 'İzin', href: '/izin' },
  { icon: DollarSign, label: 'Maaş', href: '/maas' },
  { icon: TrendingUp, label: 'Gelir-Gider', href: '/gelir-gider' },
  { icon: FileText, label: 'Raporlar', href: '/raporlar' },
  { icon: Settings, label: 'Ayarlar', href: '/ayarlar' },
]

export default function ProfessionalSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside className={`bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col`}>
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold">Puantaj Pro</h1>
              <p className="text-gray-400 text-sm">Premium v1.0</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        {!collapsed && (
          <div className="mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="font-bold">H</span>
              </div>
              <div className="ml-3">
                <p className="font-medium">Halil İbrahim</p>
                <p className="text-gray-400 text-sm">Yönetici</p>
              </div>
            </div>
          </div>
        )}
        <button className="flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg w-full">
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Çıkış Yap</span>}
        </button>
      </div>
    </aside>
  )
}
