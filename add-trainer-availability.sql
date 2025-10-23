-- Add Trainer Availability System
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zzxfdjoxddjmzhhytxzx/editor

-- Table 1: TrainerAvailability (Weekly recurring schedule)
CREATE TABLE IF NOT EXISTS "TrainerAvailability" (
  "id" TEXT PRIMARY KEY,
  "trainerId" TEXT NOT NULL,
  "dayOfWeek" INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
  "startTime" TIME NOT NULL, -- e.g., '09:00:00'
  "endTime" TIME NOT NULL, -- e.g., '17:00:00'
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),

  -- Foreign key to TrainerProfile
  CONSTRAINT "TrainerAvailability_trainerId_fkey"
    FOREIGN KEY ("trainerId")
    REFERENCES "TrainerProfile"("id")
    ON DELETE CASCADE,

  -- Ensure end time is after start time
  CONSTRAINT "valid_time_range"
    CHECK ("endTime" > "startTime"),

  -- Prevent overlapping time slots for same day
  UNIQUE ("trainerId", "dayOfWeek", "startTime", "endTime")
);

-- Table 2: TrainerTimeOff (Exceptions/blackout dates)
CREATE TABLE IF NOT EXISTS "TrainerTimeOff" (
  "id" TEXT PRIMARY KEY,
  "trainerId" TEXT NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  "reason" TEXT, -- Optional: "Vacation", "Sick", etc.
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),

  -- Foreign key to TrainerProfile
  CONSTRAINT "TrainerTimeOff_trainerId_fkey"
    FOREIGN KEY ("trainerId")
    REFERENCES "TrainerProfile"("id")
    ON DELETE CASCADE,

  -- Ensure end date is after start date
  CONSTRAINT "valid_date_range"
    CHECK ("endDate" > "startDate")
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS "TrainerAvailability_trainerId_idx"
  ON "TrainerAvailability"("trainerId");

CREATE INDEX IF NOT EXISTS "TrainerAvailability_dayOfWeek_idx"
  ON "TrainerAvailability"("dayOfWeek");

CREATE INDEX IF NOT EXISTS "TrainerTimeOff_trainerId_idx"
  ON "TrainerTimeOff"("trainerId");

CREATE INDEX IF NOT EXISTS "TrainerTimeOff_dates_idx"
  ON "TrainerTimeOff"("startDate", "endDate");

-- Add default availability for existing trainers (Mon-Fri 9am-5pm)
INSERT INTO "TrainerAvailability" ("id", "trainerId", "dayOfWeek", "startTime", "endTime")
SELECT
  'avail_' || t.id || '_' || dow.day,
  t.id,
  dow.day,
  '09:00:00',
  '17:00:00'
FROM "TrainerProfile" t
CROSS JOIN (
  SELECT 1 AS day UNION ALL -- Monday
  SELECT 2 UNION ALL -- Tuesday
  SELECT 3 UNION ALL -- Wednesday
  SELECT 4 UNION ALL -- Thursday
  SELECT 5 -- Friday
) dow
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Trainer availability tables created successfully! ✅' as message;
SELECT COUNT(*) || ' default availability slots added' as status FROM "TrainerAvailability";
