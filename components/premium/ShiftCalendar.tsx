"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ShiftCalendarProps {
  events: any[]; // TUI Calendar events
  onRangeChange?: (range: { start: Date; end: Date }) => void;
  onEventClick?: (event: any) => void;
  onDateClick?: (date: Date) => void; // TUI doesn't have direct onDateClick in month view same as FC, but allows creation
  className?: string;
}

export function ShiftCalendar({ 
  events, 
  onRangeChange, 
  onEventClick, 
  onDateClick,
  className 
}: ShiftCalendarProps) {
  const { theme } = useTheme();
  const calendarRef = useRef<any | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Helper to get calendar instance
  const getCalInstance = () => calendarRef.current;

  const updateCurrentDate = useCallback(() => {
    const cal = getCalInstance();
    if (cal) {
      setCurrentDate(new Date(cal.getDate().toJSDate()));
      
      if (onRangeChange) {
        const start = cal.getDateRangeStart().toJSDate();
        const end = cal.getDateRangeEnd().toJSDate();
        onRangeChange({ start, end });
      }
    }
  }, [onRangeChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Calendar
    const calendar = new Calendar(containerRef.current, {
      defaultView: 'month',
      useDetailPopup: false,
      useFormPopup: false,
      isReadOnly: true,
      usageStatistics: false,
      month: {
        dayNames: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
        visibleWeeksCount: 6,
      },
      week: {
        dayNames: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
        taskView: false,
      },
      calendars: [{ id: '1', name: 'Shifts', backgroundColor: 'transparent' }]
    });

    calendarRef.current = calendar;

    // Bind events
    calendar.on('clickEvent', (eventInfo: any) => {
      if (onEventClick) {
        onEventClick(eventInfo.event);
      }
    });

    calendar.on('selectDateTime', (eventInfo: any) => {
        const start = eventInfo.start.toJSDate();
        if (onDateClick) {
            onDateClick(start);
        }
        calendar.clearGridSelections();
    });

    // Initial update
    updateCurrentDate();

    return () => {
      calendar.destroy();
      calendarRef.current = null;
    };
  }, []); // Run once on mount

  // Update events when props change
  useEffect(() => {
    const cal = getCalInstance();
    if (cal && events) {
      cal.clear();
      cal.createEvents(events);
    }
  }, [events]);

  useEffect(() => {
    const cal = getCalInstance();
    if (cal) {
      // Apply theme based on dark/light mode
      const isDark = theme === 'dark';
      cal.setOptions({
        theme: {
          common: {
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            dayName: { color: isDark ? '#fff' : '#333' },
            saturday: { color: isDark ? '#ff4040' : '#333' },
            holiday: { color: isDark ? '#ff4040' : '#333' },
          },
          month: {
            dayName: { 
                borderLeft: 'none', 
                backgroundColor: 'transparent' 
            },
            moreView: {
                backgroundColor: isDark ? '#1f2937' : '#fff',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }
          }
        }
      });
    }
  }, [theme]);

  const handlePrev = () => {
    const cal = getCalInstance();
    if (cal) {
        cal.prev();
        updateCurrentDate();
    }
  };

  const handleNext = () => {
    const cal = getCalInstance();
    if (cal) {
        cal.next();
        updateCurrentDate();
    }
  };

  const handleToday = () => {
    const cal = getCalInstance();
    if (cal) {
        cal.today();
        updateCurrentDate();
    }
  };

  const changeView = (newView: 'month' | 'week' | 'day') => {
    const cal = getCalInstance();
    if (cal) {
        cal.changeView(newView);
        setView(newView);
        updateCurrentDate();
    }
  };

  return (
    <Card className={cn("glass-card border-0 shadow-2xl overflow-hidden flex flex-col", className)}>
      <CardHeader className="flex flex-col md:flex-row items-center justify-between pb-4 border-b border-border/10 space-y-4 md:space-y-0 p-4">
        <div className="flex items-center gap-4">
          <div className="flex bg-background/50 backdrop-blur-md rounded-lg p-1 border border-border/50 shadow-inner">
            <Button variant="ghost" size="icon" onClick={handlePrev} className="h-8 w-8 hover:bg-background/80">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleToday} className="h-8 px-3 text-xs font-medium hover:bg-background/80">
              Bugün
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8 hover:bg-background/80">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 truncate min-w-[150px]">
            {format(currentDate, 'MMMM yyyy', { locale: tr })}
          </h2>
        </div>

        <div className="flex bg-background/50 backdrop-blur-md rounded-lg p-1 border border-border/50 shadow-inner">
          <Button 
            variant={view === 'month' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => changeView('month')}
            className="h-8 text-xs"
          >
            Ay
          </Button>
          <Button 
            variant={view === 'week' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => changeView('week')}
            className="h-8 text-xs"
          >
            Hafta
          </Button>
          <Button 
            variant={view === 'day' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => changeView('day')}
            className="h-8 text-xs"
          >
            Gün
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 p-4 bg-background/30 relative min-h-[600px]">
        <div ref={containerRef} style={{ height: '600px' }} />
      </div>
    </Card>
  );
}
