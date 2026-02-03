import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  
  const userRole = (session.user as any).role;
  const currentId = (session.user as any).id;
  
  let whereClause: any = {};

  if (userRole === 'personnel') {
      // Personnel sees only their own shifts
      whereClause.employeeId = currentId;
  } else {
      // Admin sees all shifts for their company
      whereClause.userId = currentId;
  }

  if (startDate && endDate) {
    whereClause.start = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  try {
    const shifts = await prisma.shift.findMany({
      where: whereClause,
      include: {
        employee: {
            select: { name: true, position: true, id: true }
        }
      },
      orderBy: { start: 'asc' }
    });
    return NextResponse.json(shifts);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return NextResponse.json({ error: "Error fetching shifts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const userRole = (session.user as any).role;
  if (userRole !== 'admin' && userRole !== 'user') { // 'user' is admin role in this system based on User model default
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { employeeId, date, startTime, endTime, name } = body;
    
    if (!employeeId || !date || !startTime || !endTime) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user owns the employee
    const currentId = (session.user as any).id;
    const employee = await prisma.employee.findFirst({
        where: { id: employeeId, userId: currentId }
    });
    
    if (!employee) {
        return NextResponse.json({ error: "Employee not found or unauthorized" }, { status: 404 });
    }

    // Convert to DateTime
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    const startDateTime = new Date(date);
    startDateTime.setHours(startH, startM, 0, 0);
    
    const endDateTime = new Date(date);
    endDateTime.setHours(endH, endM, 0, 0);
    
    // Handle overnight
    if (endDateTime < startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
    }
    
    // Map shift name to type
    let type = 'full';
    const shiftName = name || 'Mesai';
    if (shiftName === 'Gündüz') type = 'morning';
    else if (shiftName === 'Akşam') type = 'evening';
    else if (shiftName === 'Gece') type = 'night';

    const shift = await prisma.shift.create({
      data: {
        employeeId,
        userId: currentId,
        start: startDateTime,
        end: endDateTime,
        title: shiftName,
        type: type
      }
    });

    return NextResponse.json(shift);
  } catch (error) {
     console.error("Error creating shift:", error);
     return NextResponse.json({ error: "Error creating shift" }, { status: 500 });
  }
}
