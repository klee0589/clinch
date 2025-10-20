# Clinch - Muay Thai Trainer Marketplace

A modern marketplace platform connecting Muay Thai trainers, trainees, and gyms.

## Project Structure

```
clinch/
├── packages/
│   ├── web/          # Next.js web application
│   ├── mobile/       # React Native Expo app (not implemented yet)
│   ├── database/     # Prisma database schema and client
│   └── shared/       # Shared TypeScript types and validations
├── .husky/           # Git hooks for pre-commit testing
└── SQL scripts/      # Database setup and seed scripts
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Mobile**: React Native with Expo (planned)
- **Authentication**: Clerk
- **Database**: PostgreSQL (Supabase) with direct REST API client
- **Validation**: Zod
- **Testing**: Jest (web), Vitest (shared)
- **Monorepo**: npm workspaces
- **CI/CD**: Husky pre-commit hooks with automated testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase)
- Clerk account for authentication

### 1. Clone and Install

```bash
cd clinch
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL scripts in Supabase SQL Editor:
   - `supabase-schema.sql` - Creates all tables, enums, and indexes
   - `supabase-seed.sql` - Seeds sample data (3 trainers, 2 gyms, etc.)
3. Get your project URL and anon key from Project Settings → API

### 3. Set Up Clerk

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Get your publishable and secret keys from the API Keys section
4. In Clerk Dashboard:
   - Go to User & Authentication → Email, Phone, Username → Enable email
   - Configure OAuth providers (Google, etc.) if desired

### 4. Configure Environment Variables

#### Web Package
```bash
cd packages/web
cp .env.local.example .env.local
```

Edit `.env.local` and add:
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Set Up Database

**Note**: We use Supabase REST API directly instead of Prisma due to connection issues.

```bash
# Run schema setup in Supabase SQL Editor
# 1. Copy contents of supabase-schema.sql
# 2. Paste into Supabase SQL Editor
# 3. Execute

# Run seed data
# 1. Copy contents of supabase-seed.sql
# 2. Paste into Supabase SQL Editor
# 3. Execute

# To add a trainee profile for testing bookings:
# 1. Copy contents of add-trainee-profile.sql
# 2. Update the user ID to match your account
# 3. Execute in SQL Editor
```

### 6. Run Development Server

```bash
# Web app (runs on http://localhost:3001)
npm run dev:web
```

### 7. Create Test Account

1. Navigate to http://localhost:3001
2. Click "Get Started" to sign up
3. Complete onboarding and select your role:
   - **Trainee**: To book sessions with trainers
   - **Trainer**: To receive and manage booking requests
   - **Gym Owner**: To manage gym profile (future feature)

## Features

### ✅ Implemented Features (MVP v0.3)

#### Authentication & Onboarding
- User authentication with Clerk (sign-up, sign-in, sign-out)
- Role-based onboarding (Trainee, Trainer, Gym Owner)
- Automatic profile creation based on role selection
- User session management with Clerk

#### Browse & Discovery
- Browse trainers page with real-time filtering
  - Filter by city, state, rate range, online availability
  - Sort by rating, experience, hourly rate
- Browse gyms page with search capabilities
- Trainer detail pages with full profile information
  - Bio, certifications, specialties, experience
  - Training locations, pricing, availability
  - User profile integration with Clerk data
- Gym detail pages with amenities and pricing

#### Booking System (Complete End-to-End)
- **Book Sessions**: Trainees can book sessions with trainers
  - Date/time picker with validation
  - Duration selection (30min - 3 hours)
  - Online vs in-person toggle
  - Location input for in-person sessions
  - Notes field for special requests
  - Real-time price calculation
- **Manage Bookings**: Dual-view dashboard
  - "My Bookings" view: See sessions you've booked as trainee
  - "Booking Requests" view: See incoming requests as trainer
  - Accept/Decline buttons for trainers
  - Real-time status updates (PENDING → CONFIRMED/CANCELLED)
  - Filter by status (All, Pending, Confirmed, Completed)
- **Session Details**: Complete session information
  - Trainer/Trainee info with profile pictures
  - Date, time, duration, location
  - Price breakdown and payment status
  - Status badges with color coding

#### Database & API
- Complete Supabase database schema with 8 tables
- REST API endpoints using Supabase client:
  - `/api/trainers-supabase` - List/search trainers
  - `/api/trainers-supabase/[id]` - Get trainer by ID
  - `/api/gyms-supabase` - List/search gyms
  - `/api/sessions-supabase` - Create/list sessions with view modes
  - `/api/sessions-supabase/[id]` - Update session status
  - `/api/users/me` - Get current user
  - `/api/users/onboarding` - Complete onboarding with role
  - `/api/trainee-profile` - Get trainee profile by user ID
- Supabase RLS (Row Level Security) configured
- Foreign key relationships and constraints
- Sample seed data (3 trainers, 2 gyms, 3 trainees)

#### Testing & CI/CD
- 38 passing validation tests (Zod schemas)
- Pre-commit hooks with Husky
- Automated test runner before git commits
- Prettier code formatting on commit
- GitHub repository integration

#### UI/UX
- Modern, responsive design with Tailwind CSS 4
- Dark mode support throughout
- Loading states and error handling
- Toast notifications for user actions
- Smooth transitions and hover effects
- Mobile-responsive layouts

### 🔧 Ready for Enhancement

