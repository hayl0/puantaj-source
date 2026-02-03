import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getPayTRToken } from '@/lib/paytr';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

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

    // Generate unique merchant_oid with embedded User ID for callback identification
    // Format: ORD__{userId}__{timestamp}
    const merchant_oid = `ORD__${user.id}__${Date.now()}`;
    const user_ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Default values if user info is missing
    const user_name = user.name || 'Misafir Kullanici';
    const user_address = user.address || 'Adres Girilmemis';
    const user_phone = user.phone || '05555555555';
    const user_email = user.email || 'email@example.com';
    
    // Pro Plan Price: 1000 TL (Example)
    const payment_amount = 1000; 

    const result = await getPayTRToken(
      user_ip,
      user_name,
      user_email,
      user_address,
      user_phone,
      merchant_oid,
      payment_amount
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('PayTR Checkout Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
