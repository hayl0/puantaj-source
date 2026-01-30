import Link from 'next/link'
export default function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Giriş</h1>
        <form className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Email" />
          <input type="password" className="w-full p-2 border rounded" placeholder="Parola" />
          <button className="w-full bg-puantaj text-white py-2 rounded">Giriş Yap</button>
        </form>
        <p className="mt-4 text-sm">Hesabın yok mu? <Link href="/signup" className="text-puantaj">Kayıt ol</Link></p>
      </div>
    </main>
  )
}
