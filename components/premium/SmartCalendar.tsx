"use client";

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import trLocale from '@fullcalendar/core/locales/tr';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: any;
}

interface SmartCalendarProps {
  events: Event[];
  onEventClick?: (event: any) => void;
  onDateClick?: (date: any) => void;
  onSelect?: (selection: any) => void;
  onDatesSet?: (dateInfo: any) => void;
  className?: string;
  eventContent?: (arg: any) => React.ReactNode;
  editable?: boolean;
}

export function SmartCalendar({ 
  events, 
  onEventClick, 
  onDateClick, 
  onSelect,
  onDatesSet,
  className,
  eventContent,
  editable = false
}: SmartCalendarProps) {
  const { theme } = useTheme();
  const calendarRef = React.useRef<FullCalendar>(null);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [title, setTitle] = useState('');

  // Handle dark mode for FullCalendar
  // FullCalendar doesn't support Tailwind classes directly in all places, so we use custom CSS variables or global styles
  // But we can wrap it in a container that defines CSS variables.

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setTitle(calendarApi.view.title);
    }
  }, []);

  const handlePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setTitle(calendarApi.view.title);
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setTitle(calendarApi.view.title);
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setTitle(calendarApi.view.title);
    }
  };

  const changeView = (view: string) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
      setCurrentView(view);
      setTitle(calendarApi.view.title);
    }
  };

  return (
    <Card className={cn("glass-card border-0 shadow-2xl overflow-hidden", className)}>
      <CardHeader className="flex flex-col md:flex-row items-center justify-between pb-4 border-b border-border/10 space-y-4 md:space-y-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-secondary/50 rounded-xl p-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePrev}
              className="h-8 w-8 hover:bg-background/50 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleToday}
              className="px-3 h-8 text-xs font-medium hover:bg-background/50 rounded-lg"
            >
              Bugün
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNext}
              className="h-8 w-8 hover:bg-background/50 rounded-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {title}
          </CardTitle>
        </div>

        <div className="flex items-center bg-secondary/50 rounded-xl p-1">
          <Button 
            variant={currentView === 'dayGridMonth' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => changeView('dayGridMonth')}
            className={cn(
              "h-8 text-xs gap-2 rounded-lg transition-all", 
              currentView === 'dayGridMonth' ? "bg-background shadow-sm" : "hover:bg-background/50"
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ay</span>
          </Button>
          <Button 
            variant={currentView === 'timeGridWeek' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => changeView('timeGridWeek')}
            className={cn(
              "h-8 text-xs gap-2 rounded-lg transition-all", 
              currentView === 'timeGridWeek' ? "bg-background shadow-sm" : "hover:bg-background/50"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hafta</span>
          </Button>
          <Button 
            variant={currentView === 'timeGridDay' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => changeView('timeGridDay')}
            className={cn(
              "h-8 text-xs gap-2 rounded-lg transition-all", 
              currentView === 'timeGridDay' ? "bg-background shadow-sm" : "hover:bg-background/50"
            )}
          >
            <List className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Gün</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <style jsx global>{`
          .fc {
            font-family: inherit;
            --fc-border-color: rgba(128, 128, 128, 0.1);
            --fc-page-bg-color: transparent;
            --fc-neutral-bg-color: rgba(128, 128, 128, 0.05);
            --fc-today-bg-color: rgba(var(--primary), 0.05);
            --fc-list-event-hover-bg-color: rgba(var(--primary), 0.1);
          }
          
          .fc-theme-standard td, .fc-theme-standard th {
            border-color: var(--fc-border-color);
          }

          .fc-col-header-cell {
            padding: 12px 0;
            background-color: rgba(128, 128, 128, 0.02);
          }

          .fc-col-header-cell-cushion {
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
            color: var(--muted-foreground);
          }

          .fc-daygrid-day-number {
            font-size: 0.875rem;
            font-weight: 500;
            padding: 8px;
            color: var(--foreground);
            opacity: 0.7;
          }

          .fc-daygrid-day.fc-day-today {
            background-color: var(--fc-today-bg-color) !important;
          }

          .fc-daygrid-day:hover {
            background-color: var(--fc-neutral-bg-color);
          }

          .fc-event {
            border: none;
            border-radius: 6px;
            padding: 2px 4px;
            font-size: 0.75rem;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
          }

          .fc-event:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 5;
          }

          .fc-daygrid-event-dot {
            border-width: 4px;
          }

          /* Remove default header since we use custom one */
          .fc-header-toolbar {
            display: none !important;
          }

          .fc-timegrid-slot {
            height: 3rem;
          }

          .fc-timegrid-slot-label {
            font-size: 0.75rem;
            color: var(--muted-foreground);
          }
        `}</style>
        
        <div className="p-6 h-[700px]">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            locale={trLocale}
            headerToolbar={false} // Custom toolbar used
            editable={editable}
            selectable={!!onSelect}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            eventClick={onEventClick}
            dateClick={onDateClick}
            select={onSelect}
            datesSet={onDatesSet}
            eventContent={eventContent}
            height="100%"
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={true}
            nowIndicator={true}
            expandRows={true}
            handleWindowResize={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}
