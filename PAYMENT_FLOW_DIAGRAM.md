# 💳 Clinch Payment Flow Diagram

## 🎯 Complete Payment Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TRAINEE USER JOURNEY                         │
└─────────────────────────────────────────────────────────────────────┘

1. Browse Trainers
   │
   └──> Click "Book Session" on Trainer Profile
         │
         └──> Fill Booking Form
              ├── Date & Time
              ├── Duration (30min - 3hrs)
              ├── Online / In-Person
              └── Optional Notes
              │
              └──> Click "Request Booking"
                   │
                   │
2. Session Created (Status: PENDING, Payment: UNPAID)
   │
   ├──> POST /api/sessions-supabase
   │    └── Creates session in database
   │
   └──> POST /api/stripe/create-checkout-session
        └── Creates Stripe checkout session
        │
        └──> Redirect to Stripe Checkout
             │
             │
3. Stripe Hosted Payment Page
   │
   ├──> Shows session details
   ├──> Price breakdown
   └──> Card payment form
        │
        ├──> User enters card: 4242 4242 4242 4242
        ├──> CVV: 123
        ├──> Expiry: 12/34
        └──> Click "Pay"
             │
             │
4. Payment Processing
   │
   ├──> Stripe validates card
   ├──> Charges card
   └──> Creates payment_intent
        │
        └──> Success! 🎉
             │
             │
5. Stripe Webhook Fires
   │
   ├──> checkout.session.completed
   └──> payment_intent.succeeded
        │
        └──> POST /api/stripe/webhook
             │
             ├── Verifies webhook signature
             ├── Updates session in database:
             │   ├── status → CONFIRMED
             │   ├── paymentStatus → PAID
             │   ├── paid → true
             │   ├── stripePaymentIntentId → pi_xxxxx
             │   └── stripeCheckoutSessionId → cs_test_xxxxx
             │
             └──> Redirect to Dashboard
                  │
                  │
6. Dashboard (Trainee View)
   │
   └──> Session appears with:
        ├── Status: "CONFIRMED" (green badge)
        ├── Payment: "✓ Paid" (green badge)
        ├── Trainer info
        └── Session details

```

---

## 🔄 Sequence Diagram

```
Trainee       Web App            Database         Stripe API        Webhook
  │              │                   │                │                │
  │──Book────────>│                  │                │                │
  │              │                   │                │                │
  │              │──Create Session──>│                │                │
  │              │<─Session Created──│                │                │
  │              │                   │                │                │
  │              │──Create Checkout─────────────────>│                │
  │              │<─Checkout URL────────────────────│                │
  │              │                   │                │                │
  │<─Redirect────│                   │                │                │
  │              │                   │                │                │
  │                                  │                │                │
  │          [Stripe Checkout Page]  │                │                │
  │                                  │                │                │
  │──Pay────────────────────────────────────────────>│                │
  │                                  │                │                │
  │                                  │                │──Webhook──────>│
  │                                  │                │                │
  │                                  │<──Update Session───────────────│
  │                                  │                │                │
  │<─Redirect to Dashboard───────────────────────────│                │
  │              │                   │                │                │
  │──Load────────>│                  │                │                │
  │              │──Get Sessions────>│                │                │
  │              │<─Sessions (PAID)──│                │                │
  │<─Dashboard───│                   │                │                │
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                          │
│                                                                     │
│  ┌──────────────────┐         ┌──────────────────┐                │
│  │  BookingForm.tsx │         │ Dashboard Page   │                │
│  │                  │         │                  │                │
│  │  - Collects data │         │  - Shows status  │                │
│  │  - Creates       │         │  - Payment badges│                │
│  │    session       │         │  - Session list  │                │
│  └─────────┬────────┘         └──────────────────┘                │
│            │                                                        │
└────────────┼────────────────────────────────────────────────────────┘
             │
             │ API Calls
             │
