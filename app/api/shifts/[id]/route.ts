import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  const userId = (session.user as any).id;

  if (userRole !== 'admin' && userRole !== 'user') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const shift = await prisma.shift.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!shift) {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
    }

    // Ensure the shift belongs to the user (admin)
    if (shift.userId !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.shift.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting shift:", error);
    return NextResponse.json({ error: "Error deleting shift" }, { status: 500 });
  }
}
