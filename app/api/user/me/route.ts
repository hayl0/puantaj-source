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

    if (userRole === 'personnel') {
      const employee = await prisma.employee.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
          position: true,
          phone: true,    // Now exists
          address: true,  // Now exists
        }
      });
      
      if (employee) {
        userData = {
          ...employee,
          role: 'personnel',
          // Personnel don't have company details
          companyName: '',
          taxNumber: '',
          // Use employee's own phone/address
          phone: employee.phone || '',
          address: employee.address || ''
        };
      }
    } else {
      userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          companyName: true,
          taxNumber: true,
          phone: true,
          address: true,
          plan: true,
          stripeCurrentPeriodEnd: true,
          stripeSubscriptionId: true,
        }
      });
    }

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
