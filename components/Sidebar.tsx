import Link from 'next/link'
import { Home, Users, Clock, DollarSign, BarChart3, CreditCard, Moon, Settings, HelpCircle } from 'lucide-react'

export default function Sidebar() {
  const menuItems = [
    { href: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { href: '/personel', icon: <Users size={20} />, label: 'Personel' },
    { href: '/puantaj', icon: <Clock size={20} />, label: 'Puantaj' },
    { href: '/gelir-gider', icon: <DollarSign size={20} />, label: 'Gelir-Gider' },
    { href: '/raporlar', icon: <BarChart3 size={20} />, label: 'Raporlar' },
    { href: '/finans', icon: <CreditCard size={20} />, label: 'Finans' },
    { href: '/mesai', icon: <Moon size={20} />, label: 'Mesai' },
    { href: '/ayarlar', icon: <Settings size={20} />, label: 'Ayarlar' },
    { href: '/yardim', icon: <HelpCircle size={20} />, label: 'Yardım' },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Puantaj<span className="text-blue-400">Pro</span></h1>
            <p className="text-xs text-gray-400">Ultra Modern</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">Ana Menü</h3>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all group"
              >
                <span className="mr-3 opacity-70 group-hover:opacity-100">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                <span className="ml-auto text-xs text-gray-500 group-hover:text-blue-400">→</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">HD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Halil Demir</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </aside>
  )
}
