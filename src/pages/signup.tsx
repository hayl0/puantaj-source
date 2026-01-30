export default function Signup() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Kayıt</h1>
        <form className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Ad Soyad" />
          <input className="w-full p-2 border rounded" placeholder="Email" />
          <input type="password" className="w-full p-2 border rounded" placeholder="Parola" />
          <button className="w-full bg-puantaj text-white py-2 rounded">Hesap Oluştur</button>
        </form>
      </div>
    </main>
  )
}
