# 🚀 Supabase Database Setup Instructions

Your app is running on **http://localhost:3001**! Now let's set up the database.

## 📝 Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/zzxfdjoxddjmzhhytxzx/editor
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query** button

### Step 2: Create Database Schema

1. Open the file: `supabase-schema.sql` (in your project root)
2. **Copy ALL the contents** (Cmd+A, then Cmd+C)
3. **Paste into Supabase SQL Editor**
4. Click **Run** button (or press Cmd+Enter)
5. Wait for it to complete (should take 5-10 seconds)
6. You should see: ✅ "Database schema created successfully!"

### Step 3: Add Sample Data

1. Open the file: `supabase-seed.sql` (in your project root)
2. **Copy ALL the contents** (Cmd+A, then Cmd+C)
3. **Paste into Supabase SQL Editor** (in a new query)
4. Click **Run** button (or press Cmd+Enter)
5. Wait for it to complete (should take 2-3 seconds)
6. You should see: ✅ "Sample data created successfully!" with counts

### Step 4: Verify Tables Created

1. In Supabase Dashboard, click **Table Editor** in the left sidebar
2. You should see all these tables:
   - User
   - TrainerProfile
   - GymProfile
   - TraineeProfile
   - Session
   - Message
   - Review
   - TrainerGym

### Step 5: Test the App

Your app is already running on **http://localhost:3001**

Now you can:
1. **Browse Trainers**: Go to `/browse/trainers`
   - You'll see 3 trainers: Samart, Buakaw, Ramon
   - Try the filters!

2. **Browse Gyms**: Go to `/browse/gyms`
   - You'll see 2 gyms: Yokkao, Fairtex

3. **View Dashboard**: Go to `/dashboard`
   - You'll see sample sessions

## 🎯 Sample Data Included

### Trainers (3)
1. **Samart Payakaroon** - Bangkok, Thailand - $150/hr
   - Styles: Traditional, Golden Age
   - 30 years experience
   - Rating: 4.9/5

2. **Buakaw Banchamek** - Pattaya, Thailand - $200/hr
   - Styles: Modern, Traditional
   - 25 years experience
   - Rating: 5.0/5

3. **Ramon Dekkers** - Amsterdam, Netherlands - $175/hr
   - Styles: Dutch, Modern
   - 20 years experience
   - Rating: 4.8/5

### Gyms (2)
1. **Yokkao Training Center** - Bangkok
2. **Fairtex Muay Thai** - Pattaya

### Sessions (3)
- 1 confirmed upcoming session
- 1 pending session
- 1 completed session

## 🐛 Troubleshooting

### If SQL fails to run:
1. Make sure you copied **ALL** the content
2. Run `supabase-schema.sql` first, then `supabase-seed.sql`
3. Check for error messages in the SQL editor
4. If tables already exist, you can drop them first or skip schema creation

### To start fresh:
Run this in SQL Editor first:
```sql
DROP TABLE IF EXISTS "Review" CASCADE;
DROP TABLE IF EXISTS "Message" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "TrainerGym" CASCADE;
DROP TABLE IF EXISTS "TraineeProfile" CASCADE;
DROP TABLE IF EXISTS "TrainerProfile" CASCADE;
DROP TABLE IF EXISTS "GymProfile" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TYPE IF EXISTS "UserRole";
DROP TYPE IF EXISTS "SessionStatus";
DROP TYPE IF EXISTS "ExperienceLevel";
DROP TYPE IF EXISTS "MuayThaiStyle";
```

Then run `supabase-schema.sql` and `supabase-seed.sql` again.

## ✅ Success!

Once you've run both SQL files, your app is **100% functional**!

Visit: **http://localhost:3001**

Enjoy your Muay Thai marketplace! 🥊
