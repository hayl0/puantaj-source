import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email gerekli' }, { status: 400 });
    }

    // 1. Doğrudan SMTP bağlantısını test et
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: parseInt(process.env.SMTP_PORT || '465') === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true, // Debug çıktılarını aktif et
      logger: true // Logger'ı aktif et
    });

    try {
      await transporter.verify();
      console.log('SMTP Connection Verified');
    } catch (verifyError: any) {
      console.error('SMTP Verify Error:', verifyError);
      return NextResponse.json({ 
        success: false, 
        stage: 'smtp_connection',
        error: verifyError.message,
        details: verifyError
      }, { status: 500 });
    }

    // 2. Test E-postası Gönder
    const testCode = '123456';
    const result = await sendVerificationEmail(email, testCode);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test e-postası gönderildi.',
        details: result
      });
    } else {
      return NextResponse.json({
        success: false,
        stage: 'sending_email',
        error: result.error
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Test route error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
