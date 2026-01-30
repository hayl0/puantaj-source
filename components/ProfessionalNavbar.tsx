"use client"
import { Search, Bell, HelpCircle, Moon, Sun, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfessionalNavbar() {
  const [darkMode, setDarkMode] = useState(true)
  const router = useRouter()

  const handleSignOut = () => {
    // Auth olmadığı için sadece ana sayfaya yönlendir
    router.push('/')
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="search"
                placeholder="Personel, rapor veya sayfa ara..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <HelpCircle className="h-5 w-5" />
            </button>

            <button 
              onClick={handleSignOut}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-600 dark:text-red-400"
              title="Çıkış Yap"
            >
              <LogOut className="h-5 w-5" />
            </button>

            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="font-bold text-white">A</span>
              </div>
              <div className="ml-3 hidden md:block">
                <p className="font-medium dark:text-white">Admin Kullanıcı</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Yönetici</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
