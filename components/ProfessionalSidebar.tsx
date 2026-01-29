import Link from 'next/link'

export default function ProfessionalSidebar() {
  const menuItems = [
    { href: '/dashboard', icon: '📊', label: 'Dashboard', badge: null },
    { href: '/personel', icon: '👥', label: 'Personel', badge: '48' },
    { href: '/puantaj', icon: '⏰', label: 'Puantaj', badge: '94%' },
    { href: '/gelir-gider', icon: '💰', label: 'Gelir-Gider', badge: '₺245K' },
    { href: '/raporlar', icon: '📈', label: 'Raporlar', badge: '24' },
    { href: '/finans', icon: '💳', label: 'Finans', badge: null },
    { href: '/mesai', icon: '🌙', label: 'Mesai', badge: '12' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Puantaj<span className="text-blue-600">Pro</span></h1>
            <p className="text-xs text-gray-500">Enterprise Edition</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">Ana Modüller</h3>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group"
              >
                <div className="flex items-center">
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  )
}
