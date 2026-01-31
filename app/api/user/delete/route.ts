import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import prisma from '@/lib/prisma';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete all related data in a transaction
    await prisma.$transaction([
      // 1. Delete all operational data linked to this user (company)
      prisma.attendance.deleteMany({ where: { userId: user.id } }),
      prisma.payroll.deleteMany({ where: { userId: user.id } }),
      prisma.leave.deleteMany({ where: { userId: user.id } }),
      prisma.shift.deleteMany({ where: { userId: user.id } }),
      
      // 2. Delete all employees
      prisma.employee.deleteMany({ where: { userId: user.id } }),
      
      // 3. Finally delete the user
      prisma.user.delete({ where: { id: user.id } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