┌────────────▼────────────────────────────────────────────────────────┐
│                         API ROUTES (Next.js)                        │
│                                                                     │
│  ┌────────────────────────┐    ┌──────────────────────────────┐  │
│  │ /api/sessions-supabase │    │ /api/stripe/                 │  │
│  │                        │    │                              │  │
│  │  POST - Create session │    │  create-checkout-session/    │  │
│  │  GET  - List sessions  │    │    - Creates Stripe checkout │  │
│  │  PATCH- Update status  │    │                              │  │
│  └───────────┬────────────┘    │  webhook/                    │  │
│              │                 │    - Handles payment events  │  │
│              │                 └──────────┬───────────────────┘  │
│              │                            │                      │
└──────────────┼────────────────────────────┼──────────────────────┘
               │                            │
               │                            │
    ┌──────────▼──────────┐      ┌─────────▼────────────┐
    │                     │      │                      │
    │   SUPABASE DB       │      │    STRIPE API        │
    │   (PostgreSQL)      │      │                      │
    │                     │      │  - Checkout Session  │
    │  Session Table:     │      │  - Payment Intents   │
    │  ├── id             │      │  - Webhooks          │
    │  ├── status         │      │  - Test Cards        │
    │  ├── paymentStatus  │      │                      │
    │  ├── paid           │      │                      │
    │  ├── stripePayment..│      │                      │
    │  └── stripeCheckout.│      │                      │
    │                     │      │                      │
    └─────────────────────┘      └──────────────────────┘
```

---

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY MEASURES                            │
└─────────────────────────────────────────────────────────────────┘

1. API Keys Protection
   ├── NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (frontend - safe)
   └── STRIPE_SECRET_KEY (backend only - sensitive)

2. Webhook Verification
   ├── Stripe sends signature in header
   ├── We verify with STRIPE_WEBHOOK_SECRET
   └── Reject if signature doesn't match

3. PCI Compliance
   ├── No card data touches our servers
   ├── Stripe hosts the payment form
   └── We only store payment IDs

4. Database Security
   ├── Only store Stripe IDs (pi_xxx, cs_xxx)
   ├── No card numbers
   ├── No CVV
   └── No sensitive payment info

5. User Authorization
   ├── Clerk authentication required
   ├── User can only pay for their own sessions
   └── Database queries filtered by user ID
```

---

## 📊 Payment Status State Machine

```
                    ┌─────────────┐
                    │   UNPAID    │ ◄── Session created
                    │   (Gray)    │
                    └──────┬──────┘
                           │
                           │ User clicks "Request Booking"
                           │ Redirected to Stripe Checkout
                           │
                    ┌──────▼──────┐
                    │   PENDING   │
                    │  (Yellow)   │ ◄── At Stripe checkout page
                    └──────┬──────┘
                           │
                     ┌─────┴─────┐
                     │           │
         User pays   │           │  User cancels / payment fails
                     │           │
              ┌──────▼──────┐   ┌▼────────┐
              │    PAID     │   │ UNPAID  │
              │   (Green)   │   │ (Gray)  │
              └─────────────┘   └─────────┘
                     │
                     │ (Future feature)
                     │
              ┌──────▼──────┐
              │  REFUNDED   │
              │   (Blue)    │
              └─────────────┘
```

---

## 🧪 Test Environment Flow

```
Developer Machine           Stripe Test Mode          Supabase
─────────────────          ─────────────────         ──────────

localhost:3000  ──────────> Test API Keys  ◄─────────  Real DB
    │                         │                          │
    │                         │                          │
    │                     Test Cards:                    │
    │                   4242 4242 4242 4242              │
    │                         │                          │
    │                         │                          │
    ▼                         ▼                          ▼
Stripe CLI          Webhook Forwarding           Session Table
stripe listen       (localhost:3000)              Updated
    │                         │                          │
    │                         │                          │
    └────────>  whsec_xxxxx  ────────────────────────────┘
                Webhook Secret
            (in .env.local)
```

---

## 🎯 Data Flow: Key Fields

```
Session Creation
├── User fills form
└── POST /api/sessions-supabase
    └── Creates in DB:
        {
          id: "session_xxx",
          status: "PENDING",
          paymentStatus: "UNPAID",
          paid: false,
          price: 75.00,
          currency: "USD"
        }

Checkout Creation
└── POST /api/stripe/create-checkout-session
    └── Creates Stripe session:
        {
          id: "cs_test_xxx",
          payment_intent: "pi_xxx",
          url: "https://checkout.stripe.com/..."
        }

Payment Success (Webhook)
└── POST /api/stripe/webhook
    └── Updates DB:
        {
          status: "CONFIRMED",
          paymentStatus: "PAID",
          paid: true,
          stripePaymentIntentId: "pi_xxx",
          stripeCheckoutSessionId: "cs_test_xxx"
        }
```

---

## 🚀 Quick Reference

**Key URLs:**
- App: http://localhost:3000
- Stripe Dashboard: https://dashboard.stripe.com/test
- Supabase: https://supabase.com/dashboard

**Test Card:**
- Number: `4242 4242 4242 4242`
- CVV: `123`
- Expiry: `12/34`

**Webhook Command:**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

This diagram shows the complete payment flow from start to finish! 🎉
