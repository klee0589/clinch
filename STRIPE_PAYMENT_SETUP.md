# 💳 Stripe Payment Integration - Setup & Testing Guide

## ✅ What's Been Implemented

Your Clinch app now has a complete Stripe payment integration! Here's what's working:

### 🎯 Payment Flow
1. **Trainee books a session** → Session created in database (status: PENDING, payment: UNPAID)
2. **Automatic redirect to Stripe Checkout** → Professional payment page hosted by Stripe
3. **Payment successful** → Webhook updates session (status: CONFIRMED, payment: PAID)
4. **Redirect back to dashboard** → Trainee sees confirmed, paid session

### 📁 Files Created/Modified

**New API Endpoints:**
- `/api/stripe/create-checkout-session/route.ts` - Creates Stripe checkout session
- `/api/stripe/webhook/route.ts` - Handles payment confirmations from Stripe

**Database Migration:**
- `add-stripe-payment-fields.sql` - Adds payment tracking columns to Session table

**Updated Components:**
- `components/sessions/BookingForm.tsx` - Redirects to Stripe after booking
- `app/(main)/dashboard/page.tsx` - Shows payment status badges

**Environment Variables:**
- Added `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Added `STRIPE_SECRET_KEY`
- Added `STRIPE_WEBHOOK_SECRET` (will be set after webhook creation)

---

## 🚀 Setup Steps

### Step 1: Run Database Migration

Open your Supabase SQL Editor and run the migration:

1. Go to https://supabase.com/dashboard/project/zzxfdjoxddjmzhhytxzx/editor
2. Copy contents of `add-stripe-payment-fields.sql`
3. Paste and run in SQL Editor
4. You should see: "Stripe payment fields added successfully! ✅"

### Step 2: Start Your Dev Server

```bash
cd /Users/kangillee/Desktop/clinch
npm run dev:web
```

Your app will be running at http://localhost:3003

### Step 3: Set Up Stripe Webhook (Important!)

For payments to work properly, Stripe needs to notify your app when payments complete. We'll use Stripe CLI for local testing:

**Install Stripe CLI (Mac):**
```bash
brew install stripe/stripe-cli/stripe
```

**Login to Stripe:**
```bash
stripe login
```

**Forward webhooks to your local server:**
```bash
stripe listen --forward-to localhost:3003/api/stripe/webhook
```

This command will output a webhook secret like `whsec_xxxxx`. Copy it!

**Update your .env.local:**
```bash
cd packages/web
nano .env.local
```

Update the line:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Paste your actual secret here
```

Save and restart your dev server.

---

## 🧪 Testing the Payment Flow

### Test Cards (Use these in Stripe Checkout)

| Card Number | Scenario | CVV | Expiry |
|-------------|----------|-----|--------|
| `4242 4242 4242 4242` | ✅ Success | Any 3 digits | Any future date |
| `4000 0025 0000 3155` | ✅ Requires authentication (3D Secure) | Any 3 digits | Any future date |
| `4000 0000 0000 9995` | ❌ Declined - insufficient funds | Any 3 digits | Any future date |
| `4000 0000 0000 0002` | ❌ Declined - generic decline | Any 3 digits | Any future date |

### Testing Checklist

**1. Book a Session:**
- [ ] Go to http://localhost:3003
- [ ] Sign in or create account
- [ ] Browse trainers → Click any trainer
- [ ] Click "Book Session"
- [ ] Fill out booking form
- [ ] Click "Request Booking"

**2. Payment Page:**
- [ ] You should be redirected to Stripe Checkout (checkout.stripe.com)
- [ ] Page shows session details and price
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Email: your email
- [ ] Name: Your Name
- [ ] CVV: `123`
- [ ] Expiry: `12/34`

**3. Payment Success:**
- [ ] Click "Pay"
- [ ] Redirected back to dashboard
- [ ] Session shows status: "CONFIRMED"
- [ ] Payment badge shows: "✓ Paid"

