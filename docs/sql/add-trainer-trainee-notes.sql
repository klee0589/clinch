-- Add Trainer Notes and Trainee Media tables
-- This allows trainers to keep notes and media for their trainees

-- Trainer Notes Table
-- Stores trainer's notes about specific trainees
CREATE TABLE IF NOT EXISTS "TrainerNotes" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "trainerId" TEXT NOT NULL,
  "traineeId" TEXT NOT NULL,
  "sessionId" TEXT, -- Optional: link to specific session
  "note" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Foreign keys
  CONSTRAINT "TrainerNotes_trainerId_fkey"
    FOREIGN KEY ("trainerId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE,
  CONSTRAINT "TrainerNotes_traineeId_fkey"
    FOREIGN KEY ("traineeId") REFERENCES "TraineeProfile"("id") ON DELETE CASCADE,
  CONSTRAINT "TrainerNotes_sessionId_fkey"
    FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL
);

-- Trainee Media Table
-- Stores photos and videos uploaded by trainers
CREATE TABLE IF NOT EXISTS "TraineeMedia" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "trainerId" TEXT NOT NULL,
  "traineeId" TEXT NOT NULL,
  "sessionId" TEXT, -- Optional: link to specific session
  "mediaType" TEXT NOT NULL, -- 'photo' or 'video'
  "mediaUrl" TEXT NOT NULL, -- Supabase Storage URL
  "thumbnailUrl" TEXT, -- Thumbnail for videos
  "description" TEXT,
  "fileSizeBytes" INTEGER,
  "durationSeconds" INTEGER, -- For videos
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Foreign keys
  CONSTRAINT "TraineeMedia_trainerId_fkey"
    FOREIGN KEY ("trainerId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE,
  CONSTRAINT "TraineeMedia_traineeId_fkey"
    FOREIGN KEY ("traineeId") REFERENCES "TraineeProfile"("id") ON DELETE CASCADE,
  CONSTRAINT "TraineeMedia_sessionId_fkey"
    FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL,
  CONSTRAINT "TraineeMedia_mediaType_check"
    CHECK ("mediaType" IN ('photo', 'video'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "TrainerNotes_trainerId_idx" ON "TrainerNotes"("trainerId");
CREATE INDEX IF NOT EXISTS "TrainerNotes_traineeId_idx" ON "TrainerNotes"("traineeId");
CREATE INDEX IF NOT EXISTS "TrainerNotes_sessionId_idx" ON "TrainerNotes"("sessionId");
CREATE INDEX IF NOT EXISTS "TrainerNotes_createdAt_idx" ON "TrainerNotes"("createdAt" DESC);

CREATE INDEX IF NOT EXISTS "TraineeMedia_trainerId_idx" ON "TraineeMedia"("trainerId");
CREATE INDEX IF NOT EXISTS "TraineeMedia_traineeId_idx" ON "TraineeMedia"("traineeId");
CREATE INDEX IF NOT EXISTS "TraineeMedia_sessionId_idx" ON "TraineeMedia"("sessionId");
CREATE INDEX IF NOT EXISTS "TraineeMedia_mediaType_idx" ON "TraineeMedia"("mediaType");
CREATE INDEX IF NOT EXISTS "TraineeMedia_createdAt_idx" ON "TraineeMedia"("createdAt" DESC);

-- RLS (Row Level Security) Policies
-- Only trainers can see their own notes and media

ALTER TABLE "TrainerNotes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TraineeMedia" ENABLE ROW LEVEL SECURITY;

-- TrainerNotes policies
CREATE POLICY "Trainers can view their own notes"
  ON "TrainerNotes" FOR SELECT
  USING (true); -- Auth handled at API level

CREATE POLICY "Trainers can insert their own notes"
  ON "TrainerNotes" FOR INSERT
  WITH CHECK (true); -- Auth handled at API level

CREATE POLICY "Trainers can update their own notes"
  ON "TrainerNotes" FOR UPDATE
  USING (true); -- Auth handled at API level

CREATE POLICY "Trainers can delete their own notes"
  ON "TrainerNotes" FOR DELETE
  USING (true); -- Auth handled at API level

-- TraineeMedia policies
CREATE POLICY "Trainers can view their own media"
  ON "TraineeMedia" FOR SELECT
  USING (true); -- Auth handled at API level

CREATE POLICY "Trainers can insert their own media"
  ON "TraineeMedia" FOR INSERT
  WITH CHECK (true); -- Auth handled at API level

CREATE POLICY "Trainers can delete their own media"
  ON "TraineeMedia" FOR DELETE
  USING (true); -- Auth handled at API level

-- Add helpful comments
COMMENT ON TABLE "TrainerNotes" IS 'Stores trainer notes about their trainees';
COMMENT ON TABLE "TraineeMedia" IS 'Stores photos and videos uploaded by trainers for their trainees';
COMMENT ON COLUMN "TraineeMedia"."mediaType" IS 'Type of media: photo or video';
COMMENT ON COLUMN "TraineeMedia"."mediaUrl" IS 'URL to the media file in Supabase Storage';
