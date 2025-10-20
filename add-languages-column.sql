-- Add languages column to TrainerProfile table
-- Run this in Supabase SQL Editor

ALTER TABLE "TrainerProfile"
ADD COLUMN IF NOT EXISTS "languages" TEXT[];

-- Update the updatedAt timestamp
UPDATE "TrainerProfile"
SET "updatedAt" = CURRENT_TIMESTAMP
WHERE "languages" IS NULL;
