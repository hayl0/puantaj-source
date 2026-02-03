
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$connect();
    // Simple query to check connection
    const userCount = await prisma.user.count();
    const isSecretSet = !!process.env.NEXTAUTH_SECRET;
    return NextResponse.json({ status: 'ok', database: 'connected', userCount, isSecretSet });
  } catch (error: any) {
    console.error('Health Check Failed:', error);
    return NextResponse.json({ status: 'error', database: 'disconnected', error: error.message }, { status: 500 });
  }
}
