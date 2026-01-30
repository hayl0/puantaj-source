import Link from 'next/link'
export default function Header(){
  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-puantaj">Puantaj Pro</Link>
        <nav className="space-x-4">
          <Link href="/login" className="text-sm">Giriş</Link>
          <Link href="/signup" className="text-sm">Kayıt</Link>
        </nav>
      </div>
    </header>
  )
}
