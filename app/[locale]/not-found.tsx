
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import { BackgroundGrid } from '@/components/premium/BackgroundGrid'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#030712] text-white relative overflow-hidden">
      <BackgroundGrid fixed />
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 mb-6 animate-pulse relative z-10">
        <FileQuestion className="h-12 w-12" />
      </div>
      <h2 className="text-4xl font-bold mb-2 relative z-10">Sayfa Bulunamadı</h2>
      <p className="text-slate-400 mb-8 text-lg relative z-10">Aradığınız sayfayı bulamıyoruz.</p>
      <Link href="/" className="relative z-10">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8">
          Ana Sayfaya Dön
        </Button>
      </Link>
    </div>
  )
}
