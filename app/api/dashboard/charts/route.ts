
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import prisma from '@/lib/prisma';
import { startOfMonth, subMonths, format, subDays, startOfDay, endOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const whereUserId = { userId: userId };

  try {
    // 1. Revenue Chart Data (Last 6 months)
    // Use actual payroll data
    const revenueData = [];
    const currentMonth = new Date();
    
    // Fetch actual payroll history
    const historicalPayrolls = await prisma.payroll.groupBy({
      by: ['month'],
      where: {
        userId: userId,
        month: {
          gte: format(subMonths(currentMonth, 5), 'yyyy-MM')
        }
      },
      _sum: {
        amount: true
      }
    });

    // Create a map for easy lookup
    const payrollMap = new Map(historicalPayrolls.map(p => [p.month, p._sum.amount || 0]));

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(currentMonth, i);
      const monthKey = format(date, 'yyyy-MM');
      const monthName = format(date, 'MMM', { locale: tr });
      
      const total = payrollMap.get(monthKey) || 0;
      
      revenueData.push({ name: monthName, total });
    }

    // 2. Work Hours Chart (Last 5 days)
    const workHoursData = [];
    const today = new Date();
    
    for (let i = 4; i >= 0; i--) {
      const date = subDays(today, i);
      const dayName = format(date, 'EEE', { locale: tr }); // Pzt, Sal...
      
      const attendances = await prisma.attendance.findMany({
        where: {
          ...whereUserId,
          date: {
            gte: startOfDay(date),
            lte: endOfDay(date)
          }
        },
        select: { hours: true }
      });

      const totalHours = attendances.reduce((acc, curr) => acc + (curr.hours || 0), 0);
      // Average hours per employee who attended
      const avgHours = attendances.length > 0 ? Number((totalHours / attendances.length).toFixed(1)) : 0;
      
      workHoursData.push({ name: dayName, hours: avgHours });
    }

    // 3. Department Distribution
    const employees = await prisma.employee.findMany({
      where: whereUserId,
      select: { department: true }
    });

    const deptCounts: Record<string, number> = {};
    employees.forEach(emp => {
      const dept = emp.department || 'Diğer';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    const deptData = Object.entries(deptCounts).map(([name, value]) => ({ name, value }));

    // 4. Live Feed (Recent Activities)
    // Combine Attendances and Leaves
    const recentAttendances = await prisma.attendance.findMany({
      where: whereUserId,
      orderBy: { date: 'desc' }, // Should be checkIn time ideally, but date is okay for now
      take: 5,
      include: { employee: true }
    });

    const recentLeaves = await prisma.leave.findMany({
      where: whereUserId,
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { employee: true }
    });

    const recentEmployees = await prisma.employee.findMany({
      where: whereUserId,
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const activities = [
      ...recentAttendances.map(a => ({
        user: a.employee.name,
        action: a.checkIn ? 'Giriş yaptı' : 'Durum güncellendi',
        time: a.checkIn ? format(a.checkIn, 'HH:mm') : format(a.date, 'dd MMM'),
        timestamp: a.checkIn ? new Date(a.checkIn).getTime() : new Date(a.date).getTime(),
        avatar: a.employee.name.substring(0, 2).toUpperCase(),
        bg: 'bg-green-100 text-green-700',
        type: 'attendance'
      })),
      ...recentLeaves.map(l => ({
        user: l.employee.name,
        action: 'İzin talebi oluşturdu',
        time: format(l.createdAt, 'HH:mm'),
        timestamp: new Date(l.createdAt).getTime(),
        avatar: l.employee.name.substring(0, 2).toUpperCase(),
        bg: 'bg-blue-100 text-blue-700',
        type: 'leave'
      })),
      ...recentEmployees.map(e => ({
        user: e.name,
        action: 'Aramıza katıldı',
        time: format(e.createdAt, 'dd MMM'),
        timestamp: new Date(e.createdAt).getTime(),
        avatar: e.name.substring(0, 2).toUpperCase(),
        bg: 'bg-purple-100 text-purple-700',
        type: 'join'
      }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

    // 5. Department Status (Active/Total)
    // Calculate active (present today) per department
    const presentEmployees = await prisma.attendance.findMany({
      where: {
        ...whereUserId,
        date: {
          gte: startOfDay(today),
          lte: endOfDay(today)
        },
        status: { in: ['present', 'late', 'early_leave'] }
      },
      include: { employee: true }
    });

    const deptActiveCounts: Record<string, number> = {};
    presentEmployees.forEach(a => {
      const dept = a.employee.department || 'Diğer';
      deptActiveCounts[dept] = (deptActiveCounts[dept] || 0) + 1;
    });

    const departmentStatus = Object.entries(deptCounts).map(([name, total]) => ({
      name,
      count: deptActiveCounts[name] || 0,
      total,
      status: (deptActiveCounts[name] || 0) > 0 ? 'Aktif' : 'Beklemede',
      color: 'bg-blue-500' // Dynamic colors can be handled in frontend
    }));

    return NextResponse.json({
      revenueData,
      workHoursData,
      deptData,
      activities,
      departmentStatus
    });

  } catch (error) {
    console.error('Charts API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
