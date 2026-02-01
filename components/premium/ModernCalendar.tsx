"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Trash2, Save, X, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

export interface CalendarEvent {
    date: string; // YYYY-M-D
    title: string;
    color?: string;
}

interface ModernCalendarProps {
    events?: CalendarEvent[];
}

export function ModernCalendar({ events = [] }: ModernCalendarProps) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [noteInput, setNoteInput] = useState('');

    // Hydration fix and Clock Interval
    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Load Notes from LocalStorage
    useEffect(() => {
        const savedNotes = localStorage.getItem('calendarNotes');
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
    }, []);

    // Save Note Handler
    const handleSaveNote = () => {
        if (selectedDate && noteInput.trim()) {
            const updatedNotes = { ...notes, [selectedDate]: noteInput };
            setNotes(updatedNotes);
            localStorage.setItem('calendarNotes', JSON.stringify(updatedNotes));
            setNoteInput('');
        }
    };

    // Delete Note Handler
    const handleDeleteNote = (dateKey: string) => {
        const updatedNotes = { ...notes };
        delete updatedNotes[dateKey];
        setNotes(updatedNotes);
        localStorage.setItem('calendarNotes', JSON.stringify(updatedNotes));
        if (selectedDate === dateKey) {
            setNoteInput('');
        }
    };

    // Date Selection
    const handleDateClick = (day: number) => {
        if (!currentTime) return;
        const year = currentTime.getFullYear();
        const month = currentTime.getMonth();
        const dateKey = `${year}-${month + 1}-${day}`;
        
        setSelectedDate(dateKey);
        setNoteInput(notes[dateKey] || '');
        setIsNotesOpen(true);
    };

    if (!currentTime) return null;

    const year = currentTime.getFullYear();
    const month = currentTime.getMonth();
    const today = new Date();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return (
        <div className="flex flex-col h-full bg-background/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex-1 flex flex-col md:flex-row">
                <div className={`flex-1 flex flex-col p-4 md:p-6 transition-all duration-300 ${isNotesOpen ? 'md:w-2/3' : 'w-full'}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 md:mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent capitalize">
                                {currentTime.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                            </h1>
                            <p className="text-sm md:text-base text-muted-foreground capitalize font-medium">
                                {currentTime.toLocaleDateString('tr-TR', { weekday: 'long' })}
                            </p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="text-4xl font-mono font-bold text-foreground/80 tracking-tighter">
                                {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-7 mb-2 md:mb-4">
                            {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map(day => (
                                <div key={day} className="text-center text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wider py-1 md:py-2">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 md:gap-2 h-full content-start md:content-normal">
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="p-1 md:p-2" />
                            ))}
                            
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateKey = `${year}-${month + 1}-${day}`;
                                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                const isSelected = selectedDate === dateKey;
                                const hasNote = !!notes[dateKey];
                                const dayEvents = events.filter(e => e.date === dateKey);
                                const hasEvents = dayEvents.length > 0;

                                return (
                                    <button 
                                        key={day} 
                                        onClick={() => handleDateClick(day)}
                                        className={cn(
                                            "relative aspect-square rounded-xl md:rounded-2xl flex flex-col items-center justify-center text-sm md:text-lg font-medium transition-all duration-200 border border-transparent group",
                                            isToday ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105 font-bold" : 
                                            isSelected ? "bg-secondary text-foreground ring-2 ring-primary/50" :
                                            "hover:bg-secondary/50 hover:border-white/10 text-foreground/80"
                                        )}
                                    >
                                        <span className={cn("relative z-10", isToday && "text-white")}>{day}</span>
                                        
                                        {/* Indicators */}
                                        <div className="absolute bottom-1 md:bottom-2 flex gap-0.5 md:gap-1 items-center justify-center">
                                            {hasNote && (
                                                <div className={cn("w-1 h-1 md:w-1.5 md:h-1.5 rounded-full", isToday ? "bg-white" : "bg-orange-500")} />
                                            )}
                                            {dayEvents.slice(0, 3).map((ev, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
                                                    style={{ backgroundColor: ev.color || (isToday ? 'white' : '#3b82f6') }}
                                                />
                                            ))}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                
                {/* Professional Notes Panel */}
                <div className={cn(
                    "border-l border-white/10 bg-background/30 backdrop-blur-md transition-all duration-500 ease-in-out flex flex-col",
                    isNotesOpen ? "md:w-96 w-full opacity-100" : "w-0 opacity-0 overflow-hidden"
                )}>
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                {selectedDate ? (
                                    <span>
                                        {new Date(selectedDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                                        <span className="text-muted-foreground font-normal ml-2 text-sm">Notları</span>
                                    </span>
                                ) : 'Notlar'}
                            </h3>
                            <button 
                                onClick={() => setIsNotesOpen(false)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                        
                        {selectedDate ? (
                            <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
                                {/* Note Input Area */}
                                <div className="space-y-3">
                                    <textarea
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                        placeholder="Buraya bir not ekleyin..."
                                        className="w-full min-h-[120px] p-4 rounded-xl bg-secondary/50 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none outline-none transition-all placeholder:text-muted-foreground/50 text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleSaveNote}
                                            disabled={!noteInput.trim()}
                                            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Kaydet
                                        </button>
                                        {notes[selectedDate] && (
                                            <button 
                                                onClick={() => handleDeleteNote(selectedDate)}
                                                className="py-2.5 px-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-medium transition-colors flex items-center justify-center"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Month Overview */}
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Bu Ayın Notları</h4>
                                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {Object.entries(notes)
                                            .filter(([key]) => {
                                                const noteDate = new Date(key);
                                                return noteDate.getMonth() === month && noteDate.getFullYear() === year;
                                            })
                                            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
                                            .map(([key, note]) => (
                                                <div 
                                                    key={key}
                                                    onClick={() => handleDateClick(new Date(key).getDate())}
                                                    className={cn(
                                                        "p-3 rounded-xl border border-white/5 cursor-pointer transition-all hover:bg-white/5 group",
                                                        selectedDate === key ? "bg-primary/10 border-primary/20" : "bg-secondary/30"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className={cn(
                                                            "text-xs font-medium",
                                                            selectedDate === key ? "text-primary" : "text-muted-foreground"
                                                        )}>
                                                            {new Date(key).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                                                        </span>
                                                        <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <p className="text-sm text-foreground/80 line-clamp-2">{note}</p>
                                                </div>
                                            ))}
                                        {Object.entries(notes).filter(([key]) => {
                                            const noteDate = new Date(key);
                                            return noteDate.getMonth() === month && noteDate.getFullYear() === year;
                                        }).length === 0 && (
                                            <p className="text-xs text-muted-foreground text-center py-4">Bu ay için henüz not bulunmuyor.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 opacity-50" />
                                </div>
                                <p className="font-medium mb-1">Bir Tarih Seçin</p>
                                <p className="text-sm opacity-60">Not eklemek veya görüntülemek için takvimden bir gün seçin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Mobile Toggle Bar */}
            {!isNotesOpen && (
                 <button 
                    onClick={() => setIsNotesOpen(true)}
                    className="md:hidden w-full py-3 bg-secondary/50 border-t border-white/10 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Notları Göster
                </button>
            )}
        </div>
    );
}
