# ✅ Stripe Payment Setup Checklist

Use this checklist to ensure your payment integration is fully set up and tested.

---

## 🗄️ Database Setup

- [ ] Open Supabase SQL Editor
  - URL: https://supabase.com/dashboard/project/zzxfdjoxddjmzhhytxzx/editor

- [ ] Run migration script `add-stripe-payment-fields.sql`
  - Copy entire file contents
  - Paste into SQL Editor
  - Click "Run"
  - Verify success message appears

- [ ] Check new columns exist
  - Go to Table Editor → Session table
  - Confirm these columns exist:
    - `stripePaymentIntentId`
    - `stripeCheckoutSessionId`
    - `paymentStatus`

---

## 🔧 Environment Configuration

Your Stripe keys are already configured! Verify:

- [x] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local` ✓
- [x] `STRIPE_SECRET_KEY` in `.env.local` ✓
- [ ] `STRIPE_WEBHOOK_SECRET` in `.env.local` (add after Step 3)

**File location:** `/Users/kangillee/Desktop/clinch/packages/web/.env.local`

---

## 🪝 Webhook Setup

**Important:** Webhooks are required for payments to confirm properly!

### Install Stripe CLI (one-time)

- [ ] Open Terminal
- [ ] Run: `brew install stripe/stripe-cli/stripe`
- [ ] Verify: `stripe --version`

### Login to Stripe (one-time)

- [ ] Run: `stripe login`
- [ ] Browser opens → Click "Allow access"
- [ ] Terminal shows "Done! You're authenticated"

### Forward Webhooks (every dev session)

- [ ] Open a NEW Terminal window (keep it open)
- [ ] Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- [ ] **Copy the webhook secret** that appears (starts with `whsec_`)
- [ ] Paste into `.env.local` → `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`
- [ ] Restart dev server (Ctrl+C then `npm run dev` in packages/web)

---

## 🚀 Development Server

- [x] Dev server running at http://localhost:3000 ✓
- [ ] No errors in terminal
- [ ] Can access homepage

If server stopped:
```bash
cd /Users/kangillee/Desktop/clinch/packages/web
npm run dev
```

---

## 🧪 Test Payment Flow

### Create Test Booking

- [ ] Go to http://localhost:3000
- [ ] Sign in (or create account)
- [ ] Browse Trainers
- [ ] Click any trainer
- [ ] Click "Book Session"
- [ ] Fill form:
  - [ ] Date/time (any future date)
  - [ ] Duration (e.g., 1 hour)
  - [ ] Session type (online or in-person)
  - [ ] Location (if in-person)
- [ ] Click "Request Booking"

### Complete Payment

- [ ] Redirected to Stripe Checkout page
- [ ] Page shows session details and price
- [ ] Fill payment form:
  - [ ] Card: `4242 4242 4242 4242`
  - [ ] Email: your email
  - [ ] Name: Test User
  - [ ] CVV: `123`
  - [ ] Expiry: `12/34`
  - [ ] Zip: `12345`
- [ ] Click "Pay"

### Verify Success

- [ ] Redirected back to dashboard
- [ ] Session appears in list
- [ ] Status badge shows "CONFIRMED" (green)
- [ ] Payment badge shows "✓ Paid" (green)

---

## 🔍 Verification Checklist

### In Stripe CLI Terminal

- [ ] See event: `✓ checkout.session.completed`
- [ ] See event: `✓ payment_intent.succeeded`
- [ ] No error messages

### In Supabase Dashboard

- [ ] Open Table Editor → Session table
- [ ] Find your session (most recent)
- [ ] Verify fields:
  - [ ] `status` = "CONFIRMED"
  - [ ] `paymentStatus` = "PAID"
  - [ ] `paid` = true
  - [ ] `stripeCheckoutSessionId` = "cs_test_xxxxx"
  - [ ] `stripePaymentIntentId` = "pi_xxxxx"

### In Stripe Dashboard

- [ ] Go to https://dashboard.stripe.com/test/payments
- [ ] See your test payment
- [ ] Amount matches session price
- [ ] Status = "Succeeded"
- [ ] Can click to see details

---

## 🎯 Additional Tests (Optional)

### Test Different Payment Scenarios

**Successful Payment (3D Secure):**
- [ ] Use card: `4000 0025 0000 3155`
- [ ] Complete 3D Secure challenge
- [ ] Payment succeeds

**Declined Payment (Insufficient Funds):**
- [ ] Use card: `4000 0000 0000 9995`
- [ ] See error message
- [ ] Session stays PENDING (not confirmed)

**Cancel at Checkout:**
- [ ] Book another session
- [ ] At Stripe checkout, click back arrow
- [ ] Returns to dashboard
- [ ] Session shows PENDING/UNPAID

### Test Trainer View

- [ ] Create second account (different email)
- [ ] Onboard as "Trainer"
- [ ] Have trainee book you
- [ ] See booking in "Booking Requests"
- [ ] Verify shows paid status

---

## 🐛 Troubleshooting

### Payment succeeds but session not updating?

**Check:**
- [ ] Stripe CLI is running
- [ ] Webhook secret in `.env.local` is correct
- [ ] Dev server was restarted after adding webhook secret
- [ ] No errors in Stripe CLI terminal

**Fix:**
1. Stop dev server (Ctrl+C)
2. Verify `STRIPE_WEBHOOK_SECRET` in `.env.local`
3. Restart: `npm run dev`
4. Try payment again

### Can't see Stripe checkout page?

**Check:**
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is correct
- [ ] No errors in browser console (F12)
- [ ] Session price is not $0.00

### Webhook signature verification failed?

**Fix:**
- [ ] Copy webhook secret from Stripe CLI terminal
- [ ] Paste exactly into `.env.local` (no extra spaces)
- [ ] Restart dev server
- [ ] Try again

---

## 📱 Mobile App (Future)

Payment flow for mobile app:
- [ ] Not yet implemented
- [ ] Requires Stripe React Native SDK
- [ ] Requires WebView or native payment sheet
- [ ] Deep linking for success/cancel URLs

**Status:** Web only (v0.6)

---

## 🌐 Production Deployment (When Ready)

- [ ] Get live Stripe keys (not test keys)
- [ ] Create production webhook in Stripe Dashboard
- [ ] Update environment variables in production
- [ ] Test with real card (small amount like $0.50)
- [ ] Set up Stripe Connect for trainer payouts

**For now:** Stay in test mode! No real money will be charged.

---

## 🎉 Success Criteria

You're done when:
- ✅ Database migration ran successfully
- ✅ Webhook secret added to `.env.local`
- ✅ Dev server running without errors
- ✅ Stripe CLI showing webhook events
- ✅ Test payment completed successfully
- ✅ Session shows CONFIRMED + PAID in dashboard
- ✅ Payment visible in Stripe Dashboard

---

## 📚 Need Help?

**Guides:**
- `PAYMENT_QUICK_START.md` - Quick 5-minute guide
- `STRIPE_PAYMENT_SETUP.md` - Comprehensive setup guide
- `WHATS_NEW_v0.6.md` - Feature overview

**Stripe Resources:**
- Dashboard: https://dashboard.stripe.com/test
- Test Cards: https://stripe.com/docs/testing
- Webhooks: https://stripe.com/docs/webhooks
- CLI Docs: https://stripe.com/docs/stripe-cli

---

**Last Updated:** January 2025 (v0.6)
**Estimated Time:** 10-15 minutes for first-time setup
