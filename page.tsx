export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🚀 Puantaj Pro Live!
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Canlı yayındasınız! Sistem hazır.
          </p>
          <p className="text-gray-400">
            URL: https://brenden-colorfast-revulsively.ngrok-free.dev
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a href="/puantaj" className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-700 p-6 rounded-xl hover:border-blue-500 transition hover:scale-105">
            <h2 className="text-2xl font-bold text-white mb-2">📊 Puantaj</h2>
            <p className="text-gray-400">Ana kontrol paneli</p>
          </a>
          
          <a href="/personel" className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-700 p-6 rounded-xl hover:border-green-500 transition hover:scale-105">
            <h2 className="text-2xl font-bold text-white mb-2">👥 Personel</h2>
            <p className="text-gray-400">47 çalışan</p>
          </a>
          
          <a href="/mesai" className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-700 p-6 rounded-xl hover:border-amber-500 transition hover:scale-105">
            <h2 className="text-2xl font-bold text-white mb-2">⏰ Mesai</h2>
            <p className="text-gray-400">112 saat bu ay</p>
          </a>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">📡 Canlı Bağlantı Bilgileri</h3>
          <div className="text-left space-y-2">
            <p><span className="text-gray-400">URL:</span> <span className="text-white font-mono">https://brenden-colorfast-revulsively.ngrok-free.dev</span></p>
            <p><span className="text-gray-400">Durum:</span> <span className="text-green-400">● Canlı</span></p>
            <p><span className="text-gray-400">Gecikme:</span> <span className="text-white">194ms</span></p>
            <p><span className="text-gray-400">Bölge:</span> <span className="text-white">Europe</span></p>
          </div>
        </div>

        <div className="text-gray-400 text-sm">
          <p>Bu sayfa canlı olarak sunuluyor. Tüm dünyadan erişilebilir.</p>
          <p className="mt-2">© 2024 Puantaj Pro - Tüm hakları saklıdır.</p>
        </div>
      </div>
    </div>
  );
}
