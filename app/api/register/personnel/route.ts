
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, password, companyEmail } = await req.json();

    if (!name || !email || !password || !companyEmail) {
      return NextResponse.json(
        { message: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // 1. Check if the company (Admin User) exists
    const company = await prisma.user.findUnique({
      where: { email: companyEmail },
    });

    if (!company) {
      return NextResponse.json(
        { message: 'Belirtilen şirket/yönetici bulunamadı' },
        { status: 404 }
      );
    }

    // 2. Check if employee email is already in use (in Employee table)
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { message: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // 3. Create Employee
    const hashedPassword = await hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userId: company.id,
        department: 'Genel',
        position: 'Personel',
        salary: 0,
        hireDate: new Date(),
        verificationCode,
        // emailVerified null by default
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json(
      { 
        message: 'Kayıt başarılı. Lütfen email adresinizi doğrulayın.', 
        employeeId: employee.id,
        needsVerification: true,
        email: employee.email 
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
