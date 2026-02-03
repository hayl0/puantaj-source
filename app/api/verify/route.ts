import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, code, type } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email ve kod gereklidir' },
        { status: 400 }
      );
    }

    if (type === 'admin') {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { message: 'Kullanıcı bulunamadı' },
          { status: 404 }
        );
      }

      if (user.emailVerified) {
        return NextResponse.json(
          { message: 'Hesap zaten doğrulanmış' },
          { status: 400 }
        );
      }

      if (user.verificationCode !== code) {
        return NextResponse.json(
          { message: 'Geçersiz doğrulama kodu' },
          { status: 400 }
        );
      }

      // Verify user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          verificationCode: null, // Clear code after usage
        },
      });

      return NextResponse.json({ message: 'Hesap başarıyla doğrulandı' });
    } else {
      // Employee verification
      const employee = await prisma.employee.findUnique({
        where: { email },
      });

      if (!employee) {
        return NextResponse.json(
          { message: 'Personel bulunamadı' },
          { status: 404 }
        );
      }

      if (employee.emailVerified) {
        return NextResponse.json(
          { message: 'Hesap zaten doğrulanmış' },
          { status: 400 }
        );
      }

      if (employee.verificationCode !== code) {
        return NextResponse.json(
          { message: 'Geçersiz doğrulama kodu' },
          { status: 400 }
        );
      }

      // Verify employee
      await prisma.employee.update({
        where: { id: employee.id },
        data: {
          emailVerified: new Date(),
          verificationCode: null,
        },
      });

      return NextResponse.json({ message: 'Hesap başarıyla doğrulandı' });
    }
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu', error: error.message },
      { status: 500 }
    );
  }
}
