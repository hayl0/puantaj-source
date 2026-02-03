import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Get user to check current password
    let user;
    if (userRole === 'personnel') {
      user = await prisma.employee.findUnique({ where: { id: userId } });
    } else {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid current password" }, { status: 400 });
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update password
    if (userRole === 'personnel') {
      await prisma.employee.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Password Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
