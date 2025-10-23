import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * PATCH /api/trainer-notes/[id]
 * Update a trainer note
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const noteId = params.id;
    const body = await request.json();
    const { note } = body;

    if (!note || note.trim().length === 0) {
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

    // Verify note belongs to this trainer
    const { data: existingNote, error: noteError } = await supabase
      .from("TrainerNotes")
      .select("*")
      .eq("id", noteId)
      .eq("trainerId", trainerProfile.id)
      .single();

    if (noteError || !existingNote) {
      return NextResponse.json(
        { error: "Note not found or does not belong to you" },
        { status: 404 },
      );
    }

    // Update note
    const { data: updatedNote, error: updateError } = await supabase
      .from("TrainerNotes")
      .update({
        note: note.trim(),
        updatedAt: new Date().toISOString(),
      })
      .eq("id", noteId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating note:", updateError);
      return NextResponse.json(
        { error: "Failed to update note" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: updatedNote });
  } catch (error) {
    console.error("Error in PATCH /api/trainer-notes/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/trainer-notes/[id]
 * Delete a trainer note
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const noteId = params.id;

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

    // Verify note belongs to this trainer
    const { data: existingNote, error: noteError } = await supabase
      .from("TrainerNotes")
      .select("*")
      .eq("id", noteId)
      .eq("trainerId", trainerProfile.id)
      .single();

    if (noteError || !existingNote) {
      return NextResponse.json(
        { error: "Note not found or does not belong to you" },
        { status: 404 },
      );
    }

    // Delete note
    const { error: deleteError } = await supabase
      .from("TrainerNotes")
      .delete()
      .eq("id", noteId);

    if (deleteError) {
      console.error("Error deleting note:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete note" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/trainer-notes/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
