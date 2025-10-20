-- Add trainee profile for existing user to enable booking functionality
-- This allows trainers to also book sessions with other trainers

INSERT INTO "TraineeProfile" (
  id,
  "userId",
  goals,
  "experienceLevel",
  "createdAt",
  "updatedAt"
) VALUES (
  'trainee_' || EXTRACT(EPOCH FROM NOW())::bigint || '_' || substr(md5(random()::text), 1, 9),
  'user_1760992915751_f7p0emfq5',
  ARRAY['Learn technique', 'Get fit'],
  'BEGINNER',
  NOW(),
  NOW()
);

-- Verify the insert
SELECT
  tp.id,
  tp."userId",
  u."firstName",
  u."lastName",
  tp.goals,
  tp."experienceLevel"
FROM "TraineeProfile" tp
JOIN "User" u ON tp."userId" = u.id
WHERE tp."userId" = 'user_1760992915751_f7p0emfq5';
