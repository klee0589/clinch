import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !['TRAINEE', 'TRAINER', 'GYM_OWNER'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Update user role in database
    const { data: user, error: updateError } = await supabase
      .from('User')
      .update({
        role,
        updatedAt: new Date().toISOString(),
      })
      .eq('clerkId', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user role:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user role', details: updateError.message },
        { status: 500 }
      );
    }

    // Create profile based on role
    if (role === 'TRAINER') {
      const { error: profileError } = await supabase
        .from('TrainerProfile')
        .insert({
          id: `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

      if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
        console.error('Error creating trainer profile:', profileError);
      }
    } else if (role === 'TRAINEE') {
      const { error: profileError } = await supabase
        .from('TraineeProfile')
        .insert({
          id: `trainee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

      if (profileError && profileError.code !== '23505') {
        console.error('Error creating trainee profile:', profileError);
      }
    } else if (role === 'GYM_OWNER') {
      // Note: GymProfile requires more fields, so we just mark role for now
      // User will complete profile setup on next page
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error in onboarding:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
