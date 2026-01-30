"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Briefcase, Plus, Filter, Download, 
  Calendar, Clock, Sun, Moon, Sunrise,
  MoreHorizontal, UserPlus, Sparkles
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

// Mock Shift Types
const shiftTypes = [
  { id: 1, name: 'Gündüz', time: '08:00 - 17:00', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 2, name: 'Akşam', time: '16:00 - 00:00', icon: Sunrise, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 3, name: 'Gece', time: '00:00 - 08:00', icon: Moon, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

// Mock Schedule Data (7 days)
const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const schedule = [
  { 
    employee: { name: 'Ahmet Yılmaz', role: 'Yazılım Uzmanı', avatar: '/avatars/01.png' },
    shifts: [1, 1, 1, 1, 1, null, null]
  },
  { 
    employee: { name: 'Ayşe Demir', role: 'İK Uzmanı', avatar: '/avatars/02.png' },
    shifts: [1, 1, 1, 1, 1, null, null]
  },
  { 
    employee: { name: 'Mehmet Kaya', role: 'Güvenlik', avatar: '/avatars/03.png' },
    shifts: [3, 3, 3, 3, 3, 3, null]
  },
  { 
    employee: { name: 'Zeynep Arslan', role: 'Satış Temsilcisi', avatar: '/avatars/04.png' },
    shifts: [2, 2, 2, 2, 2, 1, null]
  },
  { 
    employee: { name: 'Can Yıldız', role: 'Teknik Destek', avatar: '/avatars/05.png' },
    shifts: [2, 2, 2, 2, 2, null, null]
  },
];

export default function VardiyaPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'user';

  const getShift = (id: number | null) => shiftTypes.find(s => s.id === id);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Vardiya Planlaması" 
        description="Personel çalışma saatlerini ve haftalık vardiya düzenini yönetin"
      >
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Planı İndir
        </Button>
        {userRole === 'admin' && (
          <>
             <Button variant="outline" className="gap-2 border-purple-500/30 text-purple-500 hover:bg-purple-500/10">
              <Sparkles className="w-4 h-4" />
              AI ile Dağıt
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20">
              <Plus className="w-4 h-4" />
              Vardiya Oluştur
            </Button>
          </>
        )}
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shiftTypes.map((shift) => (
          <PremiumCard key={shift.id} className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
              <shift.icon className="w-24 h-24" />
            </div>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${shift.bg} ${shift.color}`}>
                <shift.icon className="w-6 h-6" />
              </div>
              <Badge variant="outline" className={shift.border}>
                {shift.time}
              </Badge>
            </div>
            <h3 className="text-xl font-bold mb-1">{shift.name}</h3>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <UserPlus className="w-4 h-4" />
              <span className="text-sm">Aktif Personel: {schedule.filter(s => s.shifts.includes(shift.id)).length}</span>
            </div>
            <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
              <div className={`h-full ${shift.bg.replace('/10', '')} w-[70%]`} />
            </div>
          </PremiumCard>
        ))}
      </div>

      {/* Schedule Grid */}
      <PremiumCard className="overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Haftalık Çizelge
            <span className="text-sm font-normal text-muted-foreground ml-2">(29 Ocak - 4 Şubat)</span>
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrele
            </Button>
            <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
              <Button size="sm" variant="secondary" className="h-8 shadow-sm">Haftalık</Button>
              <Button size="sm" variant="ghost" className="h-8">Aylık</Button>
            </div>
          </div>
        </div>

        <ScrollArea className="w-full pb-4">
          <div className="min-w-[1000px]">
            {/* Header Row */}
            <div className="grid grid-cols-[250px_repeat(7,1fr)] gap-4 mb-4 px-4">
              <div className="font-medium text-muted-foreground">Personel</div>
              {days.map((day, i) => (
                <div key={i} className="text-center font-medium text-muted-foreground bg-secondary/30 rounded-lg py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Employee Rows */}
            <div className="space-y-3 px-4">
              {schedule.map((row, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-[250px_repeat(7,1fr)] gap-4 items-center group hover:bg-secondary/20 p-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={row.employee.avatar} />
                      <AvatarFallback>{row.employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{row.employee.name}</p>
                      <p className="text-xs text-muted-foreground">{row.employee.role}</p>
                    </div>
                  </div>

                  {row.shifts.map((shiftId, j) => {
                    const shift = getShift(shiftId);
                    return (
                      <div key={j} className="flex justify-center">
                        {shift ? (
                          <div className={`
                            w-full py-2 px-1 rounded-lg text-xs font-medium text-center border
                            ${shift.bg} ${shift.color} ${shift.border}
                            hover:scale-105 transition-transform cursor-pointer
                          `}>
                            {shift.name}
                          </div>
                        ) : (
                          <div className="w-full py-2 rounded-lg text-xs text-center text-muted-foreground/30 bg-secondary/10 border border-transparent border-dashed hover:border-border cursor-pointer">
                            -
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </PremiumCard>
    </div>
  );
}
