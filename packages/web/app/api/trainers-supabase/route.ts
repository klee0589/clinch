import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

// Cache the response for 1 minute for better performance
export const revalidate = 60;

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;

    // Skip auth check for public trainer browsing (faster response)
    // Only needed if we want to exclude current user, which we can skip for now
    let currentUserId: string | null = null;

    // Build optimized query - only select needed fields
    let query = supabase
      .from("TrainerProfile")
      .select(
        `
        id,
        bio,
        specialties,
        experienceYears,
        hourlyRate,
        city,
        state,
        country,
        address,
        zipCode,
        latitude,
        longitude,
        availableForOnline,
        averageRating,
        totalSessions,
        user:User!TrainerProfile_userId_fkey (
          firstName,
          lastName,
          imageUrl
        )
      `,
      )
      .order("averageRating", { ascending: false, nullsFirst: false })
      .limit(50); // Limit initial results

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

    // Filter by specialties (array contains any of the selected specialties)
    const specialties = searchParams.get("specialties");
    if (specialties) {
      const specialtyArray = specialties.split(",");
      query = query.overlaps("specialties", specialtyArray);
    }

    const { data: trainers, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch trainers", details: error.message },
        { status: 500 },
      );
    }

    // Add cache headers for better performance
    return NextResponse.json(trainers || [], {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return NextResponse.json(
      { error: "Failed to fetch trainers" },
      { status: 500 },
    );
  }
}
