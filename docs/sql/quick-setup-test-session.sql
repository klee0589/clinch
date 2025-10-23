-- Quick Setup: Create Test Session for Trainee Profile Feature
-- Run this in Supabase SQL Editor

-- Step 1: Verify your trainer profile ID
SELECT
  tp.id as trainer_profile_id,
  u."firstName",
  u."lastName"
FROM "TrainerProfile" tp
JOIN "User" u ON tp."userId" = u."clerkId"
WHERE u."clerkId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx';

-- Step 2: Check which users have trainee profiles
SELECT
  tp.id as trainee_profile_id,
  tp."userId" as user_clerk_id,
  u.email,
  u."firstName",
  u."lastName"
FROM "TraineeProfile" tp
JOIN "User" u ON tp."userId" = u."clerkId"
WHERE u."clerkId" IN (
  'user_34SD8wNvzJxGJuYwGWceSmpIcsv',
  'user_34LRPb0QwVBK3wHfwqb0jJ0BieH',
  'trainee_clerk_1',
  'trainee_clerk_2',
  'trainee_clerk_3'
)
ORDER BY tp."createdAt" DESC;

-- Step 3: Create trainee profile if needed for user_34SD8wNvzJxGJuYwGWceSmpIcsv
-- (Only run if Step 2 shows no trainee profile for this user)
/*
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
  'user_34SD8wNvzJxGJuYwGWceSmpIcsv',
  ARRAY['Fitness', 'Technique'],
  'Beginner',
  'Average',
  NOW(),
  NOW()
)
ON CONFLICT ("userId") DO NOTHING
RETURNING *;
*/

-- Step 4: Create a PAID test session
-- Replace the IDs below after running Steps 1 and 2
/*
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
  'session_test_' || substr(md5(random()::text), 1, 16),
  'PASTE_TRAINER_PROFILE_ID_FROM_STEP_1',
  'PASTE_TRAINEE_PROFILE_ID_FROM_STEP_2',
  NOW() - INTERVAL '3 days',
  60,
  'Test Gym',
  'Test session for trainee profile feature',
  'COMPLETED',
  'PAID',
  true,
  100.00,
  NOW(),
  NOW()
)
RETURNING *;
*/

-- Step 5: Verify the session was created
/*
SELECT
  s.id,
  s."paymentStatus",
  s.paid,
  trainee."firstName" || ' ' || trainee."lastName" as trainee_name
FROM "Session" s
JOIN "TrainerProfile" tp ON s."trainerId" = tp.id
JOIN "TraineeProfile" traineeProf ON s."traineeId" = traineeProf.id
JOIN "User" trainee ON traineeProf."userId" = trainee."clerkId"
WHERE tp."userId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx'
  AND s."paymentStatus" = 'PAID';
*/
