import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { data: trainer, error } = await supabase
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
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching trainer:", error);
      return NextResponse.json(
        { error: "Trainer not found", details: error.message },
        { status: 404 },
      );
    }

    if (!trainer) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
    }

    return NextResponse.json(trainer);
  } catch (error) {
    console.error("Error fetching trainer:", error);
    return NextResponse.json(
      { error: "Failed to fetch trainer" },
      { status: 500 },
    );
  }
}
