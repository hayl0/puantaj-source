import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { iyzico } from '@/lib/iyzico';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const conversationId = `CNV-${Date.now()}-${user.id}`;
    const price = '1000.00'; // Pro Plan Price
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/iyzico/callback`;

    const request = {
      locale: 'tr',
      conversationId: conversationId,
      price: price,
      paidPrice: price,
      currency: 'TRY',
      basketId: `B-${Date.now()}`,
      paymentGroup: 'PRODUCT',
      callbackUrl: callbackUrl,
      enabledInstallments: [2, 3, 6, 9],
      buyer: {
        id: user.id,
        name: user.name?.split(' ')[0] || 'Misafir',
        surname: user.name?.split(' ').slice(1).join(' ') || 'Kullanici',
        gsmNumber: user.phone || '+905555555555',
        email: user.email,
        identityNumber: '11111111111', // Mandatory for live, random for sandbox
        lastLoginDate: '2015-10-05 12:43:35',
        registrationDate: '2013-04-21 15:12:09',
        registrationAddress: user.address || 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: '85.34.78.112', // Should use req IP
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: user.name || 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: user.address || 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      billingAddress: {
        contactName: user.name || 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: user.address || 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      basketItems: [
        {
          id: 'BI101',
          name: 'Pro Plan Abonelik',
          category1: 'Subscription',
          category2: 'Software',
          itemType: 'VIRTUAL',
          price: price
        }
      ]
    };

    return new Promise<NextResponse>((resolve) => {
      iyzico.checkoutFormInitialize.create(request, (err: any, result: any) => {
        if (err) {
          console.error('Iyzico Error:', err);
          resolve(new NextResponse('Iyzico init failed', { status: 500 }));
        } else {
          // Store token in DB if needed, or just return content
          // result.checkoutFormContent contains the HTML snippet script
          // result.token contains the token
          
          if (result.status === 'success') {
             resolve(NextResponse.json({ 
               status: 'success', 
               htmlContent: result.checkoutFormContent,
               token: result.token,
               paymentPageUrl: result.paymentPageUrl // Note: checkoutFormInitialize usually returns content to embed, not a page URL. But newer API might.
               // Actually checkoutFormInitialize returns 'checkoutFormContent' which is a script block.
             }));
          } else {
             console.error('Iyzico Failure:', result.errorMessage);
             resolve(new NextResponse(result.errorMessage || 'Iyzico failed', { status: 400 }));
          }
        }
      });
    });

  } catch (error) {
    console.error('Iyzico Route Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
