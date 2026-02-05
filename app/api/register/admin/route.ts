
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

    // Check if email service is configured
    const isEmailConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin',
        verificationCode,
        // Auto-verify if email service is not configured
        emailVerified: isEmailConfigured ? null : new Date(),
      },
    });

    let emailSent = false;
    if (isEmailConfigured) {
       try {
         const result = await sendVerificationEmail(email, verificationCode);
         emailSent = result.success;
       } catch (e) {
         console.error("Email sending failed:", e);
       }
    }

    return NextResponse.json(
      { 
        message: isEmailConfigured && emailSent 
          ? 'Kayıt başarılı. Lütfen email adresinizi doğrulayın.' 
          : 'Kayıt başarılı. Giriş yapabilirsiniz.', 
        userId: user.id,
        needsVerification: isEmailConfigured && emailSent,
        email: user.email 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Kayıt işlemi sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
