import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@clinch/database';
import { createTraineeProfileSchema } from '@clinch/shared';

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

    // Check if trainee profile already exists
    const existingProfile = await prisma.traineeProfile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Trainee profile already exists' },
        { status: 409 }
      );
    }

    // Add userId to body
    body.userId = user.id;

    // Validate request body
    const validatedData = createTraineeProfileSchema.parse(body);

    // Create trainee profile
    const traineeProfile = await prisma.traineeProfile.create({
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

    return NextResponse.json(traineeProfile, { status: 201 });
  } catch (error) {
    console.error('Error creating trainee profile:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid trainee profile data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create trainee profile' },
      { status: 500 }
    );
  }
}
