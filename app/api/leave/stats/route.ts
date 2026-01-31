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
    if (userRole === 'admin') {
      // Admin sees company-wide average or total? 
      // For "My Dashboard" context, admin might want to see THEIR leaves or Company Summary.
      // The previous UI was showing "Remaining Days", which implies personal context.
      // Let's stick to Personal Context for the cards, but we can add a company summary if needed.
      // However, the user request is "real data", implying personal data for the logged in user.
      
      // But wait, the admin dashboard usually shows global stats. 
      // Let's check the UI. It says "İzin Durumunuz" (Your Leave Status) for users.
      // For Admin, it says "Personel izin taleplerini onaylayın".
      
      // Let's make the cards show PERSONAL data for everyone for now, 
      // as "Remaining Days" only makes sense for an individual.
      // If admin wants to see employee balances, that's a different view (Personnel Management).
      
      leaves = await prisma.leaveRequest.findMany({
        where: { userId, status: 'approved' } // Only count approved leaves
      });
    } else {
      leaves = await prisma.leaveRequest.findMany({
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
    
    if (userRole === 'admin') {
      upcomingLeaves = await prisma.leaveRequest.findMany({
        where: {
          startDate: { gte: now },
          status: 'approved'
        },
        include: { employee: true },
        orderBy: { startDate: 'asc' },
        take: 5
      });
    } else {
      upcomingLeaves = await prisma.leaveRequest.findMany({
        where: {
          userId,
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
