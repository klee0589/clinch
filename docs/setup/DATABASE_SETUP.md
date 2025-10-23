# Database Setup Guide

## Getting Your Supabase Database Password

To complete the database setup, you need to get your Supabase database password:

### Step 1: Access Your Supabase Project
Go to: https://supabase.com/dashboard/project/zzxfdjoxddjmzhhytxzx

### Step 2: Get Database Password

1. Click on **Settings** (gear icon) in the left sidebar
2. Click on **Database**
3. Scroll down to the **Connection string** section
4. Select the **URI** tab
5. Click **Show** to reveal the connection string

You'll see something like:
```
postgresql://postgres.zzxfdjoxddjmzhhytxzx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Or in the **Connection pooling** section:
```
postgresql://postgres:[YOUR-PASSWORD]@db.zzxfdjoxddjmzhhytxzx.supabase.co:5432/postgres
```

Copy the password (the part between `:` and `@`).

### Step 3: Update Environment Files

#### Update `packages/database/.env`:
```bash
DATABASE_URL="postgresql://postgres:[PASTE-PASSWORD-HERE]@db.zzxfdjoxddjmzhhytxzx.supabase.co:5432/postgres"
```

#### Update `packages/web/.env.local`:
```bash
DATABASE_URL="postgresql://postgres:[PASTE-PASSWORD-HERE]@db.zzxfdjoxddjmzhhytxzx.supabase.co:5432/postgres"
```

### Step 4: Set Up Database

Run these commands in order:

```bash
# 1. Generate Prisma client
npm run db:generate

# 2. Push schema to Supabase (creates all tables)
npm run db:push

# 3. Seed database with sample data
cd packages/database
npm run seed
```

### Step 5: Start the Application

```bash
# From project root
npm run dev:web
```

Visit http://localhost:3000

## What's Already Configured

✅ Supabase API keys (for client-side requests)
✅ Clerk authentication keys
✅ All API endpoints
✅ Frontend components
✅ Database schema

## Troubleshooting

### Can't Find Password?

If you can't find the password:
1. Go to Settings > Database
2. Look for "Reset Database Password" button
3. Reset it and use the new password

### Connection Errors?

Make sure:
- Password has no spaces at beginning/end
- You're using the correct connection string format
- Port is 5432 for direct connection
- Port is 6543 for connection pooling (recommended for production)

### RLS (Row Level Security)

After pushing the schema, you may want to set up Row Level Security policies in Supabase:
1. Go to Authentication > Policies in Supabase dashboard
2. Enable RLS for sensitive tables
3. Create policies based on your auth requirements

For development, RLS can be disabled on tables, but enable it for production.
