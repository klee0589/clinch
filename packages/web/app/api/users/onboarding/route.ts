import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
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

    // Get user info from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || '';
    const firstName = clerkUser.firstName || '';
    const lastName = clerkUser.lastName || '';
    const imageUrl = clerkUser.imageUrl || null;

    const body = await request.json();
    const { role } = body;

    if (!role || !['TRAINEE', 'TRAINER', 'GYM_OWNER'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('User')
      .select('*')
      .eq('clerkId', userId)
      .single();

    let user;

    if (existingUser) {
      // Update existing user's role
      const { data: updatedUser, error: updateError } = await supabase
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

      user = updatedUser;
    } else {
      // Create new user with role
      const { data: newUser, error: createError } = await supabase
        .from('User')
        .insert({
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          clerkId: userId,
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          imageUrl,
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json(
          { error: 'Failed to create user', details: createError.message },
          { status: 500 }
        );
      }

      user = newUser;
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
