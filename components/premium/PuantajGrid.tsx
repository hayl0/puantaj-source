"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plane, 
  FileText, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  MousePointer2,
  CalendarDays,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type StatusType = 'present' | 'absent' | 'late' | 'leave' | 'report' | 'empty';

interface DayStatus {
  day: number;
  status: StatusType;
}

interface EmployeePuantaj {
  id: string;
  name: string;
  department?: string;
  statuses: DayStatus[];
}

interface PuantajGridProps {
  employees: any[]; 
  onStatsChange?: (stats: any) => void;
}

const statusConfig: Record<StatusType, { icon: any, color: string, label: string, bg: string, border: string, glow: string }> = {
  present: { icon: CheckCircle2, color: "text-emerald-500", label: "Tam Gün", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-emerald-500/20" },
  absent: { icon: XCircle, color: "text-rose-500", label: "Devamsız", bg: "bg-rose-500/10", border: "border-rose-500/20", glow: "shadow-rose-500/20" },
  late: { icon: Clock, color: "text-amber-500", label: "Yarım Gün", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-amber-500/20" },
  leave: { icon: Plane, color: "text-violet-500", label: "İzinli", bg: "bg-violet-500/10", border: "border-violet-500/20", glow: "shadow-violet-500/20" },
  report: { icon: FileText, color: "text-blue-500", label: "Raporlu", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-blue-500/20" },
  empty: { icon: HelpCircle, color: "text-slate-400", label: "Boş", bg: "bg-transparent", border: "border-transparent", glow: "shadow-none" },
};

export function PuantajGrid({ employees, onStatsChange }: PuantajGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toast } = useToast();
  
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<number, StatusType>>>({});
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Fetch attendance data when month changes
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const res = await fetch(`/api/attendance?month=${month}&year=${year}`);
        if (res.ok) {
          const data = await res.json();
          // Transform array to map
          const map: Record<string, Record<number, StatusType>> = {};
          data.forEach((record: any) => {
            const date = new Date(record.date);
            const day = date.getDate();
            if (!map[record.employeeId]) map[record.employeeId] = {};
            map[record.employeeId][day] = record.status as StatusType;
          });
          setAttendanceData(map);
        }
      } catch (error) {
        console.error("Failed to fetch attendance", error);
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Puantaj verileri yüklenemedi.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [currentDate, toast]);

  const toggleStatus = async (employeeId: string, day: number) => {
    const currentStatus = attendanceData[employeeId]?.[day] || 'empty';
    
    let nextStatus: StatusType;

    if (selectedStatus) {
      // If a specific status is selected, use it (toggle off if already applied)
      nextStatus = currentStatus === selectedStatus ? 'empty' : selectedStatus;
    } else {
      // Cycle through statuses
      const statusKeys = Object.keys(statusConfig) as StatusType[];
      const currentIndex = statusKeys.indexOf(currentStatus);
      nextStatus = statusKeys[(currentIndex + 1) % statusKeys.length];
    }

    // Optimistic update
    setAttendanceData(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [day]: nextStatus
      }
    }));

    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          day,
          month,
          year,
          status: nextStatus
        })
      });
      
      if (onStatsChange) onStatsChange({}); 
    } catch (error) {
      console.error("Failed to update status", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Durum güncellenemedi.",
      });
      // Revert optimistic update
      setAttendanceData(prev => ({
        ...prev,
        [employeeId]: {
          ...prev[employeeId],
          [day]: currentStatus
        }
      }));
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  return (
    <div className="space-y-8 relative">
      {/* Floating Toolbar - Canva Style */}
      <div className="sticky top-4 z-40 flex justify-center mb-8 pointer-events-none">
        <div className="glass-card p-1.5 rounded-full border border-white/10 shadow-2xl bg-[#030712]/80 backdrop-blur-xl flex items-center gap-1 pointer-events-auto transform hover:scale-105 transition-all duration-300 ring-1 ring-white/5">
          <button
            onClick={() => setSelectedStatus(null)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm relative overflow-hidden",
              selectedStatus === null 
                ? 'bg-white text-black shadow-lg' 
                : 'text-muted-foreground hover:text-white hover:bg-white/5'
            )}
          >
            <MousePointer2 className="w-4 h-4" />
            <span className="hidden sm:inline">Seç</span>
            {selectedStatus === null && <motion.div layoutId="activeTab" className="absolute inset-0 bg-white mix-blend-overlay opacity-20" />}
          </button>

          <div className="w-px h-6 bg-white/10 mx-1" />

          {Object.entries(statusConfig).map(([key, config]) => (
             key !== 'empty' && (
              <TooltipProvider key={key}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => setSelectedStatus(selectedStatus === key ? null : key as StatusType)}
                      className={cn(
                        "p-2.5 rounded-full transition-all duration-300 relative group",
                        selectedStatus === key
                          ? `bg-white/10 text-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] ring-1 ring-white/20`
                          : `text-muted-foreground hover:text-white hover:bg-white/5`
                      )}
                    >
                      <config.icon className={cn("w-5 h-5 transition-transform duration-300", selectedStatus === key ? "scale-110" : "group-hover:scale-110", config.color)} />
                      {selectedStatus === key && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-[#030712]" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="glass-card border-white/10 text-white text-xs font-medium py-1 px-3">
                    {config.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
             )
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-card/30 rounded-2xl p-1 border border-white/5 backdrop-blur-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={prevMonth}
              className="h-10 w-10 rounded-xl hover:bg-white/5 hover:text-white transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="px-6 text-center min-w-[180px]">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {currentDate.toLocaleString('tr-TR', { month: 'long' })}
              </h2>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-60">
                {currentDate.getFullYear()}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={nextMonth}
              className="h-10 w-10 rounded-xl hover:bg-white/5 hover:text-white transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <Button variant="outline" className="hidden sm:flex h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 gap-2">
            <CalendarDays className="w-4 h-4" />
            Bugün
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-lg border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-white/40 gap-2">
            <Filter className="w-4 h-4" />
            Filtrele
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#030712]/40 backdrop-blur-xl ring-1 ring-white/5">
        <div className="overflow-x-auto relative custom-scrollbar">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-4 text-left font-semibold text-muted-foreground sticky left-0 z-20 bg-[#030712]/95 backdrop-blur-xl border-b border-r border-white/10 min-w-[220px] shadow-[4px_0_24px_-4px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-2 pl-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    Personel Listesi
                  </div>
                </th>
                {days.map(day => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const isToday = new Date().toDateString() === date.toDateString();
                  
                  return (
                    <th key={day} className={cn(
                      "p-0 min-w-[44px] h-[60px] text-center border-b border-white/5 relative group/day transition-colors",
                      isWeekend ? 'bg-white/[0.02]' : '',
                      isToday ? 'bg-primary/10' : ''
                    )}>
                      <div className="flex flex-col items-center justify-center w-full h-full gap-0.5">
                        <span className={cn(
                          "text-[10px] uppercase tracking-wider font-mono transition-colors",
                          isToday ? 'text-primary font-bold' : 'text-muted-foreground/60'
                        )}>
                          {date.toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 2)}
                        </span>
                        <span className={cn(
                          "text-sm font-medium tabular-nums transition-all group-hover/day:scale-110",
                          isToday ? 'text-primary font-bold' : 'text-slate-300'
                        )}>
                          {day}
                        </span>
                      </div>
                      {isToday && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_-4px_12px_-2px_rgba(var(--primary),0.5)]" />}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {employees.map((employee, idx) => (
                <motion.tr 
                  key={employee.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-3 sticky left-0 z-20 bg-[#0b0f1a]/95 backdrop-blur-xl border-r border-white/5 group-hover:bg-[#111522]/95 transition-colors shadow-[4px_0_24px_-4px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-3 pl-2">
                      <Avatar className="h-9 w-9 border border-white/10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold">
                          {employee.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{employee.name}</span>
                        <span className="text-[10px] text-muted-foreground/80">{employee.department || 'Genel'}</span>
                      </div>
                    </div>
                  </td>
                  {days.map(day => {
                    const status = attendanceData[employee.id]?.[day] || 'empty';
                    const config = statusConfig[status];
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    
                    return (
                      <td key={day} className={cn(
                        "p-1 text-center relative transition-all duration-300",
                        isWeekend ? 'bg-white/[0.02]' : ''
                      )}>
                        <div className="w-full h-full flex items-center justify-center">
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => toggleStatus(employee.id, day)}
                                  disabled={loading}
                                  className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50",
                                    status === 'empty' 
                                      ? "hover:bg-white/10 text-transparent hover:text-white/20" 
                                      : `${config.bg} ${config.color} ${config.border} border shadow-lg ${config.glow} hover:scale-110 hover:brightness-110`
                                  )}
                                >
                                  {status === 'empty' ? (
                                    <div className="w-1 h-1 rounded-full bg-white/5 group-hover:bg-white/20 transition-colors" />
                                  ) : (
                                    <config.icon className="w-4 h-4" />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs font-semibold bg-[#030712] text-white border-white/10">
                                <p>{date.toLocaleDateString('tr-TR')}</p>
                                <p>{config.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
