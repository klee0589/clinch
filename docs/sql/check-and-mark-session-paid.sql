-- Check sessions for your trainer account
-- Run this in Supabase SQL Editor

-- Step 1: Find your trainer profile ID
SELECT
  tp.id as trainer_id,
  u."firstName",
  u."lastName",
  u.email
FROM "TrainerProfile" tp
JOIN "User" u ON tp."userId" = u."clerkId"
WHERE u."clerkId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx';

-- Step 2: Check all sessions where you are the trainer
SELECT
  s.id,
  s."trainerId",
  s."traineeId",
  s."scheduledAt",
  s.status,
  s."paymentStatus",
  s.paid,
  trainee."firstName" || ' ' || trainee."lastName" as trainee_name
FROM "Session" s
JOIN "TrainerProfile" tp ON s."trainerId" = tp.id
JOIN "TraineeProfile" traineeProf ON s."traineeId" = traineeProf.id
JOIN "User" trainee ON traineeProf."userId" = trainee."clerkId"
WHERE tp."userId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx'
ORDER BY s."scheduledAt" DESC;

-- Step 3: (OPTIONAL) Mark a session as PAID for testing
-- Uncomment and replace 'session_id_here' with an actual session ID from Step 2
/*
UPDATE "Session"
SET
  "paymentStatus" = 'PAID',
  paid = true,
  status = 'CONFIRMED',
  "updatedAt" = NOW()
WHERE id = 'session_id_here';
*/

-- Step 4: Verify the update
SELECT
  s.id,
  s."paymentStatus",
  s.paid,
  s.status,
  trainee."firstName" || ' ' || trainee."lastName" as trainee_name
FROM "Session" s
JOIN "TrainerProfile" tp ON s."trainerId" = tp.id
JOIN "TraineeProfile" traineeProf ON s."traineeId" = traineeProf.id
JOIN "User" trainee ON traineeProf."userId" = trainee."clerkId"
WHERE tp."userId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx'
  AND s."paymentStatus" = 'PAID';
