
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin',
        verificationCode,
        // emailVerified is null by default
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json(
      { 
        message: 'Kayıt başarılı. Lütfen email adresinizi doğrulayın.', 
        userId: user.id,
        needsVerification: true,
        email: user.email 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
