import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * GET /api/trainer-notes?traineeId=xxx
 * Get all notes for a specific trainee
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const traineeId = searchParams.get("traineeId");

    if (!traineeId) {
      return NextResponse.json(
        { error: "traineeId is required" },
        { status: 400 },
      );
    }

    // Get trainer profile
    const { data: trainerProfile, error: trainerError } = await supabase
      .from("TrainerProfile")
      .select("id")
      .eq("userId", userId)
      .single();

    if (trainerError || !trainerProfile) {
      return NextResponse.json(
        { error: "Trainer profile not found" },
        { status: 404 },
      );
    }

    // Get notes
    const { data: notes, error: notesError } = await supabase
      .from("TrainerNotes")
      .select(
        `
        *,
        Session(scheduledAt, duration, status)
      `,
      )
      .eq("trainerId", trainerProfile.id)
      .eq("traineeId", traineeId)
      .order("createdAt", { ascending: false });

    if (notesError) {
      console.error("Error fetching notes:", notesError);
      return NextResponse.json(
        { error: "Failed to fetch notes" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: notes });
  } catch (error) {
    console.error("Error in GET /api/trainer-notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/trainer-notes
 * Create a new note for a trainee
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { traineeId, sessionId, note } = body;

    // Validation
    if (!traineeId || !note) {
      return NextResponse.json(
        { error: "traineeId and note are required" },
        { status: 400 },
      );
    }

    if (note.trim().length === 0) {
      return NextResponse.json(
        { error: "Note cannot be empty" },
        { status: 400 },
      );
    }

    // Get trainer profile
    const { data: trainerProfile, error: trainerError } = await supabase
      .from("TrainerProfile")
      .select("id")
      .eq("userId", userId)
      .single();

    if (trainerError || !trainerProfile) {
      return NextResponse.json(
        { error: "Trainer profile not found" },
        { status: 404 },
      );
    }

    // Verify trainee exists
    const { data: traineeProfile, error: traineeError } = await supabase
      .from("TraineeProfile")
      .select("id")
      .eq("id", traineeId)
      .single();

    if (traineeError || !traineeProfile) {
      return NextResponse.json({ error: "Trainee not found" }, { status: 404 });
    }

    // If sessionId provided, verify it exists and belongs to this trainer/trainee
    if (sessionId) {
      const { data: session, error: sessionError } = await supabase
        .from("Session")
        .select("id")
        .eq("id", sessionId)
        .eq("trainerId", trainerProfile.id)
        .eq("traineeId", traineeId)
        .single();

      if (sessionError || !session) {
        return NextResponse.json(
          { error: "Session not found or does not belong to you" },
          { status: 404 },
        );
      }
    }

    // Create note
    const { data: newNote, error: createError } = await supabase
      .from("TrainerNotes")
      .insert({
        trainerId: trainerProfile.id,
        traineeId,
        sessionId: sessionId || null,
        note: note.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating note:", createError);
      return NextResponse.json(
        { error: "Failed to create note" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: newNote }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/trainer-notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
