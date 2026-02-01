"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import styles from './ModernCalendar.module.css';

export interface CalendarEvent {
    date: string; // YYYY-M-D
    title: string;
    color?: string;
}

interface ModernCalendarProps {
    events?: CalendarEvent[];
}

export function ModernCalendar({ events = [] }: ModernCalendarProps) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null); // Null initial to avoid hydration mismatch
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
        // Format key as YYYY-M-D to match original script logic
        const dateKey = `${year}-${month + 1}-${day}`;
        
        setSelectedDate(dateKey);
        setNoteInput(notes[dateKey] || '');
        setIsNotesOpen(true);
    };

    if (!currentTime) return null; // Prevent hydration mismatch

    const year = currentTime.getFullYear();
    const month = currentTime.getMonth();
    const today = new Date();

    // Calendar Calculations
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return (
        <div className={styles.calendarContainer}>
            <div className={styles.calendarContent}>
                <div className={styles.calendarHeader}>
                    <div className={styles.headerLeft}>
                        <h1>{currentTime.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</h1>
                        <p>{currentTime.toLocaleDateString('tr-TR', { weekday: 'long' })}</p>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.timeDisplay}>
                            {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>

                <div className={styles.calendarGrid}>
                    <div className={styles.dayLabels}>
                        <div>Paz</div>
                        <div>Pzt</div>
                        <div>Sal</div>
                        <div>Çar</div>
                        <div>Per</div>
                        <div>Cum</div>
                        <div>Cmt</div>
                    </div>
                    <div className={styles.daysContainer}>
                        {/* Empty slots for days before start of month */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className={styles.emptyDay} />
                        ))}
                        
                        {/* Days of the month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateKey = `${year}-${month + 1}-${day}`;
                            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                            const isSelected = selectedDate === dateKey;
                            const hasNote = !!notes[dateKey];
                            const dayEvents = events.filter(e => e.date === dateKey);
                            const hasEvents = dayEvents.length > 0;

                            return (
                                <div 
                                    key={day} 
                                    className={cn(
                                        styles.calendarDay,
                                        isToday && styles.today,
                                        isSelected && styles.selected,
                                        hasNote && styles.hasNote,
                                        hasEvents && styles.hasEvents
                                    )}
                                    onClick={() => handleDateClick(day)}
                                >
                                    {day}
                                    {hasEvents && (
                                        <div className={styles.eventDots}>
                                            {dayEvents.slice(0, 3).map((ev, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className={styles.eventDot} 
                                                    style={{ backgroundColor: ev.color || 'var(--accent-color)' }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className={styles.notesPanel}>
                    <button 
                        className={styles.notesToggle}
                        onClick={() => setIsNotesOpen(!isNotesOpen)}
                    >
                        {isNotesOpen ? 'Notları Gizle' : 'Notlar'}
                    </button>
                    
                    {isNotesOpen && (
                        <div className={styles.notesContent}>
                            <h3>{selectedDate ? `${selectedDate} Notları` : 'Tarih Seçin'}</h3>
                            
                            {selectedDate && (
                                <div className={styles.noteInputGroup}>
                                    <textarea
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                        placeholder="Not ekle..."
                                        rows={3}
                                    />
                                    <button onClick={handleSaveNote}>Kaydet</button>
                                </div>
                            )}

                            <ul className={styles.notesList}>
                                {selectedDate && (
                                    <>
                                        {events.filter(e => e.date === selectedDate).map((ev, idx) => (
                                            <li key={`ev-${idx}`} className={styles.noteItem} style={{ borderLeft: `4px solid ${ev.color || 'var(--accent-color)'}` }}>
                                                <span>{ev.title}</span>
                                            </li>
                                        ))}
                                        {notes[selectedDate] && (
                                            <li className={styles.noteItem}>
                                                <span>{notes[selectedDate]}</span>
                                                <button 
                                                    className={styles.deleteNoteBtn}
                                                    onClick={() => handleDeleteNote(selectedDate)}
                                                >
                                                    ×
                                                </button>
                                            </li>
                                        )}
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
