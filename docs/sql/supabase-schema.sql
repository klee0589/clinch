-- Clinch Database Schema for Supabase
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zzxfdjoxddjmzhhytxzx/editor

-- Create ENUM types
CREATE TYPE "UserRole" AS ENUM ('TRAINEE', 'TRAINER', 'GYM_OWNER', 'ADMIN');
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL');
CREATE TYPE "MuayThaiStyle" AS ENUM ('TRADITIONAL', 'DUTCH', 'GOLDEN_AGE', 'MODERN', 'FITNESS');

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "UserRole" NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create TrainerProfile table
CREATE TABLE "TrainerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "specialties" "MuayThaiStyle"[],
    "experienceYears" INTEGER,
    "certifications" TEXT[],
    "hourlyRate" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "availableForOnline" BOOLEAN NOT NULL DEFAULT false,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerProfile_pkey" PRIMARY KEY ("id")
);

-- Create GymProfile table
CREATE TABLE "GymProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "phoneNumber" TEXT,
    "website" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "amenities" TEXT[],
    "photos" TEXT[],
    "membershipFee" DOUBLE PRECISION,
    "dropInFee" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "averageRating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymProfile_pkey" PRIMARY KEY ("id")
);

-- Create TraineeProfile table
CREATE TABLE "TraineeProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experienceLevel" "ExperienceLevel",
    "goals" TEXT,
    "injuries" TEXT,
    "preferredStyles" "MuayThaiStyle"[],
    "budget" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TraineeProfile_pkey" PRIMARY KEY ("id")
);

-- Create TrainerGym table (many-to-many relationship)
CREATE TABLE "TrainerGym" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainerGym_pkey" PRIMARY KEY ("id")
);

-- Create Session table
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "traineeId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'PENDING',
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- Create Message table
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- Create Review table
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT,
    "gymId" TEXT,
    "traineeId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "TrainerProfile_userId_key" ON "TrainerProfile"("userId");
CREATE UNIQUE INDEX "GymProfile_userId_key" ON "GymProfile"("userId");
CREATE UNIQUE INDEX "TraineeProfile_userId_key" ON "TraineeProfile"("userId");
CREATE UNIQUE INDEX "TrainerGym_trainerId_gymId_key" ON "TrainerGym"("trainerId", "gymId");

-- Create regular indexes for performance
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "TrainerProfile_city_state_idx" ON "TrainerProfile"("city", "state");
CREATE INDEX "TrainerProfile_averageRating_idx" ON "TrainerProfile"("averageRating");
CREATE INDEX "GymProfile_city_state_idx" ON "GymProfile"("city", "state");
CREATE INDEX "GymProfile_averageRating_idx" ON "GymProfile"("averageRating");
CREATE INDEX "TraineeProfile_city_state_idx" ON "TraineeProfile"("city", "state");
CREATE INDEX "TrainerGym_trainerId_idx" ON "TrainerGym"("trainerId");
CREATE INDEX "TrainerGym_gymId_idx" ON "TrainerGym"("gymId");
CREATE INDEX "Session_trainerId_scheduledAt_idx" ON "Session"("trainerId", "scheduledAt");
CREATE INDEX "Session_traineeId_scheduledAt_idx" ON "Session"("traineeId", "scheduledAt");
CREATE INDEX "Session_status_idx" ON "Session"("status");
CREATE INDEX "Message_senderId_receiverId_idx" ON "Message"("senderId", "receiverId");
CREATE INDEX "Message_receiverId_read_idx" ON "Message"("receiverId", "read");
CREATE INDEX "Review_trainerId_idx" ON "Review"("trainerId");
CREATE INDEX "Review_gymId_idx" ON "Review"("gymId");
CREATE INDEX "Review_traineeId_idx" ON "Review"("traineeId");

-- Add foreign key constraints
ALTER TABLE "TrainerProfile" ADD CONSTRAINT "TrainerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GymProfile" ADD CONSTRAINT "GymProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraineeProfile" ADD CONSTRAINT "TraineeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainerGym" ADD CONSTRAINT "TrainerGym_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainerGym" ADD CONSTRAINT "TrainerGym_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "GymProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "TraineeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "GymProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "TraineeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Success message
SELECT 'Database schema created successfully! ✅' as message;
