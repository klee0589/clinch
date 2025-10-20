import { PrismaClient, UserRole, MuayThaiStyle, ExperienceLevel, SessionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.session.deleteMany();
  await prisma.trainerGym.deleteMany();
  await prisma.traineeProfile.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.gymProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👤 Creating users...');

  // Trainers
  const trainer1 = await prisma.user.create({
    data: {
      clerkId: 'trainer_clerk_1',
      email: 'samart@muaythai.com',
      firstName: 'Samart',
      lastName: 'Payakaroon',
      role: UserRole.TRAINER,
      imageUrl: 'https://example.com/samart.jpg',
    },
  });

  const trainer2 = await prisma.user.create({
    data: {
      clerkId: 'trainer_clerk_2',
      email: 'buakaw@muaythai.com',
      firstName: 'Buakaw',
      lastName: 'Banchamek',
      role: UserRole.TRAINER,
      imageUrl: 'https://example.com/buakaw.jpg',
    },
  });

  const trainer3 = await prisma.user.create({
    data: {
      clerkId: 'trainer_clerk_3',
      email: 'ramon@dekkers.com',
      firstName: 'Ramon',
      lastName: 'Dekkers',
      role: UserRole.TRAINER,
      imageUrl: 'https://example.com/ramon.jpg',
    },
  });

  // Gym Owners
  const gymOwner1 = await prisma.user.create({
    data: {
      clerkId: 'gym_clerk_1',
      email: 'owner@yokkao.com',
      firstName: 'Yokkao',
      lastName: 'Gym',
      role: UserRole.GYM_OWNER,
    },
  });

  const gymOwner2 = await prisma.user.create({
    data: {
      clerkId: 'gym_clerk_2',
      email: 'owner@fairtex.com',
      firstName: 'Fairtex',
      lastName: 'Training',
      role: UserRole.GYM_OWNER,
    },
  });

  // Trainees
  const trainee1 = await prisma.user.create({
    data: {
      clerkId: 'trainee_clerk_1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Smith',
      role: UserRole.TRAINEE,
    },
  });

  const trainee2 = await prisma.user.create({
    data: {
      clerkId: 'trainee_clerk_2',
      email: 'sarah@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.TRAINEE,
    },
  });

  const trainee3 = await prisma.user.create({
    data: {
      clerkId: 'trainee_clerk_3',
      email: 'mike@example.com',
      firstName: 'Mike',
      lastName: 'Chen',
      role: UserRole.TRAINEE,
    },
  });

  // Create trainer profiles
  console.log('🥊 Creating trainer profiles...');

  const trainerProfile1 = await prisma.trainerProfile.create({
    data: {
      userId: trainer1.id,
      bio: 'Legendary Thai boxer and trainer with over 30 years of experience. Known for technical precision and the "femur" style of fighting.',
      specialties: [MuayThaiStyle.TRADITIONAL, MuayThaiStyle.GOLDEN_AGE],
      experienceYears: 30,
      certifications: ['IFMA Master Trainer', 'WMC Certified'],
      hourlyRate: 150,
      currency: 'USD',
      city: 'Bangkok',
      state: 'Bangkok',
      country: 'Thailand',
      availableForOnline: true,
      totalSessions: 500,
      averageRating: 4.9,
    },
  });

  const trainerProfile2 = await prisma.trainerProfile.create({
    data: {
      userId: trainer2.id,
      bio: 'Professional Muay Thai champion specializing in modern competitive techniques and conditioning.',
      specialties: [MuayThaiStyle.MODERN, MuayThaiStyle.TRADITIONAL],
      experienceYears: 25,
      certifications: ['IFMA Certified', 'K-1 Champion'],
      hourlyRate: 200,
      currency: 'USD',
      city: 'Pattaya',
      state: 'Chonburi',
      country: 'Thailand',
      availableForOnline: true,
      totalSessions: 750,
      averageRating: 5.0,
    },
  });

  const trainerProfile3 = await prisma.trainerProfile.create({
    data: {
      userId: trainer3.id,
      bio: 'Dutch kickboxing legend who brought Dutch-style Muay Thai to the world. Expert in aggressive, combination-based fighting.',
      specialties: [MuayThaiStyle.DUTCH, MuayThaiStyle.MODERN],
      experienceYears: 20,
      certifications: ['Dutch Kickboxing Federation Certified'],
      hourlyRate: 175,
      currency: 'USD',
      city: 'Amsterdam',
      state: 'North Holland',
      country: 'Netherlands',
      availableForOnline: true,
      totalSessions: 600,
      averageRating: 4.8,
    },
  });

  // Create gym profiles
  console.log('🏛️ Creating gym profiles...');

  const gymProfile1 = await prisma.gymProfile.create({
    data: {
      userId: gymOwner1.id,
      name: 'Yokkao Training Center Bangkok',
      description: 'World-class Muay Thai training facility with traditional Thai atmosphere and modern amenities.',
      phoneNumber: '+66-2-123-4567',
      website: 'https://yokkao.com',
      address: '123 Sukhumvit Road',
      city: 'Bangkok',
      state: 'Bangkok',
      country: 'Thailand',
      zipCode: '10110',
      latitude: 13.7563,
      longitude: 100.5018,
      amenities: ['Traditional Ring', 'Western Boxing Ring', 'Showers', 'Locker Room', 'Sauna', 'Pro Shop', 'Cafe'],
      photos: [
        'https://example.com/yokkao1.jpg',
        'https://example.com/yokkao2.jpg',
      ],
      membershipFee: 150,
      dropInFee: 30,
      currency: 'USD',
      averageRating: 4.8,
    },
  });

  const gymProfile2 = await prisma.gymProfile.create({
    data: {
      userId: gymOwner2.id,
      name: 'Fairtex Muay Thai Training Center',
      description: 'Premier training facility with professional fighters and world-class coaches. Perfect for serious practitioners.',
      phoneNumber: '+66-38-123-456',
      website: 'https://fairtex.com',
      address: '456 Beach Road',
      city: 'Pattaya',
      state: 'Chonburi',
      country: 'Thailand',
      zipCode: '20150',
      latitude: 12.9236,
      longitude: 100.8825,
      amenities: ['Multiple Rings', 'Strength & Conditioning Room', 'Swimming Pool', 'Accommodation', 'Restaurant', 'Physical Therapy'],
      photos: [
        'https://example.com/fairtex1.jpg',
        'https://example.com/fairtex2.jpg',
        'https://example.com/fairtex3.jpg',
      ],
      membershipFee: 200,
      dropInFee: 40,
      currency: 'USD',
      averageRating: 4.9,
    },
  });

  // Link trainers to gyms
  console.log('🔗 Linking trainers to gyms...');

  await prisma.trainerGym.create({
    data: {
      trainerId: trainerProfile1.id,
      gymId: gymProfile1.id,
    },
  });

  await prisma.trainerGym.create({
    data: {
      trainerId: trainerProfile2.id,
      gymId: gymProfile2.id,
    },
  });

  // Create trainee profiles
  console.log('👥 Creating trainee profiles...');

  const traineeProfile1 = await prisma.traineeProfile.create({
    data: {
      userId: trainee1.id,
      experienceLevel: ExperienceLevel.BEGINNER,
      goals: 'Learn the fundamentals of Muay Thai for fitness and self-defense',
      injuries: 'Previous shoulder injury (recovered)',
      preferredStyles: [MuayThaiStyle.FITNESS, MuayThaiStyle.TRADITIONAL],
      budget: 75,
      currency: 'USD',
      city: 'New York',
      state: 'NY',
      country: 'USA',
    },
  });

  const traineeProfile2 = await prisma.traineeProfile.create({
    data: {
      userId: trainee2.id,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      goals: 'Prepare for first amateur fight and improve clinch work',
      preferredStyles: [MuayThaiStyle.MODERN, MuayThaiStyle.DUTCH],
      budget: 120,
      currency: 'USD',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
    },
  });

  const traineeProfile3 = await prisma.traineeProfile.create({
    data: {
      userId: trainee3.id,
      experienceLevel: ExperienceLevel.ADVANCED,
      goals: 'Refine technique and strategy for upcoming professional bout',
      preferredStyles: [MuayThaiStyle.TRADITIONAL, MuayThaiStyle.GOLDEN_AGE],
      budget: 200,
      currency: 'USD',
      city: 'Bangkok',
      state: 'Bangkok',
      country: 'Thailand',
    },
  });

  // Create sessions
  console.log('📅 Creating training sessions...');

  const now = new Date();
  const futureDate1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
  const futureDate2 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks from now
  const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago

  await prisma.session.create({
    data: {
      trainerId: trainerProfile1.id,
      traineeId: traineeProfile1.id,
      scheduledAt: futureDate1,
      duration: 60,
      status: SessionStatus.CONFIRMED,
      price: 150,
      currency: 'USD',
      isOnline: true,
      notes: 'Focus on basic stance and footwork',
      paid: true,
    },
  });

  await prisma.session.create({
    data: {
      trainerId: trainerProfile2.id,
      traineeId: traineeProfile2.id,
      scheduledAt: futureDate2,
      duration: 90,
      status: SessionStatus.PENDING,
      price: 200,
      currency: 'USD',
      location: 'Fairtex Muay Thai Training Center',
      isOnline: false,
      notes: 'Advanced clinch techniques and sparring',
      paid: false,
    },
  });

  const completedSession = await prisma.session.create({
    data: {
      trainerId: trainerProfile3.id,
      traineeId: traineeProfile3.id,
      scheduledAt: pastDate,
      duration: 120,
      status: SessionStatus.COMPLETED,
      price: 175,
      currency: 'USD',
      isOnline: true,
      notes: 'Private session focusing on Dutch combinations',
      paid: true,
    },
  });

  // Create reviews
  console.log('⭐ Creating reviews...');

  await prisma.review.create({
    data: {
      trainerId: trainerProfile3.id,
      traineeId: traineeProfile3.id,
      rating: 5,
      comment: 'Incredible session! Ramon\'s teaching style is clear and effective. Learned more in one session than I did in months of regular training.',
    },
  });

  await prisma.review.create({
    data: {
      trainerId: trainerProfile1.id,
      traineeId: traineeProfile1.id,
      rating: 5,
      comment: 'Samart is a legend and it shows. Very patient with beginners and provides excellent technical feedback.',
    },
  });

  await prisma.review.create({
    data: {
      gymId: gymProfile1.id,
      traineeId: traineeProfile2.id,
      rating: 5,
      comment: 'Amazing facility with great atmosphere. The trainers are world-class and the equipment is top-notch.',
    },
  });

  await prisma.review.create({
    data: {
      gymId: gymProfile2.id,
      traineeId: traineeProfile3.id,
      rating: 5,
      comment: 'Best Muay Thai gym I\'ve ever trained at. Perfect for serious fighters looking to take their skills to the next level.',
    },
  });

  // Create messages
  console.log('💬 Creating messages...');

  await prisma.message.create({
    data: {
      senderId: trainee1.id,
      receiverId: trainer1.id,
      content: 'Hi Samart, I\'m interested in booking a session with you. Are you available next week?',
      read: true,
    },
  });

  await prisma.message.create({
    data: {
      senderId: trainer1.id,
      receiverId: trainee1.id,
      content: 'Hello! Yes, I have availability next week. What days work best for you?',
      read: false,
    },
  });

  await prisma.message.create({
    data: {
      senderId: trainee2.id,
      receiverId: trainer2.id,
      content: 'Looking forward to our session next week! Should I bring my own gear?',
      read: true,
    },
  });

  await prisma.message.create({
    data: {
      senderId: trainer2.id,
      receiverId: trainee2.id,
      content: 'Great! Yes, please bring your gloves, shin guards, and hand wraps. See you then!',
      read: false,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Users: ${await prisma.user.count()}`);
  console.log(`   Trainer Profiles: ${await prisma.trainerProfile.count()}`);
  console.log(`   Gym Profiles: ${await prisma.gymProfile.count()}`);
  console.log(`   Trainee Profiles: ${await prisma.traineeProfile.count()}`);
  console.log(`   Sessions: ${await prisma.session.count()}`);
  console.log(`   Reviews: ${await prisma.review.count()}`);
  console.log(`   Messages: ${await prisma.message.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
