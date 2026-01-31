import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { subDays, format, startOfDay, endOfDay } from "date-fns";
import { tr } from "date-fns/locale";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  
  try {
    // 1. Weekly Overtime Chart (Last 7 Days)
    // Query Shifts or Attendance with high hours
    // Since 'Shift' is used for scheduling, we'll assume it tracks planned shifts.
    // For "Overtime", we ideally need 'Attendance' hours > 9.
    
    const overtimeData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayName = format(date, 'EEE', { locale: tr });
      
      // Fetch shifts for this day
      const shifts = await prisma.shift.findMany({
        where: {
          userId,
          date: {
            gte: startOfDay(date),
            lte: endOfDay(date)
          }
        }
      });

      // Calculate total hours from shifts
      let totalHours = 0;
      shifts.forEach(shift => {
        // Parse "HH:mm" strings
        const [startH, startM] = shift.startTime.split(':').map(Number);
        const [endH, endM] = shift.endTime.split(':').map(Number);
        
        let duration = (endH + endM/60) - (startH + startM/60);
        if (duration < 0) duration += 24; // Cross midnight
        
        totalHours += duration;
      });

      // If no shifts, check attendance for overtime
      if (shifts.length === 0) {
         const attendances = await prisma.attendance.findMany({
             where: {
                 userId,
                 date: { gte: startOfDay(date), lte: endOfDay(date) }
             }
         });
         
         attendances.forEach(att => {
             if (att.hours && att.hours > 9) {
                 totalHours += (att.hours - 9); // Only count overtime part
             }
         });
      }

      overtimeData.push({
        name: dayName,
        hours: Number(totalHours.toFixed(1))
      });
    }

    // 2. Pending Requests
    // Since we don't have a 'Request' model, we'll fetch recent 'Leaves' with status 'pending'
    // or simulate empty if purely strictly 'Shift' requests
    const pendingRequests = await prisma.leave.findMany({
        where: { userId, status: 'pending' },
        take: 5,
        include: { employee: true },
        orderBy: { createdAt: 'desc' }
    });

    // 3. Recent Activity
    // Fetch recent Shifts created
    const recentShifts = await prisma.shift.findMany({
        where: { userId },
        take: 5,
        include: { employee: true },
        orderBy: { date: 'desc' }
    });

    const recentActivity = recentShifts.map(shift => ({
        id: shift.id,
        name: shift.employee.name,
        type: 'approved', // Shifts are auto-approved on creation in this system
        hours: 8, // Approx
        date: format(shift.date, 'dd MMM', { locale: tr }),
        approver: 'Admin'
    }));

    return NextResponse.json({
      overtimeData,
      pendingRequests: pendingRequests.map(req => ({
          id: req.id,
          name: req.employee.name,
          reason: req.reason || req.type,
          date: format(req.startDate, 'dd MMM', { locale: tr }),
          hours: req.days * 9, // Convert days to hours for display consistency
          status: req.status
      })),
      recentActivity
    });

  } catch (error) {
    console.error("Overtime Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
