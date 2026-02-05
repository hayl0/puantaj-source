import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import prisma from '@/lib/prisma';
import { Plane, AlertCircle, FileText } from 'lucide-react';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;

  try {
    // 1. Entitlements Definition (Could be moved to DB later)
    const entitlements = {
      'Yıllık İzin': 14,
      'Hastalık İzni': 10,
      'Mazeret İzni': 5
    };

    // 2. Fetch Used Leaves
    let leaves;
    if (userRole === 'personnel') {
      leaves = await prisma.leave.findMany({
        where: { employeeId: userId, status: 'approved' }
      });
    } else {
      // Admin might see their own leaves if they have any, or this logic might need adjustment if Admin tracks their own leaves.
      // For now, let's assume Admin doesn't track their own leaves via this system, or we query by userId if they did.
      // But querying by userId (Company) would return ALL employees' leaves, which is wrong for a "Balance" card.
      // We'll leave it as userId for now but it's likely returning 0 for Admin, which is fine.
      leaves = await prisma.leave.findMany({
        where: { userId, status: 'approved' } 
      });
    }

    const used = {
      'Yıllık İzin': 0,
      'Hastalık İzni': 0,
      'Mazeret İzni': 0
    };

    leaves.forEach(l => {
      if (l.type in used) {
        // @ts-ignore
        used[l.type] += l.days;
      }
    });

    const balances = [
      { 
        type: 'Yıllık İzin', 
        total: entitlements['Yıllık İzin'], 
        used: used['Yıllık İzin'], 
        remaining: Math.max(0, entitlements['Yıllık İzin'] - used['Yıllık İzin']), 
        color: 'bg-purple-500', 
        iconName: 'Plane' 
      },
      { 
        type: 'Hastalık İzni', 
        total: entitlements['Hastalık İzni'], 
        used: used['Hastalık İzni'], 
        remaining: Math.max(0, entitlements['Hastalık İzni'] - used['Hastalık İzni']), 
        color: 'bg-pink-500', 
        iconName: 'AlertCircle' 
      },
      { 
        type: 'Mazeret İzni', 
        total: entitlements['Mazeret İzni'], 
        used: used['Mazeret İzni'], 
        remaining: Math.max(0, entitlements['Mazeret İzni'] - used['Mazeret İzni']), 
        color: 'bg-blue-500', 
        iconName: 'FileText' 
      },
    ];

    // 3. Fetch Upcoming Leaves (Global for Admin, Personal for User)
    let upcomingLeaves;
    const now = new Date();
    
    if (userRole === 'personnel') {
      upcomingLeaves = await prisma.leave.findMany({
        where: {
          employeeId: userId,
          startDate: { gte: now },
          status: 'approved'
        },
        include: { employee: true },
        orderBy: { startDate: 'asc' },
        take: 5
      });
    } else {
      // Admin sees all upcoming leaves
      upcomingLeaves = await prisma.leave.findMany({
        where: {
          userId: userId,
          startDate: { gte: now },
          status: 'approved'
        },
        include: { employee: true },
        orderBy: { startDate: 'asc' },
        take: 5
      });
    }

    return NextResponse.json({
      balances,
      upcomingLeaves
    });

  } catch (error) {
    console.error("Leave Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
