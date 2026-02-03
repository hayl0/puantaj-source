import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { hash } from "bcryptjs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const employees = await prisma.employee.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching employees" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, password, department, position, salary, paymentType, hireDate } = await req.json();

    if (!name || !department || !position || !salary) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : null;

    let hashedPassword = null;
    if (password) {
      hashedPassword = await hash(password, 12);
    }

    // Check if email is already in use by another employee of this admin
    if (cleanEmail) {
      const existingEmployee = await prisma.employee.findUnique({
        where: { email: cleanEmail },
      });
      if (existingEmployee) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        // @ts-ignore
        email: cleanEmail,
        password: hashedPassword,
        department,
        position,
        salary: parseFloat(salary),
        paymentType: paymentType || 'monthly',
        hireDate: hireDate ? new Date(hireDate) : new Date(),
        userId: session.user.id,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: "Error creating employee" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, name, email, password, department, position, salary, paymentType, hireDate } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee || existingEmployee.userId !== session.user.id) {
      return NextResponse.json({ error: "Employee not found or unauthorized" }, { status: 404 });
    }

    const updateData: any = {
      name,
      // @ts-ignore
      email: email ? email.trim().toLowerCase() : undefined,
      department,
      position,
      salary: parseFloat(salary),
      paymentType: paymentType || 'monthly',
    };

    if (hireDate) {
      updateData.hireDate = new Date(hireDate);
    }

    if (password) {
      updateData.password = await hash(password, 12);
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ error: "Error updating employee" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee || existingEmployee.userId !== session.user.id) {
      return NextResponse.json({ error: "Employee not found or unauthorized" }, { status: 404 });
    }

    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ error: "Error deleting employee" }, { status: 500 });
  }
}
