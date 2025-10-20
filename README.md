# Clinch - Muay Thai Trainer Marketplace

A modern marketplace platform connecting Muay Thai trainers, trainees, and gyms.

## Project Structure

```
clinch/
├── packages/
│   ├── web/          # Next.js web application
│   ├── mobile/       # React Native Expo app
│   ├── database/     # Prisma database schema and client
│   └── shared/       # Shared TypeScript types and validations
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Mobile**: React Native with Expo
- **Authentication**: Clerk
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Validation**: Zod
- **Monorepo**: npm workspaces

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Clerk account for authentication

### 1. Clone and Install

```bash
cd clinch
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Get your database connection string from Project Settings → Database → Connection String (URI)
3. Copy the connection string

### 3. Set Up Clerk

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Get your publishable and secret keys from the API Keys section
4. In Clerk Dashboard, go to User & Authentication → Email, Phone, Username → Enable email
5. Configure the sign-in and sign-up options as needed

### 4. Configure Environment Variables

#### Database Package
```bash
cd packages/database
cp .env.example .env
# Edit .env and add your DATABASE_URL from Supabase
```

#### Web Package
```bash
cd packages/web
cp .env.local.example .env.local
# Edit .env.local and add:
# - Clerk keys (from Clerk dashboard)
# - DATABASE_URL (same as database package)
```

### 5. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 6. Run Development Servers

```bash
# Web app (runs on http://localhost:3000)
npm run dev:web

# Mobile app
npm run dev:mobile

# Database studio (optional - view/edit database)
npm run db:studio
```

## Features

### Current Features (MVP v0.1)
- ✅ Modern landing page with hero section
- ✅ Browse trainers page with filtering
- ✅ Browse gyms page with filtering
- ✅ Detailed trainer profile pages
- ✅ Detailed gym profile pages
- ✅ Trainer dashboard with stats and session management
- ✅ Database schema for all entities
- ✅ Shared TypeScript types and Zod validation schemas
- ✅ Responsive dark-themed UI

### Ready to Integrate (Setup Required)
- 🔧 User authentication with Clerk (code ready, needs API keys)
- 🔧 Role-based access (Trainee, Trainer, Gym Owner)
- 🔧 Onboarding flow with role selection
- 🔧 Database connectivity with Supabase (code ready, needs connection)

### Next Phase Features
- 📋 Session booking system with calendar
- 📋 Real-time messaging between users
- 📋 Working search and filter functionality
- 📋 Profile creation and editing forms
- 📋 Payment processing with Stripe
- 📋 Review submission and moderation
- 📋 Email/push notifications
- 📋 Mobile app implementation
- 📋 Gym dashboard
- 📋 Trainee dashboard

## Database Schema

### Core Entities
- **Users**: Base user accounts linked to Clerk
- **TrainerProfiles**: Trainer-specific information (bio, rates, specialties)
- **GymProfiles**: Gym information (location, amenities, pricing)
- **TraineeProfiles**: Trainee preferences and goals
- **TrainerGyms**: Many-to-many relationship between trainers and gyms
- **Sessions**: Booking records
- **Messages**: Direct messaging
- **Reviews**: Ratings for trainers and gyms

## API Routes

### `/api/users`
- `POST`: Create new user
- `GET`: Get current user with profile

More API routes coming soon...

## Scripts

```bash
# Development
npm run dev:web              # Start web dev server
npm run dev:mobile           # Start mobile dev server

# Build
npm run build:web            # Build web app for production
npm run build:mobile         # Build mobile app

# Database
npm run db:generate          # Generate Prisma client
npm run db:migrate           # Run database migrations
npm run db:push              # Push schema to database (dev)
npm run db:studio            # Open Prisma Studio
```

## Project Conventions

### User Roles
- `TRAINEE`: Looking for training
- `TRAINER`: Offering training services
- `GYM_OWNER`: Gym facility owner
- `ADMIN`: Platform administrator

### Muay Thai Styles
- Traditional
- Dutch Style
- Golden Age
- Modern
- Fitness/Cardio

## Contributing

This is a private project. For questions or issues, contact the development team.

## License

MIT
