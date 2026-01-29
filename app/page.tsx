import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              🏢 Puantaj Pro
            </h1>
            <p className="text-xl mt-4 text-gray-300">Halil Demir - Professional Attendance System</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Link href="/dashboard" className="group">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-6 rounded-2xl border border-blue-700/30 hover:border-blue-500 transition-all duration-300 hover:scale-105">
              <div className="flex items-center">
                <div className="bg-blue-600 p-3 rounded-xl">📊</div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Dashboard</h3>
                  <p className="text-gray-400">Overview & Analytics</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/personel" className="group">
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 p-6 rounded-2xl border border-green-700/30 hover:border-green-500 transition-all duration-300 hover:scale-105">
              <div className="flex items-center">
                <div className="bg-green-600 p-3 rounded-xl">👥</div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Personnel</h3>
                  <p className="text-gray-400">Team Management</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/gelir-gider" className="group">
            <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 p-6 rounded-2xl border border-yellow-700/30 hover:border-yellow-500 transition-all duration-300 hover:scale-105">
              <div className="flex items-center">
                <div className="bg-yellow-600 p-3 rounded-xl">💰</div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Income-Expense</h3>
                  <p className="text-gray-400">Financial Tracking</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/yardim" className="group">
            <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 p-6 rounded-2xl border border-pink-700/30 hover:border-pink-500 transition-all duration-300 hover:scale-105">
              <div className="flex items-center">
                <div className="bg-pink-600 p-3 rounded-xl">🆘</div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Help & Support</h3>
                  <p className="text-gray-400">Documentation & Help</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-lg font-bold mb-4">📈 Monthly Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Work Hours</span>
                <span className="font-bold">8,640h</span>
              </div>
              <div className="flex justify-between">
                <span>Average Attendance</span>
                <span className="font-bold text-green-400">94%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-lg font-bold mb-4">👥 Team Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Active</span>
                <span className="font-bold text-green-400">42</span>
              </div>
              <div className="flex justify-between">
                <span>On Leave</span>
                <span className="font-bold text-yellow-400">4</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-lg font-bold mb-4">💰 Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Revenue</span>
                <span className="font-bold text-green-400">$245,800</span>
              </div>
              <div className="flex justify-between">
                <span>Expenses</span>
                <span className="font-bold text-red-400">$84,200</span>
              </div>
              <div className="flex justify-between">
                <span>Net Profit</span>
                <span className="font-bold">$161,600</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">🏢 Puantaj Pro</h2>
            <p className="text-gray-400">© 2024 Halil Demir. All rights reserved.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
