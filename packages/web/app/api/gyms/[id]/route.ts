import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@clinch/database';
import { updateGymProfileSchema } from '@clinch/shared';

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
    const { id } = await params;

    const gym = await prisma.gymProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        trainers: {
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
          },
        },
        reviews: {
          include: {
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
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!gym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(gym);
  } catch (error) {
    console.error('Error fetching gym:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gym' },
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

    // Validate request body
    const validatedData = updateGymProfileSchema.parse(body);

    // Verify ownership
    const gym = await prisma.gymProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!gym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }

    if (gym.user.clerkId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own gym' },
        { status: 403 }
      );
    }

    // Update gym profile
    const updatedGym = await prisma.gymProfile.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(updatedGym);
  } catch (error) {
    console.error('Error updating gym:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid gym data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update gym' },
      { status: 500 }
    );
  }
}
