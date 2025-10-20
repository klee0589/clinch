-- Check the booking you just created
SELECT
  s.id AS session_id,
  s.status,
  s."scheduledAt",
  s.duration,
  s.price,
  s."isOnline",
  s.location,
  s.notes,
  s."createdAt",
  -- Trainee info
  trainee_user."firstName" AS trainee_first_name,
  trainee_user."lastName" AS trainee_last_name,
  trainee_user.email AS trainee_email,
  -- Trainer info
  trainer_user."firstName" AS trainer_first_name,
  trainer_user."lastName" AS trainer_last_name,
  trainer_user.email AS trainer_email
FROM "Session" s
-- Join trainee profile and user
JOIN "TraineeProfile" trainee_profile ON s."traineeId" = trainee_profile.id
JOIN "User" trainee_user ON trainee_profile."userId" = trainee_user.id
-- Join trainer profile and user
JOIN "TrainerProfile" trainer_profile ON s."trainerId" = trainer_profile.id
JOIN "User" trainer_user ON trainer_profile."userId" = trainer_user.id
WHERE s."trainerId" = 'trainer_2'  -- Buakaw's trainer ID
ORDER BY s."createdAt" DESC
LIMIT 5;
