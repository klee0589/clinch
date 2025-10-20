-- Create test user accounts for the seed trainers so you can sign in as them
-- These users will have Clerk IDs that you can use to sign in via Clerk

-- Note: You'll need to manually create these accounts in Clerk first, then update the clerkId here
-- Or, we can create dummy users with fake Clerk IDs for development

-- For now, let's just check which trainers exist and what users they're linked to
SELECT
  tp.id AS trainer_profile_id,
  u.id AS user_id,
  u."clerkId",
  u.email,
  u."firstName",
  u."lastName",
  tp."experienceYears",
  tp."hourlyRate"
FROM "TrainerProfile" tp
JOIN "User" u ON tp."userId" = u.id
ORDER BY tp."createdAt";

-- If you want to test as one of the seed trainers (Samart, Buakaw, or Ramon),
-- you have two options:

-- OPTION 1: Create a new Clerk account and link it to an existing trainer
-- 1. Sign up with a new email in Clerk (e.g., samart@test.com)
-- 2. Get the Clerk ID from the new account
-- 3. Run this SQL to update the user:
/*
UPDATE "User"
SET
  "clerkId" = 'YOUR_NEW_CLERK_ID_HERE',
  email = 'samart@test.com',
  "updatedAt" = NOW()
WHERE id = 'user_1';  -- Replace with actual user ID of Samart
*/

-- OPTION 2: Create a completely new trainer account
-- This is easier - just sign up normally and select TRAINER role in onboarding
-- You'll automatically get a new trainer profile created
