"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Briefcase, Plus, Filter, Download, 
  Calendar as CalendarIcon, Clock, Sun, Moon, Sunrise,
  MoreHorizontal, UserPlus, Sparkles, Loader2, ChevronLeft, ChevronRight,
  CalendarDays
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { createGoogleCalendarUrl } from '@/lib/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Shift Types for UI styling
const shiftStyles: Record<string, any> = {
  'Gündüz': { icon: Sun, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  'Akşam': { icon: Sunrise, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  'Gece': { icon: Moon, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  'Mesai': { icon: Clock, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
};

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  date: string;
  employeeId: string;
  employee?: {
    name: string;
    position: string;
  };
}

interface Employee {
  id: string;
  name: string;
  position: string;
}

export default function VardiyaPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const userRole = (session?.user as any)?.role || 'user';
  
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Form states
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [shiftDate, setShiftDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [shiftName, setShiftName] = useState("Gündüz");

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, currentWeekStart]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const startStr = weekDays[0].toISOString();
      const endStr = weekDays[6].toISOString();
      
      // Fetch shifts
      const shiftsRes = await fetch(`/api/shifts?startDate=${startStr}&endDate=${endStr}`);
      if (shiftsRes.ok) {
        const data = await shiftsRes.json();
        setShifts(data);
      }

      // Fetch employees if admin
      if (userRole === 'admin' || userRole === 'user') {
        const empRes = await fetch('/api/employees');
        if (empRes.ok) {
           const data = await empRes.json();
           setEmployees(data);
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Veriler yüklenirken bir sorun oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShift = async () => {
    if (!selectedEmployee || !shiftDate || !startTime || !endTime) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Lütfen tüm alanları doldurun.",
      });
      return;
    }

    try {
        const res = await fetch('/api/shifts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                employeeId: selectedEmployee,
                date: shiftDate,
                startTime,
                endTime,
                name: shiftName
            })
        });

        if (res.ok) {
            toast({
              title: "Başarılı",
              description: "Vardiya başarıyla oluşturuldu.",
            });
            setIsDialogOpen(false);
            fetchData();
        } else {
            throw new Error("Failed to create shift");
        }
    } catch (e) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Vardiya oluşturulurken bir hata oluştu.",
        });
    }
  };

  const getShiftForDay = (employeeId: string, date: Date) => {
      return shifts.find(s => s.employeeId === employeeId && isSameDay(parseISO(s.date), date));
  };

  const handleAIDistribute = async () => {
    if (!confirm('Bu hafta için otomatik vardiya dağıtımı yapılsın mı? Mevcut boşluklar doldurulacak.')) return;

    try {
      setLoading(true);
      const startStr = weekDays[0].toISOString();
      const endStr = weekDays[6].toISOString();

      const res = await fetch('/api/ai/distribute-shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: startStr, endDate: endStr })
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "AI Dağıtımı Başarılı ✨",
          description: data.message,
        });
        fetchData();
      } else {
        throw new Error(data.error || "Dağıtım hatası");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Otomatik dağıtım sırasında bir sorun oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Vardiya Planlaması" 
        description={`${format(weekDays[0], 'd MMMM', { locale: tr })} - ${format(weekDays[6], 'd MMMM yyyy', { locale: tr })}`}
      >
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevWeek}>
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextWeek}>
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>

        {userRole === 'admin' && (
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    className="gap-2 border-purple-200 hover:bg-purple-50 text-purple-600 dark:border-purple-800 dark:hover:bg-purple-900/20"
                    onClick={handleAIDistribute}
                >
                    <Sparkles className="w-4 h-4" />
                    AI ile Dağıt
                </Button>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20">
                  <Plus className="w-4 h-4" />
                  Vardiya Oluştur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Vardiya Ekle</DialogTitle>
                  <DialogDescription>
                    Personel için çalışma saati belirleyin.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Personel</Label>
                    <Select onValueChange={setSelectedEmployee} value={selectedEmployee}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Personel seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Tarih</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "col-span-3 justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10 hover:text-white",
                            !shiftDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {shiftDate ? format(shiftDate, "d MMMM yyyy", { locale: tr }) : <span>Tarih seçin</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={shiftDate}
                          onSelect={setShiftDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Vardiya Tipi</Label>
                    <Select onValueChange={setShiftName} value={shiftName}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Tip seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gündüz">Gündüz (08:00 - 17:00)</SelectItem>
                        <SelectItem value="Akşam">Akşam (16:00 - 00:00)</SelectItem>
                        <SelectItem value="Gece">Gece (00:00 - 08:00)</SelectItem>
                        <SelectItem value="Mesai">Özel Mesai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Başlangıç</Label>
                    <Input 
                        type="time" 
                        className="col-span-3" 
                        value={startTime} 
                        onChange={(e) => setStartTime(e.target.value)} 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Bitiş</Label>
                    <Input 
                        type="time" 
                        className="col-span-3" 
                        value={endTime} 
                        onChange={(e) => setEndTime(e.target.value)} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateShift}>Oluştur</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </PageHeader>

      {loading ? (
        <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
            <div className="grid grid-cols-8 bg-muted/50 divide-x border-b">
                <div className="p-4 font-medium text-sm text-muted-foreground">Personel</div>
                {weekDays.map((day, i) => (
                    <div key={i} className="p-4 text-center">
                        <div className="font-medium text-sm">{format(day, 'EEEE', { locale: tr })}</div>
                        <div className="text-xs text-muted-foreground">{format(day, 'd MMM', { locale: tr })}</div>
                    </div>
                ))}
            </div>
            <div className="divide-y">
                {employees.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">Personel bulunamadı.</div>
                ) : (
                    employees.map((emp) => (
                        <div key={emp.id} className="grid grid-cols-8 divide-x hover:bg-muted/20 transition-colors">
                            <div className="p-4 flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{emp.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="text-sm font-medium">{emp.name}</div>
                                    <div className="text-xs text-muted-foreground">{emp.position}</div>
                                </div>
                            </div>
                            {weekDays.map((day, i) => {
                                const shift = getShiftForDay(emp.id, day);
                                const style = shift ? shiftStyles[shift.name] || shiftStyles['Mesai'] : null;
                                
                                return (
                                    <div key={i} className="p-2 min-h-[80px] flex items-center justify-center">
                                        {shift ? (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <div className={`cursor-pointer w-full h-full rounded-lg p-2 flex flex-col items-center justify-center gap-1 border ${style.bg} ${style.border} hover:opacity-80 transition-opacity`}>
                                                        {style.icon && <style.icon className={`w-4 h-4 ${style.color}`} />}
                                                        <span className={`text-xs font-medium ${style.color}`}>{shift.startTime}</span>
                                                        <span className={`text-xs ${style.color} opacity-70`}>{shift.endTime}</span>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-64 p-3">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 border-b pb-2">
                                                            {style.icon && <style.icon className={`w-5 h-5 ${style.color}`} />}
                                                            <div>
                                                                <p className="font-semibold text-sm">{shift.name}</p>
                                                                <p className="text-xs text-muted-foreground">{format(parseISO(shift.date), 'd MMMM yyyy', { locale: tr })}</p>
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-1 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Saat:</span>
                                                                <span>{shift.startTime} - {shift.endTime}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Personel:</span>
                                                                <span>{emp.name}</span>
                                                            </div>
                                                        </div>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="w-full gap-2 h-8 text-xs"
                                                            onClick={() => {
                                                                const startDateTime = parseISO(`${shift.date}T${shift.startTime}`);
                                                                const endDateTime = parseISO(`${shift.date}T${shift.endTime}`);
                                                                if (endDateTime < startDateTime) {
                                                                    endDateTime.setDate(endDateTime.getDate() + 1);
                                                                }
                                                                const url = createGoogleCalendarUrl({
                                                                    title: `Vardiya: ${shift.name}`,
                                                                    description: `Personel: ${emp.name}\nSaat: ${shift.startTime} - ${shift.endTime}`,
                                                                    startDate: startDateTime,
                                                                    endDate: endDateTime,
                                                                    location: 'Ofis'
                                                                });
                                                                window.open(url, '_blank');
                                                            }}
                                                        >
                                                            <CalendarDays className="w-3 h-3" />
                                                            Google Takvim'e Ekle
                                                        </Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => {
                                                    setSelectedEmployee(emp.id);
                                                    setShiftDate(day);
                                                    setIsDialogOpen(true);
                                                }}>
                                                    <Plus className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
            </div>
        </div>
      )}
    </div>
  );
}
