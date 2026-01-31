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
    whereClause.date = {
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
      orderBy: { date: 'asc' }
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

    const shift = await prisma.shift.create({
      data: {
        employeeId,
        userId: currentId,
        date: new Date(date),
        startTime,
        endTime,
        name: name || 'Mesai'
      }
    });

    return NextResponse.json(shift);
  } catch (error) {
     console.error("Error creating shift:", error);
     return NextResponse.json({ error: "Error creating shift" }, { status: 500 });
  }
}
