import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

const settingsUrl = process.env.NEXTAUTH_URL + '/ayarlar';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      }
    });

    if (!user) {
        return new NextResponse('User not found', { status: 404 });
    }

    // Check if user already has a stripe customer id
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name || undefined,
            metadata: {
                userId: user.id
            }
        });
        stripeCustomerId = customer.id;
        
        await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId }
        });
    }

    // Check if user is already subscribed and valid
    if (user.stripeSubscriptionId && user.plan === 'pro') {
         // Create portal session
         const stripeSession = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: settingsUrl,
        });

        return NextResponse.json({ url: stripeSession.url });
    }

    // Create Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl + '?success=true',
      cancel_url: settingsUrl + '?canceled=true',
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer: stripeCustomerId,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('[STRIPE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
