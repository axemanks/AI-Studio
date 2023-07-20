// webhook for stripe

import Stripe from "stripe";
import { headers } from "next/headers"; // to get values from the headers of the request
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import * as React from "react";

export async function POST(req: Request) {
  const body = await req.text();
  // The value of "signature" is obtained by calling the "get" method on the result of the function "headers()", and passing the string literal "Stripe-Signature" as an argument. The result of "headers().get("Stripe-Signature")" is then casted to a string using the "as" keyword.
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }


  // watch for checkout or billing
  const session = event.data.object as Stripe.Checkout.Session;

  if(event?.type === "checkout.session.completed"){
    // retreive the sub
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    if(!session?.metadata?.userId) {
      return new NextResponse("User ID is required", {status: 400});
    }
    // if there is a subscription create a new account
    await prismadb.userSubscription.create({
      data: {
        userId: session?.metadata?.userId, // get the user ID from the session without using Clerk
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    })
  }

  // if user upgraded
  if (event.type === "invoice.payment_succedded"){
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await prismadb.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  return new NextResponse(null, { status: 200 }) // must be status 200 for webhook
}