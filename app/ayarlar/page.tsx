"use client"
import { Settings, Bell, Shield, User, Database, Globe } from 'lucide-react'
import { useState } from 'react'

export default function AyarlarPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    twoFactorAuth: false,
    autoSave: true,
    language: 'tr',
    timezone: 'Europe/Istanbul',
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Sistem Ayarları
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sistem tercihlerinizi ve güvenlik ayarlarınızı yönetin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-blue-500 mr-3" />
            <h3 className="text-lg font-semibold dark:text-white">Kullanıcı Ayarları</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Bildirimler</span>
              <button
                onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${settings.notifications ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Koyu Mod</span>
              <button
                onClick={() => setSettings({...settings, darkMode: !settings.darkMode})}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Otomatik Kaydet</span>
              <button
                onClick={() => setSettings({...settings, autoSave: !settings.autoSave})}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${settings.autoSave ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${settings.autoSave ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-green-500 mr-3" />
            <h3 className="text-lg font-semibold dark:text-white">Güvenlik Ayarları</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">İki Faktörlü Doğrulama</span>
              <button
                onClick={() => setSettings({...settings, twoFactorAuth: !settings.twoFactorAuth})}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="space-y-2">
              <span className="text-gray-700 dark:text-gray-300">Şifre Değiştir</span>
              <input
                type="password"
                placeholder="Yeni şifrenizi girin"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            <Globe className="h-6 w-6 text-purple-500 mr-3" />
            <h3 className="text-lg font-semibold dark:text-white">Sistem Ayarları</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-gray-700 dark:text-gray-300">Dil</span>
              <select 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div className="space-y-2">
              <span className="text-gray-700 dark:text-gray-300">Saat Dilimi</span>
              <select 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              >
                <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                <option value="Europe/London">Londra (UTC+0)</option>
                <option value="America/New_York">New York (UTC-5)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            <Database className="h-6 w-6 text-orange-500 mr-3" />
            <h3 className="text-lg font-semibold dark:text-white">Veri Yönetimi</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Veri Yedekle
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Yedekten Geri Yükle
            </button>
            <button className="w-full px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900">
              Önbelleği Temizle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
