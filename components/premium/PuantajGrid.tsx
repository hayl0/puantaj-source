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
  ChevronRight
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

const statusConfig: Record<StatusType, { icon: any, color: string, label: string, bg: string, border: string }> = {
  present: { icon: CheckCircle2, color: "text-green-500", label: "Tam Gün", bg: "bg-green-100 dark:bg-green-900/30", border: "border-green-200 dark:border-green-800" },
  absent: { icon: XCircle, color: "text-red-500", label: "Devamsız", bg: "bg-red-100 dark:bg-red-900/30", border: "border-red-200 dark:border-red-800" },
  late: { icon: Clock, color: "text-yellow-500", label: "Yarım Gün", bg: "bg-yellow-100 dark:bg-yellow-900/30", border: "border-yellow-200 dark:border-yellow-800" },
  leave: { icon: Plane, color: "text-purple-500", label: "İzinli", bg: "bg-purple-100 dark:bg-purple-900/30", border: "border-purple-200 dark:border-purple-800" },
  report: { icon: FileText, color: "text-orange-500", label: "Raporlu", bg: "bg-orange-100 dark:bg-orange-900/30", border: "border-orange-200 dark:border-orange-800" },
  empty: { icon: HelpCircle, color: "text-gray-300", label: "Girilmemiş", bg: "bg-gray-50 dark:bg-gray-800/50", border: "border-gray-200 dark:border-gray-700" },
};

export function PuantajGrid({ employees, onStatsChange }: PuantajGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toast } = useToast();
  
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<number, StatusType>>>({});
  const [loading, setLoading] = useState(false);

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
    const statusKeys = Object.keys(statusConfig) as StatusType[];
    const currentIndex = statusKeys.indexOf(currentStatus);
    const nextStatus = statusKeys[(currentIndex + 1) % statusKeys.length];

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
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          date: dateStr,
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/50 p-4 rounded-2xl border border-border/50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setCurrentDate(newDate);
            }}
            className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center min-w-[160px]">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {currentDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Puantaj Dönemi</p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setCurrentDate(newDate);
            }}
            className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 max-w-full">
          {Object.entries(statusConfig).map(([key, config]) => (
             key !== 'empty' && (
              <div key={key} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bg} ${config.border} transition-all hover:scale-105 cursor-help`}>
                <config.icon className={`w-4 h-4 ${config.color}`} />
                <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
              </div>
             )
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-border/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border/50">
                <th className="p-4 text-left font-semibold text-muted-foreground sticky left-0 z-20 bg-background/95 backdrop-blur-sm border-r border-border/50 min-w-[200px] shadow-[4px_0_12px_-4px_rgba(0,0,0,0.1)]">
                  Personel
                </th>
                {days.map(day => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const isToday = new Date().toDateString() === date.toDateString();
                  
                  return (
                    <th key={day} className={`p-0 min-w-[40px] h-[50px] text-center border-r border-border/10 last:border-0 relative group/day ${isWeekend ? 'bg-indigo-500/5' : ''} ${isToday ? 'bg-indigo-500/20' : ''}`}>
                      <div className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isToday ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
                        <span className="text-[10px] uppercase tracking-wider opacity-60 font-mono">{date.toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 2)}</span>
                        <span className="text-sm font-medium tabular-nums">{day}</span>
                      </div>
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-indigo-500/0 group-hover/day:bg-indigo-500/5 transition-colors pointer-events-none" />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {employees.map((employee, idx) => (
                <motion.tr 
                  key={employee.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4 sticky left-0 z-20 bg-background/95 backdrop-blur-sm border-r border-border/50 group-hover:bg-background/95 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border/50 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-violet-500/80 text-white text-xs">
                          {employee.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{employee.name}</span>
                        <span className="text-[10px] text-muted-foreground">{employee.department || 'Genel'}</span>
                      </div>
                    </div>
                  </td>
                  {days.map(day => {
                    const status = attendanceData[employee.id]?.[day] || 'empty';
                    const config = statusConfig[status];
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    
                    return (
                      <td key={day} className={`p-0 h-[50px] text-center border-r border-border/10 last:border-0 relative ${isWeekend ? 'bg-indigo-500/5' : ''}`}>
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => toggleStatus(employee.id, day)}
                                disabled={loading}
                                className={cn(
                                  "w-full h-full flex items-center justify-center transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50",
                                  status === 'empty' 
                                    ? "hover:bg-indigo-500/10 text-transparent hover:text-indigo-500/30" 
                                    : `${config.bg} ${config.color} hover:brightness-110 z-10`
                                )}
                              >
                                {status === 'empty' ? (
                                  <div className="w-1 h-1 rounded-full bg-white/5 group-hover:bg-indigo-500/30 transition-colors" />
                                ) : (
                                  <config.icon className="w-5 h-5" />
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs font-semibold bg-[#030712] text-white border-white/10">
                              <p>{date.toLocaleDateString('tr-TR')}</p>
                              <p>{config.label}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
