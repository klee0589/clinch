import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const clinchSessionId = session.metadata?.clinchSessionId;

  if (!clinchSessionId) {
    console.error("No clinchSessionId in checkout session metadata");
    return;
  }

  // Update session with payment information
  const { error } = await supabase
    .from("Session")
    .update({
      paymentStatus: "PAID",
      paid: true,
      stripePaymentIntentId: session.payment_intent as string,
      status: "CONFIRMED", // Automatically confirm session when paid
      updatedAt: new Date().toISOString(),
    })
    .eq("id", clinchSessionId);

  if (error) {
    console.error("Failed to update session after payment:", error);
  } else {
    console.log(`Session ${clinchSessionId} marked as paid and confirmed`);
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
) {
  // Update session if we have the payment intent ID
  const { error } = await supabase
    .from("Session")
    .update({
      paymentStatus: "PAID",
      paid: true,
      updatedAt: new Date().toISOString(),
    })
    .eq("stripePaymentIntentId", paymentIntent.id);

  if (error) {
    console.error("Failed to update session for payment intent:", error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Mark payment as failed
  const { error } = await supabase
    .from("Session")
    .update({
      paymentStatus: "UNPAID",
      paid: false,
      updatedAt: new Date().toISOString(),
    })
    .eq("stripePaymentIntentId", paymentIntent.id);

  if (error) {
    console.error("Failed to update session for failed payment:", error);
  }
}
