import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * GET /api/trainer-trainees
 * Get list of trainees for the authenticated trainer
 * Returns trainees the trainer has had sessions with
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user's database ID first
    const { data: user, error: userError } = await supabase
      .from("User")
      .select("id")
      .eq("clerkId", userId)
      .single();

    if (userError || !user) {
      console.error("User lookup error:", { userId, error: userError });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get trainer profile
    const { data: trainerProfile, error: trainerError } = await supabase
      .from("TrainerProfile")
      .select("id")
      .eq("userId", user.id)
      .single();

    if (trainerError || !trainerProfile) {
      console.error("Trainer profile lookup error:", {
        userId,
        error: trainerError,
        profile: trainerProfile,
      });
      return NextResponse.json(
        { error: "Trainer profile not found" },
        { status: 404 },
      );
    }

    console.log("Found trainer profile:", trainerProfile.id);

    // 4. Get all unique trainees from sessions
    // Join with User and TraineeProfile to get full trainee info
    const { data: sessions, error: sessionsError } = await supabase
      .from("Session")
      .select(
        `
        traineeId,
        TraineeProfile!inner(
          id,
          userId,
          goals,
          experienceLevel,
          User!inner(
            clerkId,
            email,
            firstName,
            lastName,
            imageUrl
          )
        )
      `,
      )
      .eq("trainerId", trainerProfile.id)
      .eq("paymentStatus", "PAID") // Only include paid sessions
      .order("scheduledAt", { ascending: false });

    if (sessionsError) {
      console.error("Error fetching trainees:", sessionsError);
      return NextResponse.json(
        { error: "Failed to fetch trainees" },
        { status: 500 },
      );
    }

    // 5. Get unique trainees with their last session date
    const traineeMap = new Map();

    sessions?.forEach((session: any) => {
      const traineeId = session.traineeId;
      if (!traineeMap.has(traineeId)) {
        traineeMap.set(traineeId, {
          id: session.TraineeProfile.id,
          userId: session.TraineeProfile.userId,
          goals: session.TraineeProfile.goals,
          experienceLevel: session.TraineeProfile.experienceLevel,
          user: {
            clerkId: session.TraineeProfile.User.clerkId,
            email: session.TraineeProfile.User.email,
            firstName: session.TraineeProfile.User.firstName,
            lastName: session.TraineeProfile.User.lastName,
            imageUrl: session.TraineeProfile.User.imageUrl,
          },
        });
      }
    });

    // 6. Convert map to array and get session count for each trainee
    const trainees = await Promise.all(
      Array.from(traineeMap.values()).map(async (trainee) => {
        // Get session count
        const { count } = await supabase
          .from("Session")
          .select("*", { count: "exact", head: true })
          .eq("trainerId", trainerProfile.id)
          .eq("traineeId", trainee.id)
          .eq("paymentStatus", "PAID");

        // Get latest session date
        const { data: latestSession } = await supabase
          .from("Session")
          .select("scheduledAt")
          .eq("trainerId", trainerProfile.id)
          .eq("traineeId", trainee.id)
          .eq("paymentStatus", "PAID")
          .order("scheduledAt", { ascending: false })
          .limit(1)
          .single();

        // Get note count
        const { count: noteCount } = await supabase
          .from("TrainerNotes")
          .select("*", { count: "exact", head: true })
          .eq("trainerId", trainerProfile.id)
          .eq("traineeId", trainee.id);

        // Get media count
        const { count: mediaCount } = await supabase
          .from("TraineeMedia")
          .select("*", { count: "exact", head: true })
          .eq("trainerId", trainerProfile.id)
          .eq("traineeId", trainee.id);

        return {
          ...trainee,
          sessionCount: count || 0,
          lastSessionDate: latestSession?.scheduledAt || null,
          noteCount: noteCount || 0,
          mediaCount: mediaCount || 0,
        };
      }),
    );

    // 7. Sort by last session date (most recent first)
    trainees.sort((a, b) => {
      if (!a.lastSessionDate) return 1;
      if (!b.lastSessionDate) return -1;
      return (
        new Date(b.lastSessionDate).getTime() -
        new Date(a.lastSessionDate).getTime()
      );
    });

    return NextResponse.json({ data: trainees });
  } catch (error) {
    console.error("Error in GET /api/trainer-trainees:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
