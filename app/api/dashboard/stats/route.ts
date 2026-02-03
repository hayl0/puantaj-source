import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  const userId = user.id;
  const userRole = user.role;

  try {
    if (userRole === 'personnel') {
      const now = new Date();
      const start = startOfMonth(now);
      const end = endOfMonth(now);

      // 1. Remaining Leave (Total - Used)
      // Assuming 14 days standard for now, or fetch from Employee model if added
      // We calculate used days
      const usedLeaves = await prisma.leave.aggregate({
        where: {
          employeeId: userId,
          status: 'approved',
          startDate: {
            gte: new Date(now.getFullYear(), 0, 1) // From start of year
          }
        },
        _sum: { days: true }
      });
      
      const usedDays = usedLeaves._sum.days || 0;
      const totalLeaveRights = 14; // Default standard
      const remainingLeave = Math.max(0, totalLeaveRights - usedDays);

      // 2. Monthly Overtime (Attendance > 9 hours or shifts marked as overtime)
      // For simplicity, summing 'hours' from attendance where status is 'present' or 'late'
      // Ideally we check shift plan, but let's assume > 9 hours is overtime or specific 'overtime' field
      // The current Attendance model has 'hours'.
      // Let's sum hours for this month.
      const attendanceStats = await prisma.attendance.aggregate({
        where: {
          employeeId: userId,
          date: { gte: start, lte: end }
        },
        _sum: { hours: true }
      });
      
      const totalHours = attendanceStats._sum.hours || 0;
      // Simple logic: assume 45 hours/week, approx 180 hours/month standard? 
      // Or just return total hours worked.
      // The UI says "Bu Ay Mesai" (Overtime this month).
      // Let's return total hours for now, or 0 if no specific overtime logic.
      
      // 3. Last Payroll
      const lastPayroll = await prisma.payroll.findFirst({
        where: { employeeId: userId, status: 'paid' },
        orderBy: { month: 'desc' }
      });

      return NextResponse.json({
        leave: {
          remaining: remainingLeave,
          total: totalLeaveRights,
          used: usedDays
        },
        work: {
          monthlyHours: totalHours.toFixed(1),
          overtime: 0 // Placeholder until we have strict overtime logic
        },
        payroll: {
          amount: lastPayroll?.amount || 0,
          date: lastPayroll?.paidAt || lastPayroll?.generatedAt || null
        }
      });
    }

    // Admin Stats Logic
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    // 1. Total Employees
    const totalEmployees = await prisma.employee.count({
      where: { userId: userId }
    });

    // 2. Attendance Rate (Today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const activeAttendance = await prisma.attendance.count({
      where: {
        userId: userId, // Employees of this admin
        date: {
          gte: todayStart,
          lte: todayEnd
        },
        status: { in: ['present', 'late', 'early_leave'] }
      }
    });

    const attendanceRate = totalEmployees > 0 
      ? Math.round((activeAttendance / totalEmployees) * 100) 
      : 0;

    // 3. Total Monthly Cost (Salaries)
    const employees = await prisma.employee.findMany({
      where: { userId: userId },
      select: { salary: true }
    });
    
    const totalMonthlyCost = employees.reduce((acc, curr) => acc + (curr.salary || 0), 0);

    // 4. Pending Leaves
    // We need to find leaves for employees of this admin
    // Leaves have employeeId. Employee has userId (admin).
    const pendingLeaves = await prisma.leave.count({
      where: {
        employee: {
          userId: userId
        },
        status: 'pending'
      }
    });

    return NextResponse.json({
      totalEmployees,
      attendanceRate,
      activeCount: activeAttendance,
      totalMonthlyCost,
      pendingLeaves
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
