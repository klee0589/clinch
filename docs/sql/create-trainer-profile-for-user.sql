-- Create Trainer Profile for existing user
-- Run this in Supabase SQL Editor

-- First, let's check if user exists and their role
SELECT id, "clerkId", email, "firstName", "lastName", role
FROM "User"
WHERE "clerkId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx';

-- Create trainer profile
-- Replace 'user_id_here' with the actual user.id from the query above
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
  'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx', -- This should match the User.id
  'Experienced Muay Thai trainer',
  100.00,
  5,
  ARRAY['Traditional', 'Modern'],
  ARRAY['Certified Muay Thai Instructor'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT ("userId") DO NOTHING;

-- Verify it was created
SELECT * FROM "TrainerProfile" WHERE "userId" = 'user_34LYb8AZ0oTE3z1q7JcTAZ3nEBx';
