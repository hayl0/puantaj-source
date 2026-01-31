import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123'); // Fallback for dev without key to prevent crash

export async function sendVerificationEmail(email: string, code: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[DEV MODE] Email Verification Code for ${email}: ${code}`);
      return { success: true, dev: true };
    }

    const { data, error } = await resend.emails.send({
      from: 'Puantaj Pro <onboarding@resend.dev>', // Default Resend testing domain
      to: [email],
      subject: 'Puantaj Pro - Doğrulama Kodu',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h1 style="color: #4f46e5; text-align: center;">Puantaj Pro</h1>
          <p style="text-align: center; color: #64748b;">Hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f172a;">${code}</span>
          </div>
          <p style="text-align: center; font-size: 14px; color: #94a3b8;">Bu kodu siz talep etmediyseniz, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      // Fallback to console log in case of error (e.g. domain not verified)
      console.log(`[FALLBACK] Email Verification Code for ${email}: ${code}`);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error };
  }
}
