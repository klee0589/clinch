import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

// GET - Fetch trainer's availability schedule
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const trainerId = searchParams.get("trainerId");

    if (!trainerId) {
      return NextResponse.json(
        { error: "trainerId is required" },
        { status: 400 },
      );
    }

    // Fetch availability slots
    const { data: availability, error } = await supabase
      .from("TrainerAvailability")
      .select("*")
      .eq("trainerId", trainerId)
      .order("dayOfWeek", { ascending: true })
      .order("startTime", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch availability", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(availability || []);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 },
    );
  }
}

// POST - Set trainer's availability (replaces all existing slots)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trainerId, availability } = body;

    if (!trainerId || !Array.isArray(availability)) {
      return NextResponse.json(
        { error: "trainerId and availability array are required" },
        { status: 400 },
      );
    }

    // Verify user is the trainer
    const { data: trainer } = await supabase
      .from("TrainerProfile")
      .select("user:User!TrainerProfile_userId_fkey(clerkId)")
      .eq("id", trainerId)
      .single();

    if (!trainer || trainer.user?.clerkId !== userId) {
      return NextResponse.json(
        { error: "You can only set your own availability" },
        { status: 403 },
      );
    }

    // Delete existing availability
    await supabase
      .from("TrainerAvailability")
      .delete()
      .eq("trainerId", trainerId);

    // Insert new availability slots
    if (availability.length > 0) {
      const slots = availability.map((slot: any) => ({
        id: `avail_${trainerId}_${slot.dayOfWeek}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        trainerId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from("TrainerAvailability")
        .insert(slots);

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json(
          {
            error: "Failed to save availability",
            details: insertError.message,
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Availability updated successfully",
    });
  } catch (error) {
    console.error("Error saving availability:", error);
    return NextResponse.json(
      { error: "Failed to save availability" },
      { status: 500 },
    );
  }
}
