export default function ProfessionalNavbar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Page Title */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Hoş Geldiniz, Halil Bey</h2>
            <p className="text-sm text-gray-500">
              Bugün: {new Date().toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Ara..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">HD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Halil Demir</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Sistem Aktif</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">48</span> Personel • 
            <span className="text-green-600 mx-1 font-semibold">42</span> Aktif •
            <span className="text-blue-600 mx-1 font-semibold">94%</span> Katılım •
            <span className="text-purple-600 mx-1 font-semibold">₺245K</span> Gelir
          </div>
        </div>
      </div>
    </header>
  )
}