**4. Check Webhook (in Stripe CLI terminal):**
You should see:
```
✓ checkout.session.completed [evt_xxx]
✓ payment_intent.succeeded [evt_xxx]
```

**5. Verify in Supabase:**
- Open Supabase Table Editor → Session table
- Find your session
- Check:
  - `status` = "CONFIRMED"
  - `paymentStatus` = "PAID"
  - `paid` = true
  - `stripeCheckoutSessionId` = "cs_test_xxx"
  - `stripePaymentIntentId` = "pi_xxx"

---

## 🎨 Payment Status Badges

Your dashboard now shows these payment statuses:

| Status | Badge Color | Meaning |
|--------|-------------|---------|
| **UNPAID** | Gray | Session created, no payment attempted |
| **PENDING** | Yellow | Payment in progress (at Stripe checkout) |
| **PAID** | Green | Payment successful, session confirmed |
| **REFUNDED** | Blue | Payment refunded (future feature) |

---

## 🔧 Troubleshooting

### Issue: Webhook signature verification failed

**Solution:** Make sure:
1. Stripe CLI is running (`stripe listen --forward-to localhost:3003/api/stripe/webhook`)
2. `STRIPE_WEBHOOK_SECRET` in `.env.local` matches the CLI output
3. You restarted the dev server after adding the webhook secret

### Issue: Payment succeeds but session not updated

**Solution:**
1. Check Stripe CLI terminal for webhook events
2. Check browser console for errors
3. Verify `metadata.clinchSessionId` is being passed in checkout session
4. Check Supabase connection in webhook handler

### Issue: Redirected to Stripe but checkout page is blank

**Solution:**
1. Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_test_`
2. Check browser console for errors
3. Ensure price is a positive number (not $0.00)

### Issue: Can't find the session in dashboard after payment

**Solution:**
1. Refresh the dashboard page
2. Check the "Confirmed" filter tab
3. Verify you're logged in as the trainee who made the booking

---

## 📱 Mobile App Support

Payment flow for mobile will require additional setup:
- Stripe React Native SDK integration
- WebView for checkout or native payment sheet
- Deep linking for return URLs

**Current Status:** Web only
**Next Steps:** See "Update mobile app to support payment flow" in todo list

---

## 🌐 Production Deployment

When you're ready to go live:

1. **Get Live API Keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - Toggle from "Test mode" to "Live mode"
   - Copy live keys (start with `pk_live_` and `sk_live_`)

2. **Update Environment Variables (Production):**
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxx
   ```

3. **Create Production Webhook:**
   - In Stripe Dashboard → Developers → Webhooks
   - Click "+ Add endpoint"
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy webhook secret → Add to production env vars

4. **Test with Real Card:**
   - Use your actual credit card
   - Make a small test payment ($0.50)
   - Verify everything works
   - Refund the test payment in Stripe Dashboard

---

## 💰 Stripe Pricing (FYI)

- **Transaction Fee:** 2.9% + $0.30 per successful payment
- **Monthly Fee:** $0 (pay as you go)
- **Free Features:**
  - Unlimited test mode transactions
  - Fraud detection
  - PCI compliance handling
  - Dashboard analytics

Example: $50 session = $1.75 fee → You receive $48.25

---

## 🎉 What's Next?

You now have a fully functional payment system! Consider adding:

1. **Refund functionality** - Allow cancellations with automatic refunds
2. **Payment history page** - Detailed transaction list for users
3. **Invoices/Receipts** - Auto-generate PDF receipts (Stripe API supports this)
4. **Payout dashboard for trainers** - Show earnings and connect Stripe Connect for payouts
5. **Subscription plans** - For gym memberships (using Stripe Subscriptions)
6. **Promo codes** - Discount codes for trainees (Stripe Coupons)

---

## 📚 Resources

- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)

---

**Need Help?** Check the Stripe logs in your dashboard: https://dashboard.stripe.com/test/logs
