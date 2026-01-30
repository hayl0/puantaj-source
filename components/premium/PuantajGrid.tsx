"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plane,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isToday } from "date-fns";
import { tr } from "date-fns/locale";
import { motion } from "framer-motion";

// Types
export type AttendanceStatus = "present" | "half" | "absent" | "leave" | "report";

interface Employee {
  id: string;
  name: string;
  department: string;
  avatar?: string;
}

interface AttendanceRecord {
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  hours?: number;
  note?: string;
}

export interface AggregateStats {
  present: number;
  half: number;
  absent: number;
  leave: number;
  report: number;
}

interface PuantajGridProps {
  initialDate?: Date;
  employees: Employee[];
  onStatsChange?: (stats: AggregateStats) => void;
}

const statusConfig = {
  present: { label: "Tam", icon: CheckCircle2, color: "bg-green-500", text: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
  half: { label: "Yarım", icon: Clock, color: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  absent: { label: "Yok", icon: XCircle, color: "bg-red-500", text: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
  leave: { label: "İzin", icon: Plane, color: "bg-purple-500", text: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
  report: { label: "Rapor", icon: FileText, color: "bg-orange-500", text: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
};

export function PuantajGrid({ initialDate = new Date(), employees, onStatsChange }: PuantajGridProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Generate days for the current month
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Toggle status on click
  const toggleStatus = (employeeId: string, dayStr: string) => {
    const key = `${employeeId}-${dayStr}`;
    const currentStatus = attendance[key] || "present";
    
    const statusCycle: AttendanceStatus[] = ["present", "half", "absent", "leave", "report"];
    const nextIndex = (statusCycle.indexOf(currentStatus) + 1) % statusCycle.length;
    const nextStatus = statusCycle[nextIndex];

    setAttendance(prev => ({
      ...prev,
      [key]: nextStatus
    }));
  };

  const getStatus = (employeeId: string, dayStr: string): AttendanceStatus => {
    return attendance[`${employeeId}-${dayStr}`] || "present";
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const calculateStats = (employeeId: string) => {
    let present = 0, half = 0, absent = 0, leave = 0, report = 0;
    
    days.forEach(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const status = getStatus(employeeId, dayStr);
      
      if (isWeekend(day)) return; // Don't count weekends by default logic (can be customized)

      switch(status) {
        case 'present': present++; break;
        case 'half': half++; break;
        case 'absent': absent++; break;
        case 'leave': leave++; break;
        case 'report': report++; break;
      }
    });

    return { present, half, absent, leave, report };
  };

  const prevStatsRef = useRef<AggregateStats | null>(null);

  useEffect(() => {
    if (onStatsChange) {
      const totalStats: AggregateStats = {
        present: 0,
        half: 0,
        absent: 0,
        leave: 0,
        report: 0
      };

      employees.forEach(employee => {
        const stats = calculateStats(employee.id);
        totalStats.present += stats.present;
        totalStats.half += stats.half;
        totalStats.absent += stats.absent;
        totalStats.leave += stats.leave;
        totalStats.report += stats.report;
      });

      // Check if stats actually changed
      const prevStats = prevStatsRef.current;
      const hasChanged = !prevStats || 
        prevStats.present !== totalStats.present ||
        prevStats.half !== totalStats.half ||
        prevStats.absent !== totalStats.absent ||
        prevStats.leave !== totalStats.leave ||
        prevStats.report !== totalStats.report;

      if (hasChanged) {
        prevStatsRef.current = totalStats;
        onStatsChange(totalStats);
      }
    }
  }, [attendance, currentDate, employees, onStatsChange]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-bold text-lg w-40 text-center">
            {format(currentDate, 'MMMM yyyy', { locale: tr })}
          </div>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
              <div className={`w-2 h-2 rounded-full ${config.color}`} />
              <span>{config.label}</span>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-indigo-600">
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Kaydet
        </Button>
      </div>

      {/* Grid */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px] sticky left-0 z-20 bg-card border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Personel</TableHead>
                {days.map(day => (
                  <TableHead key={day.toString()} className={cn(
                    "text-center min-w-[40px] p-0 h-12 text-xs",
                    isWeekend(day) ? "bg-muted/30 text-red-500" : "",
                    isToday(day) ? "bg-blue-500/10 text-blue-600 font-bold" : ""
                  )}>
                    <div className="flex flex-col items-center justify-center h-full py-1">
                      <span>{format(day, 'd')}</span>
                      <span className="opacity-70 text-[10px]">{format(day, 'EEE', { locale: tr })}</span>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-center w-[60px] bg-muted/30">Tam</TableHead>
                <TableHead className="text-center w-[60px] bg-muted/30">Eksik</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee, idx) => {
                const stats = calculateStats(employee.id);
                return (
                  <motion.tr 
                    key={employee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="sticky left-0 z-20 bg-card group-hover:bg-muted/50 border-r font-medium">
                      <div className="flex flex-col">
                        <span className="text-sm">{employee.name}</span>
                        <span className="text-xs text-muted-foreground">{employee.department}</span>
                      </div>
                    </TableCell>
                    {days.map(day => {
                      const dayStr = format(day, 'yyyy-MM-dd');
                      const status = getStatus(employee.id, dayStr);
                      const config = statusConfig[status];
                      
                      return (
                        <TableCell 
                          key={dayStr} 
                          className={cn(
                            "p-0 text-center border-l border-border/50 cursor-pointer transition-all hover:brightness-95",
                            config.bg,
                            isWeekend(day) && status === 'present' ? "opacity-50" : ""
                          )}
                          onClick={() => toggleStatus(employee.id, dayStr)}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="w-full h-10 flex items-center justify-center">
                                  {status === 'present' && !isWeekend(day) ? (
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                                  ) : (
                                    <config.icon className={cn("h-4 w-4", config.text)} />
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{format(day, 'd MMMM', { locale: tr })}</p>
                                <p className="font-bold">{config.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      );
                    })}
                    {(() => {
                      const stats = calculateStats(employee.id);
                      return (
                        <>
                          <TableCell className="text-center font-bold text-green-600 bg-muted/30">{stats.present}</TableCell>
                          <TableCell className="text-center font-bold text-red-600 bg-muted/30">{stats.absent + stats.leave + stats.report}</TableCell>
                        </>
                      );
                    })()}
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
