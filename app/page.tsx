import Link from 'next/link'
import { 
  Users, 
  TrendingUp, 
  BarChart, 
  CheckCircle, 
  Shield, 
  Clock,
  ArrowRight
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Puantaj <span className="text-blue-600 dark:text-blue-400">Pro</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Personel takibi, puantaj kayıtları ve finans yönetimi için profesyonel çözüm
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/dashboard" 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-lg font-medium"
            >
              Dashboard&apos;a Git
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center text-lg font-medium">
              Tema Değiştir
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Personel Takibi</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tüm personelin mesai, izin ve devam durumlarını gerçek zamanlı takip edin. Detaylı performans analizleri ile yönetim kolaylığı.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Otomatik devam takibi
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Performans raporları
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                İzin yönetimi
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Finans Yönetimi</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Aylık gelir-gider takibi, detaylı finansal raporlar ve otomatik bordro hesaplama ile finansal kontrolü elinize alın.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Otomatik bordro
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Gelir-gider analizi
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Vergi takibi
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <BarChart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Detaylı Raporlar</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Özelleştirilebilir raporlar ve grafiksel analizler ile şirketinizin performansını her yönüyle görün.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Özelleştirilmiş raporlar
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Gerçek zamanlı grafikler
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                PDF/Excel çıktı
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Şirket İstatistikleri</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">47</div>
              <div className="text-blue-100">Personel</div>
              <div className="text-sm text-blue-200 mt-1">+3 bu ay</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">94.2%</div>
              <div className="text-blue-100">Devam Oranı</div>
              <div className="text-sm text-blue-200 mt-1">+2.1% artış</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">₺125,430</div>
              <div className="text-blue-100">Aylık Gelir</div>
              <div className="text-sm text-blue-200 mt-1">+8.5% artış</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">78%</div>
              <div className="text-blue-100">Hedef Tamamlanma</div>
              <div className="text-sm text-blue-200 mt-1">%12 kaldı</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Puantaj Pro&apos;yu Deneyin
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            14 gün ücretsiz deneme sürümü ile tüm premium özellikleri keşfedin. Kredi kartı gerekmez.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-medium"
            >
              Ücretsiz Başla
            </Link>
            <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-lg font-medium">
              Demo Talep Et
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold">Puantaj Pro</h3>
              <p className="text-gray-400">© 2024 Tüm hakları saklıdır.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Gizlilik Politikası</a>
              <a href="#" className="text-gray-400 hover:text-white">Kullanım Şartları</a>
              <a href="#" className="text-gray-400 hover:text-white">İletişim</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
