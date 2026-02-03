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
  const month = searchParams.get("month"); // Format: YYYY-MM
  const year = searchParams.get("year");

  if (!month || !year) {
    return NextResponse.json({ error: "Month and year required" }, { status: 400 });
  }

  const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  const endDate = new Date(parseInt(year), parseInt(month), 0);

  try {
    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        userId: (session.user as any).id, // Only fetch for this company/admin
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error("Attendance fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { employeeId, day, month, year, status } = body;

    if (!employeeId || !day || !month || !year || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    // Upsert attendance record
    const attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId,
          date,
        }
      },
      update: {
        status,
        userId: (session.user as any).id, // Ensure user ID is set
      },
      create: {
        employeeId,
        date,
        status,
        userId: (session.user as any).id,
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Attendance update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
