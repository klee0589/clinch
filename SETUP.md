# Quick Setup Guide

## Getting Started

This guide will help you set up both the **web** and **mobile** apps for the Clinch platform.

## Prerequisites

- Node.js 18+ and npm
- For mobile: iOS device with Expo Go app OR Android device with Expo Go app
- Clerk account (free)
- Supabase account (free)

## What's Available

### Web App (http://localhost:3003)
- Browse trainers and gyms
- Create and manage bookings
- Trainer profile editing
- Dual-view dashboard (trainee/trainer)
- Role-based authentication

### Mobile App (iOS/Android)
- Full feature parity with web
- Browse trainers with search
- Book sessions
- Manage bookings
- Profile management
- Native mobile experience

## Setup Steps

### 1. Install Dependencies

```bash
cd clinch
npm install
```

### 2. Set Up Clerk (5 minutes)

**Why:** Enables user authentication for web and mobile

**Steps:**
1. Go to https://dashboard.clerk.com/sign-up
2. Create a free account
3. Click "+ Create application"
4. Name: "Clinch"
5. Select "Email" as auth method
6. Configure authentication methods:
   - Go to "User & Authentication" → "Email, Phone, Username"
   - Enable "Email address"
   - Toggle "Email verification code" (for passwordless auth)
7. Copy the keys shown

**Configure Web App:**
```bash
cd packages/web
cp .env.local.example .env.local
```

Edit `.env.local` and add your Clerk keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

**Configure Mobile App:**
```bash
cd packages/mobile
```

Edit `config.ts`:
```typescript
export const config = {
  clerk: {
    publishableKey: 'pk_test_...',  // Same as web
  },
  api: {
    baseUrl: 'http://localhost:3003/api',
  },
};
```

**Note**: Mobile and web share the same Clerk account.

### 3. Set Up Supabase (10 minutes)

**Why:** Provides PostgreSQL database for storing all app data

**Steps:**
1. Go to https://supabase.com/dashboard
2. Create free account
3. Click "+ New project"
4. Project name: "clinch"
5. Set a strong database password (SAVE THIS!)
6. Select region closest to you
7. Wait ~2 minutes for project creation

**Get API Credentials:**
1. Go to Project Settings (⚙️) → API
2. Copy "Project URL"
3. Copy "anon public" key

**Add to web `.env.local`:**
```env
# Add these to your existing .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Initialize Database Schema:**
1. Go to SQL Editor in Supabase dashboard
2. Open `SQL scripts/supabase-schema.sql` from the project
3. Copy entire contents
4. Paste into SQL Editor
5. Click "Run"

**Seed Sample Data (Optional):**
1. Open `SQL scripts/supabase-seed.sql`
2. Copy contents
3. Paste into SQL Editor
4. Click "Run"

This creates 3 sample trainers, 2 gyms, and test data.

**Verify:**
- Go to Table Editor in Supabase
- You should see: User, TrainerProfile, GymProfile, Session, etc.

Now the database is fully set up!

### 4. Run the Apps

**Start Web Server:**
```bash
npm run dev:web
```

Web app will be available at: http://localhost:3003

**Start Mobile App (in a new terminal):**
```bash
npm run dev:mobile
```

This will:
1. Start Expo Metro bundler
2. Show QR code in terminal
3. Show connection options

**Connect Your Phone:**
1. Install "Expo Go" app from App Store (iOS) or Play Store (Android)
2. **iOS**: Open Camera app, scan QR code
3. **Android**: Open Expo Go app, tap "Scan QR code"
4. Mobile app will load on your phone

## Testing the Apps

### Web App (http://localhost:3003)

1. **Sign Up Flow:**
   - Click "Get Started"
   - Enter email (will receive verification code)
   - Check your email for 6-digit code
   - Enter code to verify
   - Complete onboarding: select role (Trainee/Trainer/Gym Owner)

2. **Browse Trainers:**
   - Navigate to Browse → Trainers
   - Use filters (city, rate, online availability)
   - Click on a trainer to see full profile

3. **Book a Session:**
   - On trainer profile, click "Book Session"
   - Select date, time, duration
   - Choose online or in-person
   - Submit booking

4. **View Dashboard:**
   - Go to Dashboard
   - **As Trainee**: See your bookings in "My Bookings"
   - **As Trainer**: See incoming requests in "Booking Requests"
   - Accept or decline bookings

### Mobile App

Test the same flows on mobile:
1. Sign in with same account from web
2. Browse trainers
3. Book sessions
4. View dashboard
5. Edit profile

**Note**: Mobile and web share the same backend, so all data syncs automatically.

## Troubleshooting

### Web App Issues

**"Publishable key not valid" error:**
- Check that you copied the FULL key from Clerk
- Make sure no extra spaces in `.env.local`
- Restart the dev server

**Database/API errors:**
- Verify Supabase credentials in `.env.local`
- Check that Supabase project is running (green status in dashboard)
- Make sure you ran the schema SQL script

**Port already in use:**
```bash
# Kill process on port 3003
lsof -ti:3003 | xargs kill -9
# Then restart
npm run dev:web
```

### Mobile App Issues

**Metro bundler won't start:**
```bash
# Clear Metro cache
cd packages/mobile
npx expo start -c
```

**Can't connect to API:**
- Make sure web server is running first (`npm run dev:web`)
- Check that `config.ts` has correct API URL
- If using physical device, ensure phone and computer are on same WiFi network
- For physical devices, update `baseUrl` to your computer's local IP:
  ```typescript
  baseUrl: 'http://192.168.1.X:3003/api'  // Replace X with your IP
  ```

**"Unable to resolve module" errors:**
```bash
cd packages/mobile
rm -rf node_modules
npm install
npx expo start -c
```

**Watchman errors (Mac):**
```bash
watchman shutdown-server
watchman watch-del-all
```

## Current Features (v0.4)

**Completed:**
- ✅ Web and mobile apps with full feature parity
- ✅ Authentication with Clerk (email code + password)
- ✅ Browse trainers and gyms with filters
- ✅ Session booking system (end-to-end)
- ✅ Dual-view dashboard (trainee/trainer)
- ✅ Trainer profile editing
- ✅ User profile exclusion from browse
- ✅ Role-based access and onboarding
- ✅ Supabase database with 8 tables
- ✅ Dark themed, responsive design

**Next Sprint:**
- Payment integration (Stripe)
- Real-time messaging
- Push notifications (mobile)
- Gym profile editing
- Advanced filters and search
- Reviews and ratings UI
