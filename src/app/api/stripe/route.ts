// Stripe Endpoint
// Stripe Checkout Page
import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';

// settings - get the absoluteUrl and add /settings to the path
const settingsUrl = absoluteUrl('/settings');

export async function GET() {
  try {
    // get user ID
    const { userId } = auth();
    const user = await currentUser();
    // if no user ID or user, return unauthorized
    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    // fing subscription where userID = userID
    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId: userId,
      },
    });
    // BILLING PORTAL - cancel or upgrade
    // if there IS a subscription
    if (userSubscription && userSubscription.stripeCustomerId) {
      // direct to billing
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl, // return to settings when done
      });
      // return
      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }
    // CHECKOUT
    // if no subscription go to checkout
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ['card'], // payment types
      mode: 'subscription', // subscription
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress, // the user object from clerk-has array of emails
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI-Studio Pro',
              description: 'Unlimited AI Generations',
            },
            unit_amount: 2000, // $20
            recurring: {
              interval: 'month', // monthly
            },
          },
          quantity: 1,
        },
      ], // be sure to include the metadata- after checkout this is used to apply the purchase to the correct user
      metadata: {
        userId: userId,
      },
    });

    // return
    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log('[STRIPE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
