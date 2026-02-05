
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString());
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const userRole = (session.user as any).role;
    const userId = session.user.id;

    let whereClause: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userRole === 'personnel') {
      // If personnel, userId is the employeeId (as per authOptions)
      whereClause.employeeId = userId;
    } else {
      // If admin, userId is the admin's id
      whereClause.userId = userId;
    }

    const attendances = await prisma.attendance.groupBy({
      by: ['status'],
      where: whereClause,
      _count: {
        status: true
      }
    });

    // Default stats
    const stats = {
      present: 0,
      late: 0,
      absent: 0,
      leave: 0,
      report: 0
    };

    attendances.forEach((group: any) => {
      if (group.status in stats) {
        stats[group.status as keyof typeof stats] = group._count.status;
      }
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Attendance stats error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
