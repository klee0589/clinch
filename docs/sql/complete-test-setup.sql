-- Complete Test Setup for Trainee Profile Feature
-- Run each section step by step in Supabase SQL Editor

-- ========================================
-- SECTION 1: Create Trainer Profile
-- ========================================

-- First check if trainer profile already exists
SELECT * FROM "TrainerProfile" WHERE "userId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx';

-- If no results above, create the trainer profile:
INSERT INTO "TrainerProfile" (
  id,
  "userId",
  bio,
  "hourlyRate",
  "experienceYears",
  specialties,
  certifications,
  "isAvailableForOnline",
  "createdAt",
  "updatedAt"
)
VALUES (
  'trainer_' || EXTRACT(EPOCH FROM NOW())::bigint || '_' || substr(md5(random()::text), 1, 8),
  'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx',
  'Experienced Muay Thai trainer',
  100.00,
  5,
  ARRAY['Traditional', 'Modern'],
  ARRAY['Certified Muay Thai Instructor'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT ("userId") DO NOTHING
RETURNING *;

-- ========================================
-- SECTION 2: Create Trainee Profiles
-- ========================================

-- Check existing trainee profiles
SELECT
  tp.id,
  tp."userId",
  u."firstName",
  u."lastName",
  u.email
FROM "TraineeProfile" tp
JOIN "User" u ON tp."userId" = u."clerkId";

-- Create trainee profile for user_34SD8wNvzJxGJuYwGWceSmpIcsv if needed
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
  ARRAY['Fitness', 'Weight Loss'],
  'Beginner',
  'Average',
  NOW(),
  NOW()
)
ON CONFLICT ("userId") DO NOTHING
RETURNING *;

-- Create trainee profile for user_34LRPb0QwVBK3wHfwqb0jJ0BieH if needed
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
  'user_34LRPb0QwVBK3wHfwqb0jJ0BieH',
  ARRAY['Technique', 'Competition'],
  'Intermediate',
  'Good',
  NOW(),
  NOW()
)
ON CONFLICT ("userId") DO NOTHING
RETURNING *;

-- ========================================
-- SECTION 3: Get IDs for Creating Session
-- ========================================

-- Get your trainer profile ID (copy this!)
SELECT
  tp.id as trainer_id,
  u."firstName" || ' ' || u."lastName" as name
FROM "TrainerProfile" tp
JOIN "User" u ON tp."userId" = u."clerkId"
WHERE u."clerkId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx';

-- Get trainee profile IDs (copy one of these!)
SELECT
  tp.id as trainee_id,
  u."firstName" || ' ' || u."lastName" as name,
  u.email
FROM "TraineeProfile" tp
JOIN "User" u ON tp."userId" = u."clerkId"
WHERE u."clerkId" IN (
  'user_34SD8wNvzJxGJuYwGWceSmpIcsv',
  'user_34LRPb0QwVBK3wHfwqb0jJ0BieH'
);

-- ========================================
-- SECTION 4: Create Test Sessions
-- ========================================

-- IMPORTANT: After running Section 3, copy the trainer_id and trainee_id
-- Then uncomment and run the INSERT below, replacing the placeholders

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
VALUES
  -- Session 1 (most recent)
  (
    'session_' || substr(md5(random()::text), 1, 20),
    'PASTE_TRAINER_ID_HERE',
    'PASTE_TRAINEE_ID_HERE',
    NOW() - INTERVAL '2 days',
    60,
    'Main Gym',
    'Great progress on technique',
    'COMPLETED',
    'PAID',
    true,
    100.00,
    NOW(),
    NOW()
  ),
  -- Session 2 (older)
  (
    'session_' || substr(md5(random()::text), 1, 20),
    'PASTE_TRAINER_ID_HERE',
    'PASTE_TRAINEE_ID_HERE',
    NOW() - INTERVAL '1 week',
    60,
    'Main Gym',
    'First session - basics',
    'COMPLETED',
    'PAID',
    true,
    100.00,
    NOW(),
    NOW()
  ),
  -- Session 3 (oldest)
  (
    'session_' || substr(md5(random()::text), 1, 20),
    'PASTE_TRAINER_ID_HERE',
    'PASTE_TRAINEE_ID_HERE',
    NOW() - INTERVAL '2 weeks',
    60,
    'Main Gym',
    'Consultation session',
    'COMPLETED',
    'PAID',
    true,
    100.00,
    NOW(),
    NOW()
  );
*/

-- ========================================
-- SECTION 5: Verify Everything Works
-- ========================================

-- Check all your trainees
SELECT
  trainee."firstName" || ' ' || trainee."lastName" as trainee_name,
  COUNT(s.id) as session_count,
  MAX(s."scheduledAt") as last_session
FROM "Session" s
JOIN "TrainerProfile" tp ON s."trainerId" = tp.id
JOIN "TraineeProfile" traineeProf ON s."traineeId" = traineeProf.id
JOIN "User" trainee ON traineeProf."userId" = trainee."clerkId"
WHERE tp."userId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx'
  AND s."paymentStatus" = 'PAID'
GROUP BY trainee."firstName", trainee."lastName";
