import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// File size limits (in bytes)
const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

// Allowed MIME types
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

/**
 * GET /api/trainee-media?traineeId=xxx&mediaType=photo|video
 * Get all media for a specific trainee
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const traineeId = searchParams.get("traineeId");
    const mediaType = searchParams.get("mediaType"); // optional filter

    if (!traineeId) {
      return NextResponse.json(
        { error: "traineeId is required" },
        { status: 400 },
      );
    }

    // Get user from Clerk ID
    const { data: user, error: userError } = await supabase
      .from("User")
      .select("id")
      .eq("clerkId", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get trainer profile
    const { data: trainerProfile, error: trainerError } = await supabase
      .from("TrainerProfile")
      .select("id")
      .eq("userId", user.id)
      .single();

    if (trainerError || !trainerProfile) {
      return NextResponse.json(
        { error: "Trainer profile not found" },
        { status: 404 },
      );
    }

    // Build query
    let query = supabase
      .from("TraineeMedia")
      .select(
        `
        *,
        Session(scheduledAt, duration, status)
      `,
      )
      .eq("trainerId", trainerProfile.id)
      .eq("traineeId", traineeId);

    // Filter by media type if provided
    if (mediaType && (mediaType === "photo" || mediaType === "video")) {
      query = query.eq("mediaType", mediaType);
    }

    const { data: media, error: mediaError } = await query.order("createdAt", {
      ascending: false,
    });

    if (mediaError) {
      console.error("Error fetching media:", mediaError);
      return NextResponse.json(
        { error: "Failed to fetch media" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: media });
  } catch (error) {
    console.error("Error in GET /api/trainee-media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/trainee-media
 * Upload photo or video for a trainee
 * Expects multipart/form-data with file upload
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const traineeId = formData.get("traineeId") as string;
    const sessionId = formData.get("sessionId") as string | null;
    const description = formData.get("description") as string | null;

    // Validation
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!traineeId) {
      return NextResponse.json(
        { error: "traineeId is required" },
        { status: 400 },
      );
    }

    // Determine media type from MIME type
    let mediaType: "photo" | "video";
    if (ALLOWED_PHOTO_TYPES.includes(file.type)) {
      mediaType = "photo";
    } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      mediaType = "video";
    } else {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed: ${[...ALLOWED_PHOTO_TYPES, ...ALLOWED_VIDEO_TYPES].join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Check file size
    const maxSize = mediaType === "photo" ? MAX_PHOTO_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large. Max size for ${mediaType}: ${maxSize / 1024 / 1024}MB`,
        },
        { status: 400 },
      );
    }

    // Get user from Clerk ID
    const { data: user, error: userError } = await supabase
      .from("User")
      .select("id")
      .eq("clerkId", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get trainer profile
    const { data: trainerProfile, error: trainerError } = await supabase
      .from("TrainerProfile")
      .select("id")
      .eq("userId", user.id)
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

    // Verify session if provided
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

    // Generate unique filename
    const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const uuid = crypto.randomUUID().split("-")[0];
    const fileExtension = file.name.split(".").pop();
    const filename = `${timestamp}_${uuid}.${fileExtension}`;

    // Build storage path
    const folder = mediaType === "photo" ? "photos" : "videos";
    const filePath = `trainer_${trainerProfile.id}/trainee_${traineeId}/${folder}/${filename}`;

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("trainee-media")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading to storage:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 },
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("trainee-media")
      .getPublicUrl(filePath);

    // Create database record
    const { data: mediaRecord, error: createError } = await supabase
      .from("TraineeMedia")
      .insert({
        trainerId: trainerProfile.id,
        traineeId,
        sessionId: sessionId || null,
        mediaType,
        mediaUrl: urlData.publicUrl,
        description: description?.trim() || null,
        fileSizeBytes: file.size,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating media record:", createError);
      // Try to clean up uploaded file
      await supabase.storage.from("trainee-media").remove([filePath]);
      return NextResponse.json(
        { error: "Failed to create media record" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: mediaRecord }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/trainee-media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
