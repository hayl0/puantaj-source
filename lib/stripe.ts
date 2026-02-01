import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_stripe_key', {
  apiVersion: '2026-01-28.clover', // Latest stable version or the one compatible with the types
  typescript: true,
});

export const getStripeSession = async () => {
  // Client-side helper can be added here if needed, but usually strictly server-side for this file
};
