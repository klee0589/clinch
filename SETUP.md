# Quick Setup Guide

## What You Can See Right Now (No Setup Required)

The app is already running at **http://localhost:3000** with mock data! You can explore:

1. **Landing Page** - `/`
2. **Browse Trainers** - `/browse/trainers`
3. **Browse Gyms** - `/browse/gyms`
4. **Trainer Profile** - Click on any trainer
5. **Gym Profile** - Click on any gym
6. **Trainer Dashboard** - `/dashboard/trainer` (mock data)

## Pages Currently Available

| Page | URL | Status |
|------|-----|--------|
| Landing Page | `/` | ✅ Working with mock data |
| Browse Trainers | `/browse/trainers` | ✅ Working with mock data |
| Browse Gyms | `/browse/gyms` | ✅ Working with mock data |
| Trainer Detail | `/browse/trainers/[id]` | ✅ Working with mock data |
| Gym Detail | `/browse/gyms/[id]` | ✅ Working with mock data |
| Trainer Dashboard | `/dashboard/trainer` | ✅ Working with mock data |
| Sign In | `/sign-in` | 🔧 Needs Clerk setup |
| Sign Up | `/sign-up` | 🔧 Needs Clerk setup |
| Onboarding | `/onboarding` | 🔧 Needs Clerk setup |

## To Enable Authentication & Database

### 1. Set Up Clerk (5 minutes)

**Why:** Enables user sign-up, sign-in, and authentication

**Steps:**
1. Go to https://dashboard.clerk.com/sign-up
2. Create a free account
3. Click "+ Create application"
4. Name: "Clinch"
5. Select "Email" as auth method
6. Copy the keys shown

**Add to `.env.local`:**
```bash
cd packages/web
nano .env.local  # or open in your editor
```

Replace these lines:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_actual_publishable_key_here
CLERK_SECRET_KEY=your_actual_secret_key_here
```

**Restart the dev server:**
```bash
# Kill current server (Ctrl+C if running)
npm run dev:web
```

Now sign-up/sign-in will work!

### 2. Set Up Supabase (5 minutes)

**Why:** Enables real database storage for users, trainers, gyms, sessions

**Steps:**
1. Go to https://supabase.com/dashboard
2. Create free account
3. Click "+ New project"
4. Project name: "clinch"
5. Set a strong database password (SAVE THIS!)
6. Select region closest to you
7. Wait ~2 minutes for project creation
8. Go to Settings (⚙️) → Database
9. Scroll to "Connection string"
10. Select "URI" tab
11. Copy the connection string
12. Replace `[YOUR-PASSWORD]` with your database password

**Add to both env files:**

`packages/database/.env`:
```
DATABASE_URL="postgresql://postgres:your_password@your_project.supabase.co:5432/postgres"
```

`packages/web/.env.local`:
```
DATABASE_URL="postgresql://postgres:your_password@your_project.supabase.co:5432/postgres"
```

**Initialize the database:**
```bash
npm run db:push
```

You should see: "✔ Your database is now in sync with your Prisma schema."

**Restore middleware (for auth protection):**
```bash
cd packages/web
mv middleware.ts.backup middleware.ts
```

**Restart dev server.**

Now the database is connected and you can create real user accounts!

## Verification

After setup, test these flows:

1. **Sign Up Flow:**
   - Go to `/sign-up`
   - Create an account
   - Should redirect to `/onboarding`
   - Select your role (Trainer/Trainee/Gym)
   - Should redirect to profile setup

2. **Database Check:**
   ```bash
   npm run db:studio
   ```
   - Opens Prisma Studio at http://localhost:5555
   - Check "User" table for your new account

## Troubleshooting

**"Publishable key not valid" error:**
- Check that you copied the FULL key from Clerk
- Make sure no extra spaces in .env.local
- Restart the dev server

**Database connection error:**
- Verify password is correct
- Check that Supabase project is running (green status in dashboard)
- Make sure you're using the URI format connection string

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Then restart
npm run dev:web
```

## What's Next?

Once authentication and database are connected, you can:

1. Create real trainer/gym/trainee profiles
2. Build out the booking system
3. Add real-time messaging
4. Integrate Stripe payments
5. Deploy to production

## Current Development Status

**Completed (MVP v0.1):**
- ✅ Full UI for browsing trainers and gyms
- ✅ Detail pages with reviews, ratings, amenities
- ✅ Trainer dashboard with stats and bookings
- ✅ Database schema designed
- ✅ Type-safe validation with Zod
- ✅ Dark themed, responsive design

**Next Sprint:**
- Profile creation/editing forms
- Working search and filters
- Session booking flow
- Messaging system
- Payment integration
