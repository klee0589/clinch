import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 },
      );
    }

    const { data: profile, error } = await supabase
      .from("TraineeProfile")
      .select("*")
      .eq("userId", userId)
      .single();

    if (error) {
      console.error("Error fetching trainee profile:", error);
      return NextResponse.json(
        { error: "Trainee profile not found", details: error.message },
        { status: 404 },
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Trainee profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error in /api/trainee-profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
