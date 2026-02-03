import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;

  try {
    let userData;
    let relatedData = {};

    if (userRole === 'personnel') {
      userData = await prisma.employee.findUnique({ where: { id: userId } });
      relatedData = {
        attendances: await prisma.attendance.findMany({ where: { employeeId: userId } }),
        leaves: await prisma.leave.findMany({ where: { employeeId: userId } }),
        shifts: await prisma.shift.findMany({ where: { employeeId: userId } }),
        payrolls: await prisma.payroll.findMany({ where: { employeeId: userId } }),
      };
    } else {
      userData = await prisma.user.findUnique({ where: { id: userId } });
      relatedData = {
        employees: await prisma.employee.findMany({ where: { userId } }),
        incomes: await prisma.income.findMany({ where: { userId } }),
        payrolls: await prisma.payroll.findMany({ where: { userId } }),
      };
    }

    const exportData = {
      profile: userData,
      ...relatedData,
      exportedAt: new Date().toISOString(),
    };

    return NextResponse.json(exportData);

  } catch (error) {
    console.error("Data Export Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
