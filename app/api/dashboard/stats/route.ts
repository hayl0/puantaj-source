
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const userRole = (session.user as any).role;

  try {
    // Determine the query filter based on role
    // Admins see all data (or just their own if it's a multi-tenant app structure where admin=company owner)
    // Based on schema, everything is linked to `userId` (User model).
    // So "Admin" here effectively means the Company Owner/Manager.
    const whereUserId = { userId: userId };

    // 1. Total Employees
    const totalEmployees = await prisma.employee.count({
      where: whereUserId,
    });

    // 2. Attendance Rate (Today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const presentCount = await prisma.attendance.count({
      where: {
        ...whereUserId,
        date: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ['present', 'late', 'early_leave'] // Assuming these count as "attended"
        }
      },
    });

    const attendanceRate = totalEmployees > 0 
      ? Math.round((presentCount / totalEmployees) * 100) 
      : 0;

    // 3. Total Monthly Salary (Cost)
    // Sum of all employee salaries
    const employees = await prisma.employee.findMany({
      where: whereUserId,
      select: { salary: true, paymentType: true }
    });

    let totalMonthlyCost = 0;
    employees.forEach(emp => {
      if (emp.paymentType === 'monthly') {
        totalMonthlyCost += emp.salary;
      } else if (emp.paymentType === 'daily') {
        totalMonthlyCost += emp.salary * 30; // Approximation
      } else if (emp.paymentType === 'hourly') {
        totalMonthlyCost += emp.salary * 160; // Approximation (8h * 20d)
      }
    });

    // 4. Pending Leave Requests
    const pendingLeaves = await prisma.leave.count({
      where: {
        ...whereUserId,
        status: 'pending'
      }
    });

    return NextResponse.json({
      totalEmployees,
      attendanceRate,
      totalMonthlyCost,
      pendingLeaves
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
