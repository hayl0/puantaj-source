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
      <div className="sticky top-4 z-40 flex justify-center mb-10 pointer-events-none">
        <div className="glass-card p-2 rounded-full border border-white/20 shadow-2xl bg-white/90 dark:bg-black/80 backdrop-blur-xl flex items-center gap-2 pointer-events-auto transform hover:scale-105 transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10">
          <button
            onClick={() => setSelectedStatus(null)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-medium text-sm relative overflow-hidden",
              selectedStatus === null 
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10'
            )}
          >
            <MousePointer2 className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Seç</span>
          </button>

          <div className="w-px h-8 bg-black/10 dark:bg-white/10 mx-1" />

          {Object.entries(statusConfig).map(([key, config]) => (
             key !== 'empty' && (
              <TooltipProvider key={key}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => setSelectedStatus(selectedStatus === key ? null : key as StatusType)}
                      className={cn(
                        "p-3 rounded-full transition-all duration-300 relative group",
                        selectedStatus === key
                          ? `bg-black/5 dark:bg-white/10 shadow-inner ring-1 ring-black/10 dark:ring-white/20`
                          : `text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110`
                      )}
                    >
                      <config.icon className={cn("w-5 h-5 transition-transform duration-300", config.color)} />
                      {selectedStatus === key && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-black animate-pulse" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="glass-card border-black/5 dark:border-white/10 text-xs font-bold py-1.5 px-4 rounded-full shadow-xl">
                    {config.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
             )
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/50 dark:bg-black/50 rounded-[2rem] p-1.5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={prevMonth}
              className="h-11 w-11 rounded-full hover:bg-white dark:hover:bg-white/10 hover:shadow-md transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="px-8 text-center min-w-[200px]">
              <h2 className="text-3xl font-bold tracking-tighter text-foreground font-heading">
                {currentDate.toLocaleString('tr-TR', { month: 'long' })}
              </h2>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em] opacity-60">
                {currentDate.getFullYear()}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={nextMonth}
              className="h-11 w-11 rounded-full hover:bg-white dark:hover:bg-white/10 hover:shadow-md transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <Button variant="outline" className="hidden sm:flex h-14 rounded-2xl border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-white/10 gap-2 shadow-sm font-semibold">
            <CalendarDays className="w-5 h-5" />
            Bugün
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-xl border-dashed border-black/20 dark:border-white/20 text-muted-foreground hover:text-foreground hover:border-black/40 dark:hover:border-white/40 gap-2">
            <Filter className="w-4 h-4" />
            Filtrele
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-2xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/5">
        <div className="overflow-x-auto relative custom-scrollbar">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-6 text-left font-bold text-muted-foreground sticky left-0 z-20 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-xl border-b border-r border-black/5 dark:border-white/5 min-w-[240px] shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_-4px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-3 pl-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    <span className="text-lg tracking-tight text-foreground">Personel Listesi</span>
                  </div>
                </th>
                {days.map(day => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const isToday = new Date().toDateString() === date.toDateString();
                  
                  return (
                    <th key={day} className={cn(
                      "p-0 min-w-[48px] h-[72px] text-center border-b border-black/5 dark:border-white/5 relative group/day transition-colors",
                      isWeekend ? 'bg-black/[0.02] dark:bg-white/[0.02]' : '',
                      isToday ? 'bg-primary/5' : ''
                    )}>
                      <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                        <span className={cn(
                          "text-[10px] uppercase tracking-wider font-bold transition-colors",
                          isToday ? 'text-primary' : 'text-muted-foreground/50'
                        )}>
                          {date.toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 2)}
                        </span>
                        <div className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-full text-base font-bold tabular-nums transition-all group-hover/day:scale-110",
                          isToday ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'text-foreground/70'
                        )}>
                          {day}
                        </div>
                      </div>
                      {isToday && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_-4px_12px_-2px_rgba(var(--primary),0.5)]" />}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {employees.map((employee, idx) => (
                <motion.tr 
                  key={employee.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4 sticky left-0 z-20 bg-white/95 dark:bg-[#0b0f1a]/95 backdrop-blur-xl border-r border-black/5 dark:border-white/5 group-hover:bg-white/90 dark:group-hover:bg-[#111522]/95 transition-colors shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_-4px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-4 pl-2">
                      <Avatar className="h-10 w-10 border-2 border-white dark:border-white/10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all shadow-md">
                        <AvatarFallback className="bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white text-xs font-black tracking-wider">
                          {employee.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">{employee.name}</span>
                        <span className="text-[10px] font-medium text-muted-foreground/70 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full w-fit">{employee.department || 'Genel'}</span>
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
                        "p-1.5 text-center relative transition-all duration-300",
                        isWeekend ? 'bg-black/[0.02] dark:bg-white/[0.02]' : ''
                      )}>
                        <div className="w-full h-full flex items-center justify-center">
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => toggleStatus(employee.id, day)}
                                  disabled={loading}
                                  className={cn(
                                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50",
                                    status === 'empty' 
                                      ? "hover:bg-black/5 dark:hover:bg-white/10 text-transparent hover:text-black/20 dark:hover:text-white/20" 
                                      : `${config.bg} ${config.color} ${config.border} border shadow-sm ${config.glow} hover:scale-110 hover:shadow-md`
                                  )}
                                >
                                  {status === 'empty' ? (
                                    <div className="w-1 h-1 rounded-full bg-black/5 dark:bg-white/5 group-hover:bg-black/20 dark:group-hover:bg-white/20 transition-colors" />
                                  ) : (
                                    <config.icon className="w-4 h-4" />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs font-bold bg-foreground text-background border-border shadow-xl rounded-lg py-2 px-3">
                                <p className="opacity-70 font-medium mb-0.5">{date.toLocaleDateString('tr-TR')}</p>
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
