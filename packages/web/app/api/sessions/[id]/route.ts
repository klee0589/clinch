import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@clinch/database';
import { updateSessionSchema } from '@clinch/shared';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                imageUrl: true,
                email: true,
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
                email: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Verify user is part of this session
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

    const isTrainee = user.traineeProfile?.id === session.traineeId;
    const isTrainer = user.trainerProfile?.id === session.trainerId;

    if (!isTrainee && !isTrainer) {
      return NextResponse.json(
        { error: 'Forbidden: You can only view your own sessions' },
        { status: 403 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Convert scheduledAt string to Date if needed
    if (body.scheduledAt && typeof body.scheduledAt === 'string') {
      body.scheduledAt = new Date(body.scheduledAt);
    }

    // Validate request body
    const validatedData = updateSessionSchema.parse(body);

    // Get session and verify ownership
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        trainer: {
          include: { user: true },
        },
        trainee: {
          include: { user: true },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Verify user is part of this session
    const isTrainee = session.trainee.user.clerkId === userId;
    const isTrainer = session.trainer.user.clerkId === userId;

    if (!isTrainee && !isTrainer) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own sessions' },
        { status: 403 }
      );
    }

    // Update session
    const updatedSession = await prisma.session.update({
      where: { id },
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

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid session data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get session and verify ownership
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        trainer: {
          include: { user: true },
        },
        trainee: {
          include: { user: true },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Verify user is part of this session
    const isTrainee = session.trainee.user.clerkId === userId;
    const isTrainer = session.trainer.user.clerkId === userId;

    if (!isTrainee && !isTrainer) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own sessions' },
        { status: 403 }
      );
    }

    // Delete session
    await prisma.session.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
