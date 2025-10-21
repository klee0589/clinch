# 🥊 Clinch - Quick Setup Guide

> Get your Muay Thai marketplace running in 15 minutes. Web + Mobile. Let's go!

## ⚡ What You're Building

You're about to set up a complete, production-ready marketplace that works on:
- 💻 **Web** - Next.js 15 with Tailwind CSS
- 📱 **Mobile** - Native iOS & Android with Expo

Both apps share the same backend, auth, and database. Write code once, deploy everywhere.

## 📋 Before You Start

Grab these free accounts (5 minutes total):
- ✅ Node.js 18+ and npm (check: `node --version`)
- ✅ [Clerk account](https://clerk.com) - Authentication magic
- ✅ [Supabase account](https://supabase.com) - PostgreSQL database
- ✅ (Optional) Phone with Expo Go app for mobile testing

## 🎯 What You'll Have When Done

### 💻 Web App (`http://localhost:3003`)
- Beautiful trainer and gym marketplace
- Complete booking system (create, manage, accept/decline)
- Trainer profile editing
- Dual dashboard views (trainee + trainer perspectives)
- Passwordless authentication with email codes

### 📱 Mobile App (iOS & Android)
- Everything from the web, now in your pocket
- Native feel with smooth animations
- Pull-to-refresh, bottom tabs, dark mode
- Same account works on both web and mobile
- Start booking on laptop, finish on phone

---

## 🚀 Let's Build This Thing

### Step 1: Install Dependencies (2 minutes)

```bash
cd clinch
npm install  # Installs web, mobile, shared packages
```

☕ Grab a coffee. This installs ~1500 packages (monorepo life).

### Step 2: Set Up Clerk (3 minutes)

**What it does:** Passwordless authentication for web + mobile. No passwords, no problems.

1. Hit up [dashboard.clerk.com/sign-up](https://dashboard.clerk.com/sign-up)
2. Create your free account (you'll love it)
3. Click "+ Create application"
4. Name it "Clinch" (or "Awesome Muay Thai App", your call)
5. Pick "Email" as your auth method
6. Fine-tune it:
   - Navigate to "User & Authentication" → "Email, Phone, Username"
   - Toggle on "Email address"
   - Enable "Email verification code" (the magic passwordless bit)
7. Grab your keys from the dashboard

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

**Pro tip:** Mobile and web use the SAME Clerk keys. Copy once, use everywhere. 🎯

### Step 3: Set Up Supabase (5 minutes)

**What it does:** Your PostgreSQL database, hosted and ready. Stores users, trainers, sessions, all the good stuff.

#### Create the Project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign up (free tier is generous)
3. Click "+ New project"
4. Name: "clinch" (or whatever speaks to you)
5. Set a strong password and SAVE IT (you'll need this later)
6. Pick a region close to you (lower latency = happy users)
7. Wait ~2 minutes while Supabase spins up your database ☕

#### Get Your Keys
1. Open Project Settings (⚙️ icon) → API tab
2. Copy your "Project URL"
3. Copy your "anon public" key

#### Configure the Web App
Add these to `packages/web/.env.local`:
```env
# Add to existing file
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Create the Database Tables
1. In Supabase dashboard, open the **SQL Editor** (left sidebar)
2. Open `SQL scripts/supabase-schema.sql` from your project
3. Copy all the SQL
4. Paste into SQL Editor
5. Hit "Run" and watch the magic happen ✨

This creates 8 tables: User, TrainerProfile, GymProfile, TraineeProfile, Session, Review, Message, TrainerGym.

#### Add Sample Data (Recommended)
1. Open `SQL scripts/supabase-seed.sql`
2. Copy, paste into SQL Editor, Run
3. You now have 3 sample trainers, 2 gyms, ready to explore

#### Verify It Worked
- Click "Table Editor" in Supabase sidebar
- You should see all 8 tables populated
- 🎉 Database is live!

### Step 4: Launch! 🚀

#### Start the Web App
```bash
npm run dev:web
```

💥 Opens at `http://localhost:3003`

You should see the Clinch homepage. Click around, browse trainers, check out the UI.

#### Start Mobile (Optional)
Open a NEW terminal:
```bash
npm run dev:mobile
```

This fires up the Expo Metro bundler and shows you a QR code.

#### Connect Your Phone
1. Install "Expo Go" from App Store (iOS) or Play Store (Android)
2. **iOS users**: Open your Camera app, point at the QR code
3. **Android users**: Open Expo Go, tap "Scan QR code"
4. Watch your app load on your phone 📱

**Note**: Phone and computer must be on the same WiFi network.

---

## 🧪 Test Drive Your Platform

### Web App Flow

#### 1. Create Your Account
- Hit "Get Started" at `http://localhost:3003`
- Enter your email
- Check your inbox for a 6-digit code (passwordless magic!)
- Verify and choose your role:
  - 🥋 **Trainee**: Book and train
  - 💪 **Trainer**: Teach and earn
  - 🏢 **Gym Owner**: Coming soon

#### 2. Explore the Marketplace
- Click "Browse" → "Trainers"
- Try the filters: city, rate range, online availability
- Click a trainer to see their full profile (bio, certs, pricing)

#### 3. Book a Session
- On any trainer profile, click "Book Session"
- Pick a date, time, and duration
- Choose online or in-person
- Add notes if you want
- Submit and watch the price calculate

#### 4. Manage Your Schedule
- Navigate to "Dashboard"
- **As Trainee**: View "My Bookings" - sessions you've booked
- **As Trainer**: Check "Booking Requests" - incoming bookings to accept/decline
- Filter by status, watch real-time updates

### Mobile App Experience

Try the same flows on your phone:
1. Open the app via Expo Go
2. Sign in with the SAME account you just created on web
3. Browse trainers (pull down to refresh - feels native!)
4. Book a session
5. Check your dashboard
6. Notice how data syncs instantly between web and mobile

**The sync is real:** Book on web, see it on mobile. Accept a booking on mobile, see it update on web. Same database, same auth, different devices.

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
