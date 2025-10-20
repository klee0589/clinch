import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const viewMode = searchParams.get("view"); // 'trainee' or 'trainer'

    // Build query - get sessions where user is trainer or trainee
    let query = supabase
      .from("Session")
      .select(
        `
        *,
        trainer:TrainerProfile!Session_trainerId_fkey (
          id,
          hourlyRate,
          currency,
          user:User!TrainerProfile_userId_fkey (
            id,
            clerkId,
            firstName,
            lastName,
            imageUrl,
            email
          )
        ),
        trainee:TraineeProfile!Session_traineeId_fkey (
          id,
          experienceLevel,
          user:User!TraineeProfile_userId_fkey (
            id,
            clerkId,
            firstName,
            lastName,
            imageUrl,
            email
          )
        )
      `,
      )
      .order("scheduledAt", { ascending: false });

    // Filter by status if provided
    const status = searchParams.get("status");
    if (status) {
      query = query.eq("status", status);
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch sessions", details: error.message },
        { status: 500 },
      );
    }

    // Filter sessions based on view mode
    let filteredSessions = sessions || [];

    if (viewMode === "trainer") {
      // Show sessions where user is the trainer
      filteredSessions = filteredSessions.filter(
        (session) => session.trainer?.user?.clerkId === userId,
      );
    } else if (viewMode === "trainee") {
      // Show sessions where user is the trainee
      filteredSessions = filteredSessions.filter(
        (session) => session.trainee?.user?.clerkId === userId,
      );
    } else {
      // Default: show all sessions where user is involved
      filteredSessions = filteredSessions.filter(
        (session) =>
          session.trainer?.user?.clerkId === userId ||
          session.trainee?.user?.clerkId === userId,
      );
    }

    return NextResponse.json(filteredSessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      trainerId,
      traineeId,
      scheduledAt,
      duration,
      price,
      currency = "USD",
      location,
      isOnline = false,
      notes,
    } = body;

    // Create session
    const { data: session, error } = await supabase
      .from("Session")
      .insert({
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        trainerId,
        traineeId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        duration,
        price,
        currency,
        location,
        isOnline,
        notes,
        status: "PENDING",
        paid: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select(
        `
        *,
        trainer:TrainerProfile!Session_trainerId_fkey (
          id,
          hourlyRate,
          user:User!TrainerProfile_userId_fkey (
            firstName,
            lastName,
            imageUrl
          )
        ),
        trainee:TraineeProfile!Session_traineeId_fkey (
          id,
          user:User!TraineeProfile_userId_fkey (
            firstName,
            lastName,
            imageUrl
          )
        )
      `,
      )
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create session", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
