import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { userId: clerkUserId } = await auth();

    // Get the current user's ID from the database if logged in
    let currentUserId: string | null = null;
    if (clerkUserId) {
      const { data: currentUser } = await supabase
        .from("User")
        .select("id")
        .eq("clerkId", clerkUserId)
        .single();

      if (currentUser) {
        currentUserId = currentUser.id;
      }
    }

    // Build query
    let query = supabase
      .from("TrainerProfile")
      .select(
        `
        *,
        user:User!TrainerProfile_userId_fkey (
          id,
          firstName,
          lastName,
          imageUrl,
          email
        ),
        gyms:TrainerGym (
          gym:GymProfile!TrainerGym_gymId_fkey (
            name,
            city,
            state,
            country
          )
        )
      `,
      )
      .order("averageRating", { ascending: false });

    // Exclude the current user from the results if they're a trainer
    if (currentUserId) {
      query = query.neq("userId", currentUserId);
    }

    // Apply filters
    const city = searchParams.get("city");
    if (city) {
      query = query.ilike("city", `%${city}%`);
    }

    const state = searchParams.get("state");
    if (state) {
      query = query.ilike("state", `%${state}%`);
    }

    const minRate = searchParams.get("minRate");
    if (minRate) {
      query = query.gte("hourlyRate", parseFloat(minRate));
    }

    const maxRate = searchParams.get("maxRate");
    if (maxRate) {
      query = query.lte("hourlyRate", parseFloat(maxRate));
    }

    const availableForOnline = searchParams.get("availableForOnline");
    if (availableForOnline === "true") {
      query = query.eq("availableForOnline", true);
    }

    const minRating = searchParams.get("minRating");
    if (minRating) {
      query = query.gte("averageRating", parseFloat(minRating));
    }

    const { data: trainers, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch trainers", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(trainers || []);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return NextResponse.json(
      { error: "Failed to fetch trainers" },
      { status: 500 },
    );
  }
}
