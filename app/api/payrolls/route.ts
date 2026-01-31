import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // YYYY-MM
  
  const userRole = (session.user as any).role;
  const currentId = (session.user as any).id;
  
  let whereClause: any = {};

  if (userRole === 'personnel') {
      whereClause.employeeId = currentId;
  } else {
      whereClause.userId = currentId;
  }

  if (month) {
    whereClause.month = month;
  }

  try {
    const payrolls = await prisma.payroll.findMany({
      where: whereClause,
      include: {
        employee: {
            select: { name: true, position: true, department: true }
        }
      },
      orderBy: { generatedAt: 'desc' }
    });
    return NextResponse.json(payrolls);
  } catch (error) {
    console.error("Error fetching payrolls:", error);
    return NextResponse.json({ error: "Error fetching payrolls" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const userRole = (session.user as any).role;
  if (userRole !== 'admin' && userRole !== 'user') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { month } = body; // YYYY-MM
    
    if (!month) {
        return NextResponse.json({ error: "Month is required" }, { status: 400 });
    }

    const currentId = (session.user as any).id;

    // Check if payrolls already exist for this month
    const existingPayrolls = await prisma.payroll.count({
        where: {
            userId: currentId,
            month: month
        }
    });

    if (existingPayrolls > 0) {
        return NextResponse.json({ error: "Payrolls for this month already exist" }, { status: 400 });
    }

    // Get all employees
    const employees = await prisma.employee.findMany({
        where: { userId: currentId }
    });

    if (employees.length === 0) {
        return NextResponse.json({ error: "No employees found" }, { status: 400 });
    }

    // Create payroll records
    // Simple calculation: Full salary. In future, we can deduct based on attendance.
    const payrollsData = employees.map(emp => ({
        month,
        amount: emp.salary || 0,
        status: 'pending',
        employeeId: emp.id,
        userId: currentId,
        generatedAt: new Date()
    }));

    await prisma.payroll.createMany({
        data: payrollsData
    });

    return NextResponse.json({ success: true, count: payrollsData.length });
  } catch (error) {
     console.error("Error creating payrolls:", error);
     return NextResponse.json({ error: "Error creating payrolls" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userRole = (session.user as any).role;
    if (userRole !== 'admin' && userRole !== 'user') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const body = await req.json();
      const { id, status } = body;
      
      if (!id || !status) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      const currentId = (session.user as any).id;
  
      const payroll = await prisma.payroll.updateMany({
        where: { 
            id: id,
            userId: currentId
        },
        data: {
          status,
          paidAt: status === 'paid' ? new Date() : null
        }
      });
  
      return NextResponse.json(payroll);
    } catch (error) {
       console.error("Error updating payroll:", error);
       return NextResponse.json({ error: "Error updating payroll" }, { status: 500 });
    }
  }
