import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build query
    let query = supabase
      .from('GymProfile')
      .select(`
        *,
        user:User!GymProfile_userId_fkey (
          id,
          firstName,
          lastName,
          imageUrl,
          email
        ),
        trainers:TrainerGym (
          trainer:TrainerProfile!TrainerGym_trainerId_fkey (
            id,
            bio,
            specialties,
            hourlyRate,
            averageRating,
            user:User!TrainerProfile_userId_fkey (
              firstName,
              lastName,
              imageUrl
            )
          )
        )
      `)
      .order('averageRating', { ascending: false });

    // Apply filters
    const city = searchParams.get('city');
    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    const state = searchParams.get('state');
    if (state) {
      query = query.ilike('state', `%${state}%`);
    }

    const minRating = searchParams.get('minRating');
    if (minRating) {
      query = query.gte('averageRating', parseFloat(minRating));
    }

    // Note: Amenities filtering would require a custom function or array contains operator
    const amenities = searchParams.get('amenities');
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      // Supabase supports array contains with @> operator
      query = query.contains('amenities', amenitiesArray);
    }

    const { data: gyms, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch gyms', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(gyms || []);
  } catch (error) {
    console.error('Error fetching gyms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gyms' },
      { status: 500 }
    );
  }
}
