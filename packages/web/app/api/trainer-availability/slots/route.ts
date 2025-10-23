import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

// Helper function to check if a time slot is available
function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  existingSessions: any[],
  timeOff: any[],
): boolean {
  // Check if slot conflicts with existing sessions
  for (const session of existingSessions) {
    const sessionStart = new Date(session.scheduledAt);
    const sessionEnd = new Date(
      sessionStart.getTime() + session.duration * 60000,
    );

    // Check for overlap
    if (slotStart < sessionEnd && slotEnd > sessionStart) {
      return false;
    }
  }

  // Check if slot conflicts with time off
  for (const timeoff of timeOff) {
    const timeoffStart = new Date(timeoff.startDate);
    const timeoffEnd = new Date(timeoff.endDate);

    // Check for overlap
    if (slotStart < timeoffEnd && slotEnd > timeoffStart) {
      return false;
    }
  }

  return true;
}

// GET - Get available time slots for a trainer on a specific date
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const trainerId = searchParams.get("trainerId");
    const date = searchParams.get("date"); // Format: YYYY-MM-DD
    const duration = parseInt(searchParams.get("duration") || "60"); // in minutes

    if (!trainerId || !date) {
      return NextResponse.json(
        { error: "trainerId and date are required" },
        { status: 400 },
      );
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    // Fetch trainer's availability for this day of week
    const { data: availability } = await supabase
      .from("TrainerAvailability")
      .select("*")
      .eq("trainerId", trainerId)
      .eq("dayOfWeek", dayOfWeek);

    if (!availability || availability.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch existing sessions for this trainer on this date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: existingSessions } = await supabase
      .from("Session")
      .select("scheduledAt, duration")
      .eq("trainerId", trainerId)
      .gte("scheduledAt", startOfDay.toISOString())
      .lte("scheduledAt", endOfDay.toISOString())
      .neq("status", "CANCELLED");

    // Fetch time off periods that overlap with this date
    const { data: timeOff } = await supabase
      .from("TrainerTimeOff")
      .select("*")
      .eq("trainerId", trainerId)
      .lte("startDate", endOfDay.toISOString())
      .gte("endDate", startOfDay.toISOString());

    // Generate available slots
    const availableSlots: string[] = [];

    for (const avail of availability) {
      const [startHour, startMinute] = avail.startTime.split(":").map(Number);
      const [endHour, endMinute] = avail.endTime.split(":").map(Number);

      let currentTime = new Date(targetDate);
      currentTime.setHours(startHour, startMinute, 0, 0);

      const endTime = new Date(targetDate);
      endTime.setHours(endHour, endMinute, 0, 0);

      // Generate slots in 30-minute increments
      while (currentTime < endTime) {
        const slotEnd = new Date(currentTime.getTime() + duration * 60000);

        // Check if slot end time is within availability hours
        if (slotEnd <= endTime) {
          // Check if slot is available (no conflicts)
          if (
            isSlotAvailable(
              currentTime,
              slotEnd,
              existingSessions || [],
              timeOff || [],
            )
          ) {
            availableSlots.push(currentTime.toISOString());
          }
        }

        // Move to next slot (30 min increment)
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
      }
    }

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 },
    );
  }
}
