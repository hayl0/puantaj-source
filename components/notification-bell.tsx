"use client"
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function NotificationBell() {
  const handleClick = () => {
    toast.success('Yeni bildirimler kontrol edildi', {
      description: '3 yeni mesajınız var',
    })
  }

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <Bell className="h-5 w-5" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
    </Button>
  )
}
