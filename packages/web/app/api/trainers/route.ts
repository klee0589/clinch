import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@clinch/database';
import { trainerSearchSchema } from '@clinch/shared';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build search query
    const searchQuery: any = {
      city: searchParams.get('city') || undefined,
      state: searchParams.get('state') || undefined,
      specialties: searchParams.get('specialties')?.split(',') || undefined,
      minRate: searchParams.get('minRate') ? Number(searchParams.get('minRate')) : undefined,
      maxRate: searchParams.get('maxRate') ? Number(searchParams.get('maxRate')) : undefined,
      availableForOnline: searchParams.get('availableForOnline') === 'true' ? true : undefined,
      minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    };

    // Remove undefined fields
    Object.keys(searchQuery).forEach(key =>
      searchQuery[key] === undefined && delete searchQuery[key]
    );

    // Validate search parameters
    const validatedSearch = trainerSearchSchema.parse(searchQuery);

    // Build Prisma where clause
    const where: any = {};

    if (validatedSearch.city) {
      where.city = { contains: validatedSearch.city, mode: 'insensitive' };
    }

    if (validatedSearch.state) {
      where.state = { contains: validatedSearch.state, mode: 'insensitive' };
    }

    if (validatedSearch.specialties && validatedSearch.specialties.length > 0) {
      where.specialties = { hasSome: validatedSearch.specialties };
    }

    if (validatedSearch.minRate !== undefined || validatedSearch.maxRate !== undefined) {
      where.hourlyRate = {};
      if (validatedSearch.minRate !== undefined) {
        where.hourlyRate.gte = validatedSearch.minRate;
      }
      if (validatedSearch.maxRate !== undefined) {
        where.hourlyRate.lte = validatedSearch.maxRate;
      }
    }

    if (validatedSearch.availableForOnline !== undefined) {
      where.availableForOnline = validatedSearch.availableForOnline;
    }

    if (validatedSearch.minRating !== undefined) {
      where.averageRating = { gte: validatedSearch.minRating };
    }

    // Fetch trainers
    const trainers = await prisma.trainerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            email: true,
          },
        },
        gyms: {
          include: {
            gym: {
              select: {
                name: true,
                city: true,
                state: true,
                country: true,
              },
            },
          },
        },
      },
      orderBy: [
        { averageRating: 'desc' },
        { totalSessions: 'desc' },
      ],
    });

    return NextResponse.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch trainers' },
      { status: 500 }
    );
  }
}
