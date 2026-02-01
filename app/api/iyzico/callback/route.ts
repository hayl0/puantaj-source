import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { iyzico } from '@/lib/iyzico';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return new NextResponse('Token missing', { status: 400 });
    }

    return new Promise<NextResponse>((resolve) => {
      const request = {
        locale: 'tr',
        token: token
      };

      // @ts-ignore: Iyzipay types are not fully covered
      iyzico.checkoutForm.retrieve(request, async (err: any, result: any) => {
        if (err) {
          console.error('Iyzico Retrieve Error:', err);
          resolve(NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ayarlar?payment=fail&reason=verification_error`, 302));
        } else {
          if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
            try {
              const conversationId = result.conversationId;
              // Format: CNV-{timestamp}-{userId}
              const parts = conversationId.split('-');
              
              if (parts.length >= 3) {
                // Join back the rest in case userId has dashes
                const userId = parts.slice(2).join('-');
                
                await prisma.user.update({
                  where: { id: userId },
                  data: { plan: 'pro' }
                });
                
                resolve(NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ayarlar?payment=success`, 302));
              } else {
                console.error('Invalid conversationId format:', conversationId);
                resolve(NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ayarlar?payment=fail&reason=invalid_ref`, 302));
              }
            } catch (dbError) {
              console.error('Database Update Error:', dbError);
              resolve(NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ayarlar?payment=fail&reason=db_error`, 302));
            }
          } else {
            const errorMessage = result.errorMessage || 'payment_failed';
            resolve(NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ayarlar?payment=fail&reason=${encodeURIComponent(errorMessage)}`, 302));
          }
        }
      });
    });

  } catch (error) {
    console.error('Iyzico Callback Unexpected Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
