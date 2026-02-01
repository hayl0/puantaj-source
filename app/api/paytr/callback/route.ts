import { NextResponse } from 'next/server';
import { paytrConfig } from '@/lib/paytr';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const merchant_oid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const total_amount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;
    
    // Validate hash
    const params = merchant_oid + status + total_amount + paytrConfig.merchant_key;
    const calculatedHash = crypto.createHmac('sha256', paytrConfig.merchant_salt).update(params).digest('base64');

    if (hash !== calculatedHash) {
      return new NextResponse('PAYTR notification failed: bad hash', { status: 400 });
    }

    if (status === 'success') {
      // Payment successful
      // Extract userId from merchant_oid: ORD__{userId}__{timestamp}
      const parts = merchant_oid.split('__');
      
      if (parts.length >= 2) {
        const userId = parts[1];
        
        // Update User Plan to Pro
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: 'pro',
            // We can also store the order ID or payment info if we had fields for it
            // For now just enabling the plan
          }
        });
        
        console.log(`User ${userId} upgraded to PRO via PayTR`);
      }
    }

    // Always return OK
    return new NextResponse('OK');
  } catch (error) {
    console.error('PayTR Callback Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
