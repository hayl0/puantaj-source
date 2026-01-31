
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#030712] text-white">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 mb-6 animate-pulse">
        <FileQuestion className="h-12 w-12" />
      </div>
      <h2 className="text-4xl font-bold mb-2">Sayfa Bulunamadı</h2>
      <p className="text-slate-400 mb-8 text-lg">Aradığınız sayfayı bulamıyoruz.</p>
      <Link href="/">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8">
          Ana Sayfaya Dön
        </Button>
      </Link>
    </div>
  )
}
