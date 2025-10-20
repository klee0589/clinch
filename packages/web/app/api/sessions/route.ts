import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@clinch/database';
import { createSessionSchema } from '@clinch/shared';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Convert scheduledAt string to Date if needed
    if (body.scheduledAt && typeof body.scheduledAt === 'string') {
      body.scheduledAt = new Date(body.scheduledAt);
    }

    // Validate request body
    const validatedData = createSessionSchema.parse(body);

    // Verify the user is authorized to create this session
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        traineeProfile: true,
        trainerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the user is either the trainer or trainee in this session
    const isTrainee = user.traineeProfile?.id === validatedData.traineeId;
    const isTrainer = user.trainerProfile?.id === validatedData.trainerId;

    if (!isTrainee && !isTrainer) {
      return NextResponse.json(
        { error: 'Forbidden: You can only create sessions for yourself' },
        { status: 403 }
      );
    }

    // Check trainer exists
    const trainer = await prisma.trainerProfile.findUnique({
      where: { id: validatedData.trainerId },
    });

    if (!trainer) {
      return NextResponse.json(
        { error: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Check trainee exists
    const trainee = await prisma.traineeProfile.findUnique({
      where: { id: validatedData.traineeId },
    });

    if (!trainee) {
      return NextResponse.json(
        { error: 'Trainee not found' },
        { status: 404 }
      );
    }

    // Create session
    const session = await prisma.session.create({
      data: validatedData,
      include: {
        trainer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
        },
        trainee: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid session data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        traineeProfile: true,
        trainerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    // Get sessions for trainer or trainee
    if (user.trainerProfile) {
      where.trainerId = user.trainerProfile.id;
    } else if (user.traineeProfile) {
      where.traineeId = user.traineeProfile.id;
    } else {
      return NextResponse.json([]);
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        trainer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
        },
        trainee: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
