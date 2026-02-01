import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { status, reason } = await req.json();

  // Validate status
  if (!['approved', 'rejected', 'pending'].includes(status)) {
     return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const userRole = (session.user as any).role;
  
  if (userRole !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const leave = await prisma.leave.update({
      where: { id },
      data: { status, reason },
    });
    return NextResponse.json(leave);
  } catch (error) {
    console.error("Error updating leave:", error);
    return NextResponse.json({ error: "Error updating leave" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const userRole = (session.user as any).role;
  const userId = (session.user as any).id;

  try {
    const leave = await prisma.leave.findUnique({ where: { id } });
    if (!leave) {
        return NextResponse.json({ error: "Leave not found" }, { status: 404 });
    }

    // Allow delete if Admin OR (User owns leave AND status is pending)
    if (userRole === 'admin' || (leave.userId === userId && leave.status === 'pending')) {
        await prisma.leave.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch (error) {
    console.error("Error deleting leave:", error);
    return NextResponse.json({ error: "Error deleting leave" }, { status: 500 });
  }
}
