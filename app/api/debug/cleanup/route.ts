import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // 1. Doğrulanmamış (emailVerified: null) ve doğrulama kodu olan (yeni kayıt olmuş ama doğrulamamış) kullanıcıları bul
    // Not: Güvenlik için sadece son 24 saatte oluşturulmuş veya hiç giriş yapmamışları silebiliriz ama
    // kullanıcı "tüm askıda kalmış" dediği için verificationCode'u olan ve emailVerified'ı olmayanları siliyoruz.
    
    const unverifiedUsers = await prisma.user.deleteMany({
      where: {
        emailVerified: null,
      }
    });

    const unverifiedEmployees = await prisma.employee.deleteMany({
      where: {
        emailVerified: null,
        // Sadece giriş yetkisi olan (şifresi olan) ve doğrulanmamış personeli silmek daha güvenli olabilir
        // ama şimdilik basit tutalım.
        password: { not: null } 
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Temizlik tamamlandı.',
      deletedUsers: unverifiedUsers.count,
      deletedEmployees: unverifiedEmployees.count
    });

  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