- Payment processing integration (Stripe)
- Real-time messaging between users
- Email/SMS notifications
- Review and rating system UI
- Profile editing forms (trainer/trainee/gym)
- Advanced search with more filters
- Calendar view for session scheduling
- Trainer availability management

### 📋 Planned Features

- Mobile app (React Native/Expo)
- Video calling for online sessions
- Workout tracking and progress
- Photo/video upload for profiles
- Gym membership management
- Class scheduling for gyms
- Admin dashboard
- Analytics and reporting

## Database Schema

### Core Entities

- **User**: Base user account linked to Clerk
  - Fields: clerkId, email, firstName, lastName, imageUrl, role
  - Role: TRAINEE, TRAINER, GYM_OWNER, ADMIN

- **TrainerProfile**: Trainer-specific information
  - Fields: bio, hourlyRate, experienceYears, specialties, certifications
  - Relationships: User (1:1), TrainerGyms (1:N), Sessions (1:N)

- **GymProfile**: Gym facility information
  - Fields: name, description, amenities, pricing, location
  - Relationships: User (1:1), TrainerGyms (1:N)

- **TraineeProfile**: Trainee preferences and goals
  - Fields: goals, experienceLevel, fitnessLevel, injuries
  - Relationships: User (1:1), Sessions (1:N)

- **TrainerGym**: Many-to-many relationship between trainers and gyms
  - Links trainers to the gyms where they teach

- **Session**: Booking records
  - Fields: scheduledAt, duration, price, status, location, isOnline
  - Status: PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
  - Relationships: Trainer (N:1), Trainee (N:1)

- **Message**: Direct messaging (planned)
- **Review**: Ratings and reviews (planned)

## API Routes

### Current Endpoints

#### Users
- `GET /api/users/me` - Get current authenticated user
- `POST /api/users/onboarding` - Complete onboarding with role selection

#### Trainers
- `GET /api/trainers-supabase` - Search trainers with filters
  - Query params: city, state, minRate, maxRate, availableForOnline, minRating
- `GET /api/trainers-supabase/[id]` - Get trainer by ID with full profile

#### Gyms
- `GET /api/gyms-supabase` - Search gyms with filters
  - Query params: city, state, amenities, minRating

#### Sessions
- `GET /api/sessions-supabase` - List sessions for current user
  - Query params: status, view (trainee/trainer)
  - Returns sessions where user is trainer or trainee based on view mode
- `POST /api/sessions-supabase` - Create new booking
  - Body: trainerId, traineeId, scheduledAt, duration, price, location, isOnline, notes
- `PATCH /api/sessions-supabase/[id]` - Update session status
  - Body: status (CONFIRMED, CANCELLED, etc.)

#### Profiles
- `GET /api/trainee-profile?userId={id}` - Get trainee profile by user ID

All endpoints include:
- Authentication via Clerk
- Authorization checks
- Input validation with Zod
- Comprehensive error handling

## Scripts

```bash
# Development
npm run dev:web              # Start web dev server

# Build
npm run build:web            # Build web app for production

# Testing
npm test                     # Run all tests (pre-commit hook)
npm run test:web             # Run web tests
cd packages/shared && npm test           # Run shared package tests

# Git Hooks
npm run prepare              # Install Husky hooks
```

## Development Workflow

### Making Changes

1. Make your code changes
2. Test locally with `npm run dev:web`
3. Commit changes: `git add . && git commit -m "Your message"`
4. Pre-commit hook automatically:
   - Runs all 38 validation tests
   - Formats code with Prettier
   - Blocks commit if tests fail
5. Push to GitHub: `git push`

### Adding New Features

1. Update database schema in `supabase-schema.sql` if needed
2. Add/update API endpoints in `packages/web/app/api/`
3. Create/update UI components in `packages/web/components/`
4. Add validation schemas in `packages/shared/src/validations/`
5. Write tests for new validations
6. Update this README with new features

### Testing Different User Roles

1. **As Trainee**:
   - Sign up → Select "I'm looking for training"
   - Browse trainers → Book session
   - View bookings in Dashboard → "My Bookings" tab

2. **As Trainer**:
   - Sign up with different email
   - Select "I'm a Trainer"
   - Have someone book you (or use another account)
   - View Dashboard → "Booking Requests" tab
   - Accept/Decline bookings

3. **Sign Out**: Click "Sign Out" button in dashboard header

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

### Session Status Flow
```
PENDING → (Trainer accepts) → CONFIRMED → COMPLETED
       ↓ (Trainer declines)
     CANCELLED
```

## Troubleshooting

### Database Connection Issues

If you see Prisma connection errors, the app uses Supabase REST API as a workaround:
- All endpoints use `/api/*-supabase` routes
- Direct Supabase client instead of Prisma
- Same functionality, different implementation

### Can't Book Sessions

Make sure you have a trainee profile:
1. Run `add-trainee-profile.sql` with your user ID
2. Or create a new account and select "Trainee" role

### Pre-commit Hook Fails

If tests fail on commit:
```bash
# Run tests manually to see errors
npm test

# Fix issues, then commit again
git add .
git commit -m "Your message"
```

## Contributing

This is a private project. For questions or issues, contact the development team.

## License

MIT

## Recent Updates

**December 2025 (v0.3)**
- Implemented complete booking system with session creation
- Added dual-view dashboard (trainee/trainer perspectives)
- Trainer can accept/decline booking requests
- Real-time session status updates
- Sign-out functionality
- Fixed trainee profile requirement for bookings
- Database-level foreign key constraints enforced
- Comprehensive error handling and user feedback
