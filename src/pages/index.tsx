import Link from 'next/link'
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Puantaj Pro — Hoş geldiniz</h1>
        <p className="mb-4">Bu başlangıç iskeleti. Giriş ve kayıt sayfalarına göz atın.</p>
        <div className="space-x-4">
          <Link href="/login" className="text-puantaj font-semibold">Giriş</Link>
          <Link href="/signup" className="text-gray-600">Kayıt</Link>
        </div>
      </div>
    </main>
  )
}
