import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { addDays, format, parseISO } from "date-fns";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can distribute shifts
    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { startDate, endDate } = await req.json();

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 });
    }

    // Fetch all employees
    const employees = await prisma.employee.findMany({
        where: { userId: (session.user as any).id } // Only current admin's employees
    });

    if (employees.length === 0) {
      return NextResponse.json({ error: "No employees found" }, { status: 404 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Shift definitions
    const SHIFTS = [
      { name: "Gündüz", start: "08:00", end: "16:00" },
      { name: "Akşam", start: "16:00", end: "24:00" },
      { name: "Gece", start: "00:00", end: "08:00" }
    ];

    const createdShifts = [];

    // Clear existing shifts for this period (Optional: user might want to keep manual ones, but for "Auto Distribute" usually we clear)
    // For safety, let's NOT clear automatically but just skip if conflict? 
    // Or better: The user expects "Fill empty slots". 
    // Let's implement: Random distribution ensuring coverage.

    // Simple Algorithm:
    // Iterate each day
    // Assign 1 person to each shift type
    // Rotate employees
    
    let empIndex = 0;

    for (let i = 0; i < daysDiff; i++) {
      const currentDate = addDays(start, i);
      
      for (const shiftType of SHIFTS) {
        // Pick an employee (Round Robin)
        const employee = employees[empIndex % employees.length];
        empIndex++;

        // Check if shift already exists for this employee on this day (Basic check)
        const existing = await prisma.shift.findFirst({
            where: {
                employeeId: employee.id,
                date: currentDate,
            }
        });

        if (!existing) {
             const newShift = await prisma.shift.create({
                data: {
                    name: shiftType.name,
                    startTime: shiftType.start,
                    endTime: shiftType.end,
                    date: currentDate,
                    employeeId: employee.id,
                    userId: (session.user as any).id
                }
            });
            createdShifts.push(newShift);
        }
      }
    }

    return NextResponse.json({ 
        success: true, 
        count: createdShifts.length, 
        message: `${createdShifts.length} vardiya otomatik oluşturuldu.` 
    });

  } catch (error) {
    console.error("AI Distribution Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
