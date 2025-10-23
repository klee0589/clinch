import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    // Update session status
    const { data: session, error } = await supabase
      .from("Session")
      .update({
        status,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to update session", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // First, get the session to verify ownership
    const { data: session, error: fetchError } = await supabase
      .from("Session")
      .select(
        `
        *,
        trainer:TrainerProfile!Session_trainerId_fkey (
          user:User!TrainerProfile_userId_fkey (
            clerkId
          )
        ),
        trainee:TraineeProfile!Session_traineeId_fkey (
          user:User!TraineeProfile_userId_fkey (
            clerkId
          )
        )
      `,
      )
      .eq("id", id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Verify user is either the trainer or trainee
    const isTrainer = session.trainer?.user?.clerkId === userId;
    const isTrainee = session.trainee?.user?.clerkId === userId;

    if (!isTrainer && !isTrainee) {
      return NextResponse.json(
        { error: "You don't have permission to delete this session" },
        { status: 403 },
      );
    }

    // Check payment status - only allow deletion for UNPAID sessions
    if (session.paymentStatus === "PENDING") {
      return NextResponse.json(
        {
          error:
            "Cannot delete session with pending payment. Please wait for payment to complete or fail.",
        },
        { status: 400 },
      );
    }

    if (session.paymentStatus === "PAID") {
      return NextResponse.json(
        {
          error:
            "Cannot delete a paid session. Please contact support if you need to cancel this session.",
        },
        { status: 400 },
      );
    }

    // Delete the session
    const { error: deleteError } = await supabase
      .from("Session")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete session", details: deleteError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: "Session deleted" });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 },
    );
  }
}
