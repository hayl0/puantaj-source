import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    let deletedEmployeesCount = 0;
    let deletedUsersCount = 0;

    // ----------------------------------------------------------------------
    // 1. DOĞRULANMAMIŞ PERSONEL (EMPLOYEE) TEMİZLİĞİ
    // ----------------------------------------------------------------------
    const unverifiedEmployees = await prisma.employee.findMany({
      where: {
        emailVerified: null,
        password: { not: null } 
      },
      select: { id: true }
    });

    const employeeIds = unverifiedEmployees.map(e => e.id);

    if (employeeIds.length > 0) {
      await prisma.$transaction(async (tx) => {
        // a. Maaşları sil
        await tx.payroll.deleteMany({
          where: { employeeId: { in: employeeIds } }
        });

        // b. İzinleri sil
        await tx.leave.deleteMany({
          where: { employeeId: { in: employeeIds } }
        });

        // c. Katılımları sil
        await tx.attendance.deleteMany({
          where: { employeeId: { in: employeeIds } }
        });

        // d. Vardiyaları sil
        await tx.shift.deleteMany({
          where: { employeeId: { in: employeeIds } }
        });

        // e. Personeli sil
        const deleted = await tx.employee.deleteMany({
          where: { id: { in: employeeIds } }
        });
        deletedEmployeesCount = deleted.count;
      });
    }

    // ----------------------------------------------------------------------
    // 2. DOĞRULANMAMIŞ KULLANICI (USER/ADMIN) TEMİZLİĞİ
    // ----------------------------------------------------------------------
    const unverifiedUsers = await prisma.user.findMany({
      where: {
        emailVerified: null,
      },
      select: { id: true }
    });

    const userIds = unverifiedUsers.map(u => u.id);

    if (userIds.length > 0) {
      await prisma.$transaction(async (tx) => {
        // a. Kullanıcıya bağlı maaş kayıtları
        await tx.payroll.deleteMany({
          where: { userId: { in: userIds } }
        });

        // b. İzin kayıtları
        await tx.leave.deleteMany({
          where: { userId: { in: userIds } }
        });

        // c. Katılım kayıtları
        await tx.attendance.deleteMany({
          where: { userId: { in: userIds } }
        });

        // d. Vardiya kayıtları
        await tx.shift.deleteMany({
          where: { userId: { in: userIds } }
        });

        // e. Kullanıcıya bağlı çalışanları (Employee) silmeden önce
        // o çalışanlara bağlı verileri de silmemiz lazım (Nested Cascade)
        // Önce bu user'lara bağlı employee ID'lerini bulalım
        const linkedEmployees = await tx.employee.findMany({
            where: { userId: { in: userIds } },
            select: { id: true }
        });
        const linkedEmployeeIds = linkedEmployees.map(e => e.id);

        if (linkedEmployeeIds.length > 0) {
             await tx.payroll.deleteMany({ where: { employeeId: { in: linkedEmployeeIds } } });
             await tx.leave.deleteMany({ where: { employeeId: { in: linkedEmployeeIds } } });
             await tx.attendance.deleteMany({ where: { employeeId: { in: linkedEmployeeIds } } });
             await tx.shift.deleteMany({ where: { employeeId: { in: linkedEmployeeIds } } });
             
             // Şimdi çalışanları silebiliriz
             await tx.employee.deleteMany({
                where: { id: { in: linkedEmployeeIds } }
             });
        }

        // f. Son olarak Kullanıcıları sil
        const deletedUsers = await tx.user.deleteMany({
          where: { id: { in: userIds } }
        });
        deletedUsersCount = deletedUsers.count;
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Kapsamlı temizlik tamamlandı.',
      deletedEmployeesCount,
      deletedUsersCount,
      details: 'Bağlı veriler (maaş, izin, vardiya vb.) zincirleme silindi.'
    });

  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { success: false, error: error.message, details: error },
      { status: 500 }
    );
  }
}
