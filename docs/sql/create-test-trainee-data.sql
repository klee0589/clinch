-- Create Test Data for Trainee Profile Feature
-- Run this in Supabase SQL Editor

-- Step 1: Verify your trainer profile exists
SELECT
  tp.id as trainer_id,
  u."firstName",
  u."lastName",
  u.email
FROM "TrainerProfile" tp
JOIN "User" u ON tp."userId" = u."clerkId"
WHERE u."clerkId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx';

-- Step 2: Check if you have any users in the system (potential trainees)
SELECT
  "clerkId",
  email,
  "firstName",
  "lastName",
  role
FROM "User"
ORDER BY "createdAt" DESC
LIMIT 10;

-- Step 3: Check if any of those users have trainee profiles
SELECT
  tp.id,
  tp."userId",
  u.email,
  u."firstName",
  u."lastName"
FROM "TraineeProfile" tp
JOIN "User" u ON tp."userId" = u."clerkId"
ORDER BY tp."createdAt" DESC
LIMIT 10;

-- ====================================================================
-- If you need to create a test trainee, uncomment and run the following:
-- ====================================================================

/*
-- OPTION A: If you have another user account, create a trainee profile for them
-- Replace 'other_user_clerk_id' with the actual Clerk ID from Step 2
INSERT INTO "TraineeProfile" (
  id,
  "userId",
  goals,
  "experienceLevel",
  "fitnessLevel",
  "createdAt",
  "updatedAt"
)
VALUES (
  'trainee_' || EXTRACT(EPOCH FROM NOW())::bigint || '_' || substr(md5(random()::text), 1, 8),
  'other_user_clerk_id',  -- REPLACE THIS with actual Clerk ID
  ARRAY['Fitness', 'Technique'],
  'Beginner',
  'Average',
  NOW(),
  NOW()
)
ON CONFLICT ("userId") DO NOTHING;
*/

/*
-- OPTION B: Create a completely new test user and trainee profile
-- (Use this if you don't have a second account)
INSERT INTO "User" (
  id,
  "clerkId",
  email,
  "firstName",
  "lastName",
  role,
  "createdAt",
  "updatedAt"
)
VALUES (
  'user_' || EXTRACT(EPOCH FROM NOW())::bigint || '_' || substr(md5(random()::text), 1, 8),
  'test_trainee_' || substr(md5(random()::text), 1, 12),
  'test.trainee@example.com',
  'Test',
  'Trainee',
  'trainee',
  NOW(),
  NOW()
)
RETURNING *;

-- After creating the user above, copy the "clerkId" and use it below
INSERT INTO "TraineeProfile" (
  id,
  "userId",
  goals,
  "experienceLevel",
  "fitnessLevel",
  "createdAt",
  "updatedAt"
)
VALUES (
  'trainee_' || EXTRACT(EPOCH FROM NOW())::bigint || '_' || substr(md5(random()::text), 1, 8),
  'PASTE_CLERK_ID_FROM_ABOVE_HERE',  -- REPLACE THIS
  ARRAY['Fitness', 'Technique', 'Weight Loss'],
  'Beginner',
  'Average',
  NOW(),
  NOW()
)
RETURNING *;
*/

-- ====================================================================
-- Step 4: Create a test session between trainer and trainee
-- ====================================================================

/*
-- Uncomment and run this after you have both trainer and trainee profiles
-- Replace the IDs below with actual IDs from your database

INSERT INTO "Session" (
  id,
  "trainerId",
  "traineeId",
  "scheduledAt",
  duration,
  location,
  notes,
  status,
  "paymentStatus",
  paid,
  price,
  "createdAt",
  "updatedAt"
)
VALUES (
  'session_' || EXTRACT(EPOCH FROM NOW())::bigint || '_' || substr(md5(random()::text), 1, 8),
  'PASTE_TRAINER_PROFILE_ID_HERE',  -- From Step 1
  'PASTE_TRAINEE_PROFILE_ID_HERE',  -- From Step 3 or after creating trainee
  NOW() - INTERVAL '2 days',  -- Session was 2 days ago
  60,  -- 60 minutes
  'Downtown Gym',
  'First training session - basics',
  'COMPLETED',
  'PAID',  -- Mark as PAID so it shows up
  true,
  100.00,
  NOW(),
  NOW()
)
RETURNING *;
*/

-- ====================================================================
-- Step 5: Verify the session was created with PAID status
-- ====================================================================

/*
SELECT
  s.id,
  s."trainerId",
  s."traineeId",
  s."scheduledAt",
  s.status,
  s."paymentStatus",
  s.paid,
  trainer."firstName" || ' ' || trainer."lastName" as trainer_name,
  trainee."firstName" || ' ' || trainee."lastName" as trainee_name
FROM "Session" s
JOIN "TrainerProfile" tp ON s."trainerId" = tp.id
JOIN "User" trainer ON tp."userId" = trainer."clerkId"
JOIN "TraineeProfile" traineeProf ON s."traineeId" = traineeProf.id
JOIN "User" trainee ON traineeProf."userId" = trainee."clerkId"
WHERE tp."userId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx'
ORDER BY s."scheduledAt" DESC;
*/
