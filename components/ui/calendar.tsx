"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 glass-card rounded-2xl border border-white/10 shadow-2xl bg-[#030712]/90 backdrop-blur-xl", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-between pt-1 relative items-center mb-4 px-2",
        caption_label: "text-lg font-bold text-white tracking-tight",
        nav: "space-x-1 flex items-center bg-white/5 rounded-full p-1 border border-white/10",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-transparent p-0 text-slate-400 hover:text-white hover:bg-white/10 transition-all rounded-full"
        ),
        nav_button_previous: "absolute right-12",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex mb-2 justify-between",
        head_cell:
          "text-slate-500 rounded-xl w-10 font-medium text-[0.8rem] uppercase tracking-wider flex items-center justify-center font-mono",
        row: "flex w-full mt-2 justify-between",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-xl [&:has([aria-selected].day-outside)]:bg-indigo-500/10 [&:has([aria-selected])]:bg-indigo-500/20 first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-xl transition-all hover:scale-110 hover:shadow-lg hover:bg-indigo-500/20 hover:text-indigo-400 text-slate-300 tabular-nums"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-700 focus:text-white shadow-lg shadow-indigo-500/25 font-bold scale-110 border border-indigo-400/20",
        day_today: "bg-white/5 text-white font-bold border border-white/10",
        day_outside:
          "day-outside text-slate-700 opacity-50 aria-selected:bg-indigo-500/10 aria-selected:text-slate-500 aria-selected:opacity-30",
        day_disabled: "text-slate-800 opacity-50",
        day_range_middle:
          "aria-selected:bg-indigo-500/10 aria-selected:text-indigo-300",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
