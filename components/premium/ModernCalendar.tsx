"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Trash2, Save, X, FileText, ChevronRight, ChevronLeft, CheckSquare, Calendar as CalendarIcon, Plus, Check } from 'lucide-react';
import { 
    format, 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    eachDayOfInterval, 
    isSameMonth, 
    isSameDay, 
    parseISO, 
    isValid,
    startOfDay
} from 'date-fns';
import { tr } from 'date-fns/locale';

export interface CalendarEvent {
    date: string; // YYYY-M-D or ISO String
    title: string;
    color?: string;
    description?: string;
}

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

interface ModernCalendarProps {
    events?: CalendarEvent[];
}

export function ModernCalendar({ events = [] }: ModernCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    // Data states
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [todos, setTodos] = useState<Record<string, TodoItem[]>>({});
    
    // UI states
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [noteInput, setNoteInput] = useState('');
    const [todoInput, setTodoInput] = useState('');
    const [activeTab, setActiveTab] = useState<'notes' | 'tasks' | 'schedule'>('schedule');
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    // Hydration fix and Clock
    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Load Data from LocalStorage
    useEffect(() => {
        const savedNotes = localStorage.getItem('calendarNotes');
        if (savedNotes) setNotes(JSON.parse(savedNotes));
        
        const savedTodos = localStorage.getItem('calendarTodos');
        if (savedTodos) setTodos(JSON.parse(savedTodos));
    }, []);

    // Helpers
    const getStorageKey = (date: Date) => format(date, 'yyyy-MM-dd');

    const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
    const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

    // Date Selection
    const handleDateClick = (day: Date) => {
        setSelectedDate(day);
        const dateKey = getStorageKey(day);
        
        setNoteInput(notes[dateKey] || '');
        setIsNotesOpen(true);
        
        // Check for events on this day
        const hasEvents = events.some(e => {
            const eventDate = new Date(e.date);
            return isValid(eventDate) && isSameDay(eventDate, day);
        });
        
        setActiveTab(hasEvents ? 'schedule' : 'tasks');
    };

    // Save Note Handler
    const handleSaveNote = () => {
        if (selectedDate) {
            const dateKey = getStorageKey(selectedDate);
            const updatedNotes = { ...notes, [dateKey]: noteInput };
            setNotes(updatedNotes);
            localStorage.setItem('calendarNotes', JSON.stringify(updatedNotes));
        }
    };

    // Delete Note Handler
    const handleDeleteNote = () => {
        if (selectedDate) {
            const dateKey = getStorageKey(selectedDate);
            const updatedNotes = { ...notes };
            delete updatedNotes[dateKey];
            setNotes(updatedNotes);
            localStorage.setItem('calendarNotes', JSON.stringify(updatedNotes));
            setNoteInput('');
        }
    };

    // Todo Handlers
    const handleAddTodo = () => {
        if (selectedDate && todoInput.trim()) {
            const dateKey = getStorageKey(selectedDate);
            const newTodo: TodoItem = {
                id: Math.random().toString(36).substr(2, 9),
                text: todoInput,
                completed: false
            };
            const currentTodos = todos[dateKey] || [];
            const updatedTodos = { ...todos, [dateKey]: [...currentTodos, newTodo] };
            setTodos(updatedTodos);
            localStorage.setItem('calendarTodos', JSON.stringify(updatedTodos));
            setTodoInput('');
        }
    };

    const toggleTodo = (todoId: string) => {
        if (!selectedDate) return;
        const dateKey = getStorageKey(selectedDate);
        const currentTodos = todos[dateKey] || [];
        const updatedTodos = {
            ...todos,
            [dateKey]: currentTodos.map(t => 
                t.id === todoId ? { ...t, completed: !t.completed } : t
            )
        };
        setTodos(updatedTodos);
        localStorage.setItem('calendarTodos', JSON.stringify(updatedTodos));
    };

    const deleteTodo = (todoId: string) => {
        if (!selectedDate) return;
        const dateKey = getStorageKey(selectedDate);
        const currentTodos = todos[dateKey] || [];
        const updatedTodos = {
            ...todos,
            [dateKey]: currentTodos.filter(t => t.id !== todoId)
        };
        setTodos(updatedTodos);
        localStorage.setItem('calendarTodos', JSON.stringify(updatedTodos));
    };

    if (!currentTime) return null;

    // Calendar Generation
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calculate empty days for start of month padding
    const startDay = monthStart.getDay(); // 0 is Sunday
    // Turkey starts on Monday (1). If 0 (Sunday), we need 6 empty slots. If 1 (Monday), 0 empty slots.
    const emptyDays = startDay === 0 ? 6 : startDay - 1;

    // Derived Data for Selected Date
    const selectedDateKey = selectedDate ? getStorageKey(selectedDate) : null;
    const selectedDayEvents = selectedDate ? events.filter(e => {
        const eventDate = new Date(e.date);
        return isValid(eventDate) && isSameDay(eventDate, selectedDate);
    }) : [];
    const selectedDayTodos = selectedDateKey ? (todos[selectedDateKey] || []) : [];

    return (
        <div className="flex flex-col h-full bg-background/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
                <div className={cn(
                    "flex flex-col transition-all duration-300 overflow-y-auto",
                    isNotesOpen ? "h-0 md:h-full md:flex-1 md:w-2/3 p-0 md:p-6 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto" : "flex-1 w-full p-4 md:p-6 opacity-100"
                )}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 md:mb-8 shrink-0">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent capitalize">
                                    {format(currentMonth, 'MMMM yyyy', { locale: tr })}
                                </h1>
                                <p className="text-sm md:text-base text-muted-foreground capitalize font-medium">
                                    {format(currentTime, 'EEEE', { locale: tr })}
                                </p>
                            </div>
                            <div className="flex items-center bg-secondary/50 rounded-lg p-1 border border-white/5">
                                <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-md transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1 text-sm font-medium hover:bg-white/10 rounded-md transition-colors">
                                    Bugün
                                </button>
                                <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-md transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="text-4xl font-mono font-bold text-foreground/80 tracking-tighter">
                                {format(currentTime, 'HH:mm')}
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex-1 flex flex-col">
                        <div className="grid grid-cols-7 mb-2 md:mb-4 shrink-0">
                            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                                <div key={day} className="text-center text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wider py-1 md:py-2">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 md:gap-2 flex-1 auto-rows-fr">
                            {Array.from({ length: emptyDays }).map((_, i) => (
                                <div key={`empty-${i}`} className="p-1 md:p-2" />
                            ))}
                            
                            {calendarDays.map((day, i) => {
                                const isToday = isSameDay(day, new Date());
                                const isSelected = selectedDate && isSameDay(day, selectedDate);
                                const dateKey = getStorageKey(day);
                                const hasNote = !!notes[dateKey];
                                const hasTodos = (todos[dateKey] || []).length > 0;
                                const dayEvents = events.filter(e => {
                                    const eventDate = new Date(e.date);
                                    return isValid(eventDate) && isSameDay(eventDate, day);
                                });

                                return (
                                    <button 
                                        key={i} 
                                        onClick={() => handleDateClick(day)}
                                        className={cn(
                                            "relative w-full h-full min-h-[60px] md:min-h-[80px] rounded-xl md:rounded-2xl flex flex-col items-center justify-start pt-2 md:pt-3 text-sm md:text-lg font-medium transition-all duration-200 border border-transparent group",
                                            isToday ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105 font-bold z-10" : 
                                            isSelected ? "bg-secondary text-foreground ring-2 ring-primary/50 z-0" :
                                            "hover:bg-secondary/50 hover:border-white/10 text-foreground/80",
                                            !isSameMonth(day, currentMonth) && "opacity-50"
                                        )}
                                    >
                                        <span className={cn("relative z-10", isToday && "text-white")}>
                                            {format(day, 'd')}
                                        </span>
                                        
                                        {/* Indicators */}
                                        <div className="flex gap-1 mt-1 md:mt-2 flex-wrap justify-center px-1">
                                            {hasNote && (
                                                <div className={cn("w-1 h-1 md:w-1.5 md:h-1.5 rounded-full", isToday ? "bg-white" : "bg-orange-500")} />
                                            )}
                                            {hasTodos && (
                                                <div className={cn("w-1 h-1 md:w-1.5 md:h-1.5 rounded-full", isToday ? "bg-white" : "bg-purple-500")} />
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
                
                {/* Modern Planner Panel */}
                <div className={cn(
                    "border-l border-white/10 bg-background/30 backdrop-blur-md transition-all duration-500 ease-in-out flex flex-col",
                    isNotesOpen ? "h-full md:w-[400px] w-full opacity-100" : "h-0 md:h-full w-0 opacity-0 overflow-hidden"
                )}>
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                {selectedDate ? (
                                    <span>
                                        {format(selectedDate, 'd MMMM', { locale: tr })}
                                    </span>
                                ) : 'Planlayıcı'}
                            </h3>
                            <button 
                                onClick={() => setIsNotesOpen(false)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                        
                        {selectedDate ? (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Tabs */}
                                <div className="flex p-1 bg-secondary/30 rounded-xl mb-4 shrink-0">
                                    <button 
                                        onClick={() => setActiveTab('schedule')}
                                        className={cn(
                                            "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                                            activeTab === 'schedule' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="w-4 h-4" />
                                        Program
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tasks')}
                                        className={cn(
                                            "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                                            activeTab === 'tasks' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <CheckSquare className="w-4 h-4" />
                                        Görevler
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('notes')}
                                        className={cn(
                                            "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                                            activeTab === 'notes' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <FileText className="w-4 h-4" />
                                        Notlar
                                    </button>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    {activeTab === 'schedule' && (
                                        <div className="space-y-3">
                                            {selectedDayEvents.length > 0 ? (
                                                selectedDayEvents.map((event, i) => (
                                                    <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color || '#3b82f6' }} />
                                                            <h4 className="font-semibold">{event.title}</h4>
                                                        </div>
                                                        {event.description && (
                                                            <p className="text-sm text-muted-foreground pl-5">{event.description}</p>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                    <p>Bu tarih için planlanmış etkinlik yok.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'tasks' && (
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={todoInput}
                                                    onChange={(e) => setTodoInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                                                    placeholder="Yeni görev ekle..."
                                                    className="flex-1 px-4 py-2 rounded-xl bg-secondary/50 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none text-sm"
                                                />
                                                <button 
                                                    onClick={handleAddTodo}
                                                    disabled={!todoInput.trim()}
                                                    className="p-2 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                {selectedDayTodos.map(todo => (
                                                    <div key={todo.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                                        <button 
                                                            onClick={() => toggleTodo(todo.id)}
                                                            className={cn(
                                                                "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                                todo.completed ? "bg-green-500 border-green-500" : "border-muted-foreground hover:border-primary"
                                                            )}
                                                        >
                                                            {todo.completed && <Check className="w-3 h-3 text-white" />}
                                                        </button>
                                                        <span className={cn(
                                                            "flex-1 text-sm transition-all",
                                                            todo.completed ? "text-muted-foreground line-through" : "text-foreground"
                                                        )}>
                                                            {todo.text}
                                                        </span>
                                                        <button 
                                                            onClick={() => deleteTodo(todo.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {selectedDayTodos.length === 0 && (
                                                    <div className="text-center py-8 text-muted-foreground">
                                                        <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                        <p>Henüz görev eklenmemiş.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'notes' && (
                                        <div className="space-y-3 h-full flex flex-col">
                                            <textarea
                                                value={noteInput}
                                                onChange={(e) => setNoteInput(e.target.value)}
                                                placeholder="Buraya notlarınızı yazın..."
                                                className="flex-1 w-full p-4 rounded-xl bg-secondary/50 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none outline-none transition-all placeholder:text-muted-foreground/50 text-sm"
                                            />
                                            <div className="flex gap-2 shrink-0">
                                                <button 
                                                    onClick={handleSaveNote}
                                                    disabled={!noteInput.trim()}
                                                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4 mr-2 inline" />
                                                    Kaydet
                                                </button>
                                                {selectedDate && notes[getStorageKey(selectedDate)] && (
                                                    <button 
                                                        onClick={handleDeleteNote}
                                                        className="py-2.5 px-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-medium transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 opacity-50" />
                                </div>
                                <p className="font-medium mb-1">Bir Tarih Seçin</p>
                                <p className="text-sm opacity-60">Planlama yapmak için takvimden bir gün seçin.</p>
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
                    Planlayıcıyı Göster
                </button>
            )}
        </div>
    );
}
