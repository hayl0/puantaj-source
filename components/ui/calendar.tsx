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
      className={cn(
        "p-6 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-[2rem]", 
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-6 sm:space-y-0",
        month: "space-y-6 w-full",
        caption: "flex justify-center pt-2 relative items-center mb-8",
        caption_label: "text-2xl font-bold text-foreground tracking-tight font-heading",
        nav: "space-x-1 flex items-center absolute inset-x-0 justify-between px-2",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 bg-transparent p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all rounded-full hover:scale-110"
        ),
        nav_button_previous: "z-10",
        nav_button_next: "z-10",
        table: "w-full border-collapse space-y-1",
        head_row: "flex mb-4 justify-between",
        head_cell:
          "text-muted-foreground/60 rounded-xl w-11 font-bold text-[0.8rem] uppercase tracking-widest flex items-center justify-center font-sans",
        row: "flex w-full mt-2 justify-between",
        cell: "h-11 w-11 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-2xl [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-2xl last:[&:has([aria-selected])]:rounded-r-2xl focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-11 w-11 p-0 font-medium aria-selected:opacity-100 rounded-2xl transition-all hover:scale-110 hover:shadow-lg hover:bg-accent hover:text-accent-foreground text-foreground/80 tabular-nums border border-transparent hover:border-border/50"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gradient-to-br from-violet-600 to-indigo-600 text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white shadow-xl shadow-indigo-500/40 font-bold scale-110 border-none ring-0",
        day_today: "bg-accent/30 text-foreground font-bold border border-primary/20 shadow-sm",
        day_outside:
          "day-outside text-muted-foreground/30 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
