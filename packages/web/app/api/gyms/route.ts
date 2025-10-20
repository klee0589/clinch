import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@clinch/database';
import { gymSearchSchema } from '@clinch/shared';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build search query
    const searchQuery: any = {
      city: searchParams.get('city') || undefined,
      state: searchParams.get('state') || undefined,
      amenities: searchParams.get('amenities')?.split(',') || undefined,
      minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    };

    // Remove undefined fields
    Object.keys(searchQuery).forEach(key =>
      searchQuery[key] === undefined && delete searchQuery[key]
    );

    // Validate search parameters
    const validatedSearch = gymSearchSchema.parse(searchQuery);

    // Build Prisma where clause
    const where: any = {};

    if (validatedSearch.city) {
      where.city = { contains: validatedSearch.city, mode: 'insensitive' };
    }

    if (validatedSearch.state) {
      where.state = { contains: validatedSearch.state, mode: 'insensitive' };
    }

    if (validatedSearch.amenities && validatedSearch.amenities.length > 0) {
      where.amenities = { hasSome: validatedSearch.amenities };
    }

    if (validatedSearch.minRating !== undefined) {
      where.averageRating = { gte: validatedSearch.minRating };
    }

    // Fetch gyms
    const gyms = await prisma.gymProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
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
      },
      orderBy: [
        { averageRating: 'desc' },
      ],
    });

    return NextResponse.json(gyms);
  } catch (error) {
    console.error('Error fetching gyms:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch gyms' },
      { status: 500 }
    );
  }
}
