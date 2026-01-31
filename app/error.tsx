
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#030712] text-white p-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-6">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center">Bir şeyler ters gitti!</h2>
      <p className="text-slate-400 mb-8 text-center max-w-md">
        Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Tekrar Dene
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="border-white/10 hover:bg-white/5 text-white"
        >
          Ana Sayfa
        </Button>
      </div>
    </div>
  )
}
