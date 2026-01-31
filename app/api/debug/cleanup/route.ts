import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // 1. Önce doğrulanmamış çalışanları (personel) sil
    // Çünkü User silinirken Employee'ler User'a bağlı olabilir.
    const deletedEmployees = await prisma.employee.deleteMany({
      where: {
        emailVerified: null,
        password: { not: null } 
      }
    });

    // 2. Doğrulanmamış Kullanıcıları (Admin/Şirket) silmeden önce
    // bu kullanıcılara bağlı alt verileri (Employee, Payroll, Attendance vb.) silmemiz gerekir.
    // Ancak Prisma'da "deleteMany" cascade yapmaz.
    // Bu yüzden önce silinecek user ID'lerini bulalım.
    
    const unverifiedUsers = await prisma.user.findMany({
      where: {
        emailVerified: null,
      },
      select: { id: true }
    });

    const userIds = unverifiedUsers.map(u => u.id);

    if (userIds.length > 0) {
      // Transaction ile bu kullanıcılara bağlı her şeyi sırasıyla sil
      await prisma.$transaction(async (tx) => {
        // a. Bu kullanıcılara bağlı maaş kayıtlarını sil
        await tx.payroll.deleteMany({
          where: { userId: { in: userIds } }
        });

        // b. Bu kullanıcılara bağlı izin kayıtlarını sil
        await tx.leave.deleteMany({
          where: { userId: { in: userIds } }
        });

        // c. Bu kullanıcılara bağlı katılım (attendance) kayıtlarını sil
        await tx.attendance.deleteMany({
          where: { userId: { in: userIds } }
        });

        // d. Bu kullanıcılara bağlı vardiya (shift) kayıtlarını sil
        await tx.shift.deleteMany({
          where: { userId: { in: userIds } }
        });

        // e. Bu kullanıcılara bağlı çalışanları (Employee) sil
        // (Yukarıda doğrulanmamışları silmiştik ama doğrulanmış user'a bağlı
        // doğrulanmamış employee olabilir veya tam tersi. Burada User siliniyorsa
        // ona bağlı TÜM çalışanlar silinmeli çünkü şirket gidiyor.)
        await tx.employee.deleteMany({
          where: { userId: { in: userIds } }
        });

        // f. Son olarak Kullanıcıları sil
        await tx.user.deleteMany({
          where: { id: { in: userIds } }
        });
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Kapsamlı temizlik tamamlandı.',
      deletedEmployeesCount: deletedEmployees.count,
      deletedUsersCount: userIds.length,
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
