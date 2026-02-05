import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: parseInt(process.env.SMTP_PORT || '465') === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS?.replace(/\s+/g, ''),
  },
});

export async function sendVerificationEmail(email: string, code: string) {
  try {
    // If credentials are missing
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      const msg = 'SMTP credentials missing. Email sending skipped.';
      if (process.env.NODE_ENV === 'production') {
         console.warn(msg + ' (Production)');
         // Don't throw error, just return false so the caller knows
         return { success: false, error: 'SMTP_MISSING' };
      }
      console.log(`[DEV MODE] Email Verification Code for ${email}: ${code}`);
      return { success: true, dev: true };
    }

    const info = await transporter.sendMail({
      from: `"Puantaj Pro" <${process.env.SMTP_USER}>`, // sender address
      to: email, // list of receivers
      subject: 'Puantaj Pro - Doğrulama Kodu', // Subject line
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h1 style="color: #4f46e5; text-align: center; margin-bottom: 20px;">Puantaj Pro</h1>
          <p style="text-align: center; color: #64748b; font-size: 16px;">Hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
          <div style="background-color: #f1f5f9; padding: 24px; border-radius: 12px; text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0f172a; font-family: monospace;">${code}</span>
          </div>
          <p style="text-align: center; font-size: 14px; color: #94a3b8;">Bu kodu siz talep etmediyseniz, bu e-postayı görmezden gelebilirsiniz.</p>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #cbd5e1; font-size: 12px;">© ${new Date().getFullYear()} Puantaj Pro. Tüm hakları saklıdır.</p>
          </div>
        </div>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Email send failed detailed:', JSON.stringify(error, null, 2));
    console.error('Email send failed message:', error.message);
    return { success: false, error: error.message || error };
  }
}
