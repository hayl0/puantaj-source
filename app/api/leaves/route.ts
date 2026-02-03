import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  const userId = session.user.id;

  try {
    let leaves;

    if (userRole === 'personnel') {
      // Fetch leaves for this employee
      leaves = await prisma.leave.findMany({
        where: {
          employeeId: userId,
        },
        include: {
          employee: {
            select: { name: true, email: true }
          }
        },
        orderBy: { startDate: 'desc' }
      });
    } else {
      // Admin/User: Fetch all leaves for their employees
      leaves = await prisma.leave.findMany({
        where: {
          userId: userId,
        },
        include: {
          employee: {
            select: { name: true, email: true }
          }
        },
        orderBy: { startDate: 'desc' }
      });
    }

    return NextResponse.json(leaves);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return NextResponse.json({ error: "Error fetching leaves" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, startDate, endDate, days, reason, employeeId } = await req.json();

    if (!type || !startDate || !endDate || !days) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userRole = (session.user as any).role;
    let targetEmployeeId = employeeId;
    let targetUserId = (session.user as any).id;

    if (userRole === 'personnel') {
      targetEmployeeId = session.user.id;
      // Fetch employee to get the admin's ID (userId)
      const employee = await prisma.employee.findUnique({
        where: { id: targetEmployeeId },
        select: { userId: true }
      });
      
      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }
      targetUserId = employee.userId;
    } else {
      // Admin is creating for an employee
      if (!targetEmployeeId) {
        return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
      }
      // Verify employee belongs to this admin
      const employee = await prisma.employee.findFirst({
        where: { id: targetEmployeeId, userId: targetUserId }
      });
      
      if (!employee) {
        return NextResponse.json({ error: "Employee not found or unauthorized" }, { status: 404 });
      }
    }

    const leave = await prisma.leave.create({
      data: {
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        days: parseInt(days),
        reason,
        status: userRole === 'personnel' ? 'pending' : 'approved', // Auto-approve if admin creates
        employeeId: targetEmployeeId,
        userId: targetUserId,
      },
    });

    return NextResponse.json(leave);
  } catch (error) {
    console.error("Error creating leave:", error);
    return NextResponse.json({ error: "Error creating leave" }, { status: 500 });
  }
}
