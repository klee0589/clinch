import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * DELETE /api/trainee-media/[id]
 * Delete a media file and its database record
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

    const mediaId = params.id;

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

    // Get media record
    const { data: media, error: mediaError } = await supabase
      .from("TraineeMedia")
      .select("*")
      .eq("id", mediaId)
      .eq("trainerId", trainerProfile.id)
      .single();

    if (mediaError || !media) {
      return NextResponse.json(
        { error: "Media not found or does not belong to you" },
        { status: 404 },
      );
    }

    // Extract file path from URL
    // URL format: https://project.supabase.co/storage/v1/object/public/trainee-media/path/to/file.jpg
    const url = new URL(media.mediaUrl);
    const pathParts = url.pathname.split("/");
    const bucketIndex = pathParts.indexOf("trainee-media");
    const filePath = pathParts.slice(bucketIndex + 1).join("/");

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("trainee-media")
      .remove([filePath]);

    if (storageError) {
      console.error("Error deleting from storage:", storageError);
      // Continue to delete database record even if storage deletion fails
    }

    // Delete database record
    const { error: deleteError } = await supabase
      .from("TraineeMedia")
      .delete()
      .eq("id", mediaId);

    if (deleteError) {
      console.error("Error deleting media record:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete media record" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/trainee-media/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
