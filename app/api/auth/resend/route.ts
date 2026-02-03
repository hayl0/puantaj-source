
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email adresi gereklidir' },
        { status: 400 }
      );
    }

    let userType = 'none';
    let record = null;

    // Check User table
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      userType = 'user';
      record = user;
    } else {
      // Check Employee table
      const employee = await prisma.employee.findUnique({ where: { email } });
      if (employee) {
        userType = 'employee';
        record = employee;
      }
    }

    if (!record) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (record.emailVerified) {
      return NextResponse.json(
        { message: 'Bu hesap zaten doğrulanmış' },
        { status: 400 }
      );
    }

    // Generate new code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update DB
    if (userType === 'user') {
      await prisma.user.update({
        where: { id: record.id },
        data: { verificationCode },
      });
    } else {
      await prisma.employee.update({
        where: { id: record.id },
        data: { verificationCode },
      });
    }

    // Send email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json({ 
      message: 'Doğrulama kodu tekrar gönderildi',
      success: true 
    });

  } catch (error: any) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu', error: error.message },
      { status: 500 }
    );
  }
}
