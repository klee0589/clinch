import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * GET /api/user/is-trainer
 * Check if the authenticated user has a trainer profile
 * Returns { isTrainer: boolean }
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user's database ID
    const { data: user, error: userError } = await supabase
      .from("User")
      .select("id")
      .eq("clerkId", userId)
      .maybeSingle();

    if (userError) {
      console.error("Error looking up user:", userError);
      return NextResponse.json(
        { error: "Failed to look up user" },
        { status: 500 },
      );
    }

    if (!user) {
      // User doesn't exist in database yet
      return NextResponse.json({ isTrainer: false });
    }

    // 3. Check if user has a trainer profile
    const { data: trainerProfile, error } = await supabase
      .from("TrainerProfile")
      .select("id")
      .eq("userId", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking trainer profile:", error);
      return NextResponse.json(
        { error: "Failed to check trainer status" },
        { status: 500 },
      );
    }

    return NextResponse.json({ isTrainer: !!trainerProfile });
  } catch (error) {
    console.error("Error in GET /api/user/is-trainer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
