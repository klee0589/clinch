-- Add Stripe payment fields to Session table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zzxfdjoxddjmzhhytxzx/editor

-- Add new columns for payment tracking
ALTER TABLE "Session"
ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" TEXT,
ADD COLUMN IF NOT EXISTS "stripeCheckoutSessionId" TEXT,
ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT DEFAULT 'UNPAID';

-- Create index for payment lookups
CREATE INDEX IF NOT EXISTS "Session_stripePaymentIntentId_idx" ON "Session"("stripePaymentIntentId");
CREATE INDEX IF NOT EXISTS "Session_stripeCheckoutSessionId_idx" ON "Session"("stripeCheckoutSessionId");
CREATE INDEX IF NOT EXISTS "Session_paymentStatus_idx" ON "Session"("paymentStatus");

-- Update existing sessions to have paymentStatus
UPDATE "Session"
SET "paymentStatus" = CASE
  WHEN "paid" = true THEN 'PAID'
  ELSE 'UNPAID'
END
WHERE "paymentStatus" IS NULL;

-- Success message
SELECT 'Stripe payment fields added successfully! ✅' as message;
SELECT 'Payment status values: UNPAID, PENDING, PAID, REFUNDED' as note;
