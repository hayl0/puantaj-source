import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  // Default to current month if not specified, but FullCalendar usually sends ISO strings
  const startDate = start ? new Date(start) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endDate = end ? new Date(end) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  try {
    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;

    // Build where clause based on role
    // If admin, fetch all for their company (userId matches creator of records or records associated with their employees)
    // Actually, in this system, 'userId' on Shift/Leave usually points to the Admin/Company who owns the record,
    // OR the Employee who owns it.
    // Let's assume standard model: 
    // Shifts have userId (creator/admin) and employeeId.
    // Leaves have employeeId.

    // Fetch Shifts
    const shiftsWhere: any = {
      date: {
        gte: startDate,
        lte: endDate,
      }
    };

    // Fetch Leaves
    const leavesWhere: any = {
      startDate: {
        lte: endDate,
      },
      endDate: {
        gte: startDate,
      }
    };

    if (userRole === 'admin') {
      shiftsWhere.userId = userId;
      // Leaves don't have direct userId usually, they are linked to Employee.
      // We need to find leaves of employees belonging to this admin.
      // Assuming Employee model has userId pointing to Admin.
      leavesWhere.employee = {
        userId: userId
      };
    } else {
      // Personnel seeing their own
      // For shifts: they are assigned to employee.
      // We need to find the employee record for this user.
      const employee = await prisma.employee.findFirst({
        where: { email: session.user.email! }
      });

      if (!employee) {
        return NextResponse.json([]);
      }

      shiftsWhere.employeeId = employee.id;
      leavesWhere.employeeId = employee.id;
    }

    const [shifts, leaves] = await Promise.all([
      prisma.shift.findMany({
        where: shiftsWhere,
        include: { employee: true }
      }),
      prisma.leave.findMany({
        where: leavesWhere,
        include: { employee: true }
      })
    ]);

    const events = [
      ...shifts.map(shift => ({
        id: `shift-${shift.id}`,
        title: `${shift.employee?.name || 'Vardiya'}: ${shift.name}`,
        start: `${shift.date.toISOString().split('T')[0]}T${shift.startTime}`,
        end: `${shift.date.toISOString().split('T')[0]}T${shift.endTime}`,
        backgroundColor: '#3b82f6', // blue-500
        borderColor: '#3b82f6',
        extendedProps: { type: 'shift', ...shift }
      })),
      ...leaves.map(leave => ({
        id: `leave-${leave.id}`,
        title: `${leave.employee?.name || 'Personel'}: ${leave.type}`,
        start: leave.startDate,
        end: leave.endDate,
        backgroundColor: '#ef4444', // red-500
        borderColor: '#ef4444',
        extendedProps: { type: 'leave', ...leave }
      }))
    ];

    return NextResponse.json(events);
  } catch (error) {
    console.error("Calendar events fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
