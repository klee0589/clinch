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

# (Optional) Seed database with sample data
cd packages/database
npm run seed
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

### Current Features (MVP v0.2)
- ✅ Modern landing page with hero section
- ✅ Browse trainers page with filtering
- ✅ Browse gyms page with filtering
- ✅ Detailed trainer profile pages
- ✅ Detailed gym profile pages
- ✅ Trainer dashboard with stats and session management
- ✅ Database schema for all entities
- ✅ Shared TypeScript types and Zod validation schemas
- ✅ Responsive dark-themed UI
- ✅ Comprehensive REST API with authentication
- ✅ Full CRUD operations for trainers, gyms, and sessions
- ✅ Advanced search and filtering capabilities
- ✅ Profile management APIs
- ✅ Complete test suite with 38 passing validation tests
- ✅ Database seeding with realistic sample data

### Ready to Integrate (Setup Required)
- 🔧 User authentication with Clerk (code ready, configured)
- 🔧 Role-based access (Trainee, Trainer, Gym Owner)
- 🔧 Onboarding flow with role selection
- 🔧 Database connectivity with Supabase (configured)

### Next Phase Features
- 📋 Frontend integration with API endpoints
- 📋 Session booking UI with calendar
- 📋 Real-time messaging between users
- 📋 Profile creation and editing forms (frontend)
- 📋 Payment processing with Stripe
- 📋 Review submission UI
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

See [API Documentation](packages/web/API.md) for complete API reference.

### Available Endpoints

#### Users
- `POST /api/users` - Create new user
- `GET /api/users` - Get current user with profile

#### Trainers
- `GET /api/trainers` - Search trainers (with filters)
- `GET /api/trainers/:id` - Get trainer details
- `PATCH /api/trainers/:id` - Update trainer profile

#### Gyms
- `GET /api/gyms` - Search gyms (with filters)
- `GET /api/gyms/:id` - Get gym details
- `PATCH /api/gyms/:id` - Update gym profile

#### Sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - Get user's sessions
- `GET /api/sessions/:id` - Get session details
- `PATCH /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

#### Profiles
- `POST /api/profiles/trainer` - Create trainer profile
- `POST /api/profiles/trainee` - Create trainee profile
- `POST /api/profiles/gym` - Create gym profile

All endpoints include:
- Authentication via Clerk
- Authorization checks
- Input validation with Zod
- Comprehensive error handling

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

# Testing
cd packages/web && npm test              # Run web tests
cd packages/shared && npm test           # Run shared package tests
cd packages/web && npm run test:watch    # Run tests in watch mode
cd packages/shared && npm run test:ui    # Open Vitest UI
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
