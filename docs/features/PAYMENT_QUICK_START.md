# 💳 Stripe Payment - Quick Start (5 Minutes)

## ⚡ Fastest Way to Test Payments

### 1. Run Database Migration (2 min)

Open: https://supabase.com/dashboard/project/zzxfdjoxddjmzhhytxzx/editor

Paste and run this SQL:

```sql
-- Add Stripe payment fields to Session table
ALTER TABLE "Session"
ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" TEXT,
ADD COLUMN IF NOT EXISTS "stripeCheckoutSessionId" TEXT,
ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT DEFAULT 'UNPAID';

-- Create indexes
CREATE INDEX IF NOT EXISTS "Session_stripePaymentIntentId_idx" ON "Session"("stripePaymentIntentId");
CREATE INDEX IF NOT EXISTS "Session_stripeCheckoutSessionId_idx" ON "Session"("stripeCheckoutSessionId");
CREATE INDEX IF NOT EXISTS "Session_paymentStatus_idx" ON "Session"("paymentStatus");

-- Update existing sessions
UPDATE "Session"
SET "paymentStatus" = CASE
  WHEN "paid" = true THEN 'PAID'
  ELSE 'UNPAID'
END
WHERE "paymentStatus" IS NULL;

SELECT 'Stripe payment fields added successfully! ✅' as message;
```

### 2. Start Dev Server (already running!)

Your server is running at: **http://localhost:3000**

### 3. Setup Stripe Webhooks (3 min)

**Install Stripe CLI (Mac):**
```bash
brew install stripe/stripe-cli/stripe
```

**Start webhook forwarding (run this in a new terminal):**
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook secret that appears (starts with `whsec_`)

**Update .env.local:**
```bash
cd /Users/kangillee/Desktop/clinch/packages/web
```

Open `.env.local` and update this line:
```
STRIPE_WEBHOOK_SECRET=whsec_paste_your_secret_here
```

**Restart the dev server** (important!)

---

## 🧪 Test Your First Payment (1 min)

1. **Go to:** http://localhost:3000
2. **Sign in** (or create account)
3. **Browse Trainers** → Pick any trainer
4. **Book Session:**
   - Pick any date/time
   - Select duration
   - Click "Request Booking"

5. **Stripe Checkout Page Opens:**
   - Use test card: `4242 4242 4242 4242`
   - Email: your email
   - Name: Test User
   - CVV: `123`
   - Expiry: `12/34`
   - Zip: `12345`

6. **Click "Pay"** → Redirected to dashboard
7. **See your session:**
   - Status: "CONFIRMED" (green)
   - Payment: "✓ Paid" (green)

---

## 🎯 What to Check

**In your Stripe CLI terminal, you should see:**
```
✓ checkout.session.completed [evt_xxx]
✓ payment_intent.succeeded [evt_xxx]
```

**In Supabase (Table Editor → Session):**
- `status` = "CONFIRMED"
- `paymentStatus` = "PAID"
- `paid` = true
- `stripeCheckoutSessionId` = "cs_test_xxxxx"
- `stripePaymentIntentId` = "pi_xxxxx"

**In your dashboard:**
- Session shows with green "CONFIRMED" badge
- Payment shows green "✓ Paid" badge

---

## 🚨 Common Issues

**"Webhook signature verification failed"**
→ Restart dev server after adding webhook secret to .env.local

**"Payment succeeds but session not updated"**
→ Check Stripe CLI is running and showing webhook events

**"Can't see the session after payment"**
→ Refresh dashboard or check "Confirmed" filter tab

---

## 📊 Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0025 0000 3155` | ✅ 3D Secure authentication |
| `4000 0000 0000 9995` | ❌ Insufficient funds |
| `4000 0000 0000 0002` | ❌ Generic decline |

All cards: CVV = any 3 digits, Expiry = any future date

---

## ✅ Done!

Your Clinch app now processes real payments! 🎉

**Next:** See `STRIPE_PAYMENT_SETUP.md` for full docs and production deployment guide.
