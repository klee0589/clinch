import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Fetch session details from database
    const { data: session, error: sessionError } = await supabase
      .from("Session")
      .select(
        `
        *,
        trainer:TrainerProfile!Session_trainerId_fkey (
          id,
          hourlyRate,
          user:User!TrainerProfile_userId_fkey (
            firstName,
            lastName,
            email
          )
        ),
        trainee:TraineeProfile!Session_traineeId_fkey (
          id,
          user:User!TraineeProfile_userId_fkey (
            firstName,
            lastName,
            email,
            clerkId
          )
        )
      `,
      )
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Verify the user is the trainee booking this session
    if (session.trainee?.user?.clerkId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized - not your session" },
        { status: 403 },
      );
    }

    // Check if already paid
    if (session.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Session already paid" },
        { status: 400 },
      );
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: session.currency.toLowerCase(),
            product_data: {
              name: `Muay Thai Session with ${session.trainer.user.firstName} ${session.trainer.user.lastName}`,
              description: `${session.duration} minute ${session.isOnline ? "online" : "in-person"} session`,
              images: [],
            },
            unit_amount: Math.round(session.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.nextUrl.origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/dashboard?payment=cancelled`,
      metadata: {
        clinchSessionId: session.id,
        traineeId: session.traineeId,
        trainerId: session.trainerId,
      },
      customer_email: session.trainee.user.email,
    });

    // Update session with Stripe checkout session ID
    const { error: updateError } = await supabase
      .from("Session")
      .update({
        stripeCheckoutSessionId: checkoutSession.id,
        paymentStatus: "PENDING",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Failed to update session with checkout ID:", updateError);
    }

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      checkoutSessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
