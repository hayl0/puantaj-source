import { Search, Bell, Sun, User, ChevronDown } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Personel ara, rapor bul, işlem yap..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4 ml-6">
            {/* Theme Toggle */}
            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <Sun className="w-5 h-5 text-gray-400" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-800">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">Halil Demir</p>
                <p className="text-xs text-gray-400">Yönetici</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="flex items-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Sistem Aktif</span>
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-white">48</span> Personel • 
            <span className="text-green-400 mx-1">42</span> Aktif •
            <span className="text-blue-400 mx-1">94%</span> Katılım
          </div>
        </div>
      </div>
    </header>
  )
}
