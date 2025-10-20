# 🚀 Clinch - Quick Start Guide

Get your Muay Thai marketplace up and running in minutes!

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (already configured)
- Clerk account (already configured)

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Supabase Database Password

Visit: https://supabase.com/dashboard/project/zzxfdjoxddjmzhhytxzx/settings/database

1. Click **Database** in settings
2. Find **Connection string** section
3. Click **URI** tab and **Show**
4. Copy the password (between `:` and `@`)

### 3. Configure Database

Edit `packages/database/.env`:
```bash
DATABASE_URL="postgresql://postgres:[PASTE-YOUR-PASSWORD]@db.zzxfdjoxddjmzhhytxzx.supabase.co:5432/postgres"
```

### 4. Test Connection (Optional but Recommended)

```bash
node test-connection.js
```

If successful, continue. If not, check DATABASE_SETUP.md.

### 5. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Create all database tables
npm run db:push

# Add sample data (3 trainers, 2 gyms, 3 trainees)
cd packages/database
npm run seed
cd ../..
```

### 6. Start Application

```bash
npm run dev:web
```

Visit: **http://localhost:3000**

## 🎯 What You Can Do Now

### Browse Trainers
- Go to http://localhost:3000/browse/trainers
- Use filters to search by:
  - Location (city, state)
  - Hourly rate range
  - Muay Thai styles
  - Ratings
  - Online availability

### View Dashboard
- Go to http://localhost:3000/dashboard
- See all your training sessions
- Filter by status (pending, confirmed, completed)

### Sign Up / Sign In
- Click "Sign In" or "Get Started"
- Create account with email
- Choose your role (Trainee, Trainer, Gym Owner)

## 📁 Sample Data

After seeding, you'll have:

### Trainers
1. **Samart Payakaroon** - Traditional/Golden Age - $150/hr - Bangkok
2. **Buakaw Banchamek** - Modern/Traditional - $200/hr - Pattaya
3. **Ramon Dekkers** - Dutch/Modern - $175/hr - Amsterdam

### Gyms
1. **Yokkao Training Center** - Bangkok
2. **Fairtex Muay Thai** - Pattaya

### Features
- Browse and search trainers
- Filter by multiple criteria
- View detailed profiles
- Book training sessions
- Dashboard with session management

## 🔑 Already Configured

✅ **Clerk Authentication**
- Publishable Key: pk_test_c291Z2h0LWNoZWV0YWgtOTUuY2xlcmsuYWNjb3VudHMuZGV2JA
- Sign in/up flows ready

✅ **Supabase**
- Project URL: https://zzxfdjoxddjmzhhytxzx.supabase.co
- API keys configured
- Just needs database password

✅ **API Endpoints**
- 9+ REST endpoints
- Full CRUD operations
- Authentication & authorization
- Input validation

✅ **Frontend**
- React components
- Dark mode
- Responsive design
- Loading states
- Error handling

✅ **Testing**
- 38 validation tests passing
- Jest + Vitest configured

## 🛠️ Available Commands

### Development
```bash
npm run dev:web              # Start web app
npm run dev:mobile           # Start mobile app
```

### Database
```bash
npm run db:generate          # Generate Prisma client
npm run db:push              # Push schema to database
npm run db:migrate           # Run migrations
npm run db:studio            # Open database GUI
```

### Testing
```bash
cd packages/web && npm test              # Run web tests
cd packages/shared && npm test           # Run validation tests
node test-connection.js                  # Test database connection
```

## 🐛 Troubleshooting

### Database Connection Issues?
Run: `node test-connection.js`

It will tell you exactly what's wrong and how to fix it.

### Can't Find Password?
See: `DATABASE_SETUP.md` for detailed instructions

### Build Errors?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 Already in Use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev:web -- -p 3001
```

## 📚 Documentation

- **DATABASE_SETUP.md** - Detailed database setup guide
- **README.md** - Full project documentation
- **packages/web/API.md** - Complete API reference
- **SETUP.md** - Original setup guide

## 🎉 You're Ready!

Everything is configured and ready to go. Just:
1. Add your database password
2. Run the setup commands
3. Start the app

Visit http://localhost:3000 and start exploring your Muay Thai marketplace!

## 🆘 Need Help?

- Check DATABASE_SETUP.md for detailed guides
- Run test-connection.js to diagnose issues
- Check the API docs at packages/web/API.md
- Review console logs for error messages

---

**Built with:** Next.js 15, React 19, Prisma, Supabase, Clerk, TypeScript, Tailwind CSS

**Repository:** https://github.com/klee0589/clinch
