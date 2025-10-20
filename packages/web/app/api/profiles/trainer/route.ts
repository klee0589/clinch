import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@clinch/database';
import { createTrainerProfileSchema } from '@clinch/shared';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if trainer profile already exists
    const existingProfile = await prisma.trainerProfile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Trainer profile already exists' },
        { status: 409 }
      );
    }

    // Add userId to body
    body.userId = user.id;

    // Validate request body
    const validatedData = createTrainerProfileSchema.parse(body);

    // Create trainer profile
    const trainerProfile = await prisma.trainerProfile.create({
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(trainerProfile, { status: 201 });
  } catch (error) {
    console.error('Error creating trainer profile:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid trainer profile data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create trainer profile' },
      { status: 500 }
    );
  }
}
