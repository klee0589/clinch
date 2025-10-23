# 🥊 Clinch - Muay Thai Trainer Marketplace

> A modern platform bringing together passionate Muay Thai trainers, dedicated trainees, and world-class gyms. Train anywhere, anytime - on web or mobile.

## Project Structure

```
clinch/
├── packages/
│   ├── web/          # Next.js web application
│   ├── mobile/       # React Native Expo app (fully functional)
│   ├── database/     # Prisma database schema (not actively used)
│   └── shared/       # Shared TypeScript types and validations
├── docs/             # Organized documentation
│   ├── setup/        # Environment and service setup guides
│   ├── features/     # Feature documentation and guides
│   ├── guides/       # Project guides and release notes
│   ├── sql/          # Database migrations and seed scripts
│   └── archive/      # Deprecated files
├── .claude/          # Claude Code project rules
└── .husky/           # Git hooks for pre-commit testing
```

## 🚀 Tech Stack

| Layer | Technology | Why We Love It |
|-------|-----------|----------------|
| **Web Frontend** | Next.js 15 + React 19 + Tailwind CSS 4 | Blazing fast, modern, beautiful |
| **Mobile** | React Native + Expo 54 | Native feel, instant updates |
| **UI Components** | React Native Paper | Material Design, dark mode ready |
| **Navigation** | React Navigation 7 | Smooth, native transitions |
| **Auth** | Clerk | Passwordless magic, secure by default |
| **Database** | PostgreSQL (Supabase) | Powerful, real-time, open source |
| **API** | REST with Supabase client | Fast, type-safe, shared across platforms |
| **Caching** | React Query (TanStack Query) | Smart data caching, instant navigation |
| **Maps** | Mapbox GL JS | Interactive maps, beautiful, fast |
| **Payments** | Stripe Checkout | Secure payments, PCI compliant |
| **Validation** | Zod | Runtime type safety, great DX |
| **Testing** | Jest + Vitest | 68 passing tests, pre-commit hooks |
| **Workspace** | npm workspaces | Monorepo done right |

## ⚡ Quick Start

### What You'll Need

- ☑️ Node.js 18+ and npm
- ☑️ A free Supabase account (PostgreSQL magic)
- ☑️ A free Clerk account (auth wizardry)
- ☑️ A free Stripe account (payment processing)
- ☑️ (Optional) Your phone with Expo Go for mobile testing

### 1. Get the Code Running

```bash
cd clinch
npm install  # Grab all dependencies (~2 minutes)
```

### 2. Set Up Supabase (Your Database)

1. Head to [supabase.com](https://supabase.com) and create a free project
2. Open the SQL Editor and run these scripts in order:
   - `docs/sql/supabase-schema.sql` - Creates your data structure (tables, relationships, the works)
   - `docs/sql/supabase-seed.sql` - Adds sample data (3 trainers, 2 gyms ready to explore)
3. Grab your credentials from Project Settings → API
   - Project URL
   - Anon/public key

### 3. Set Up Clerk (Authentication Magic)

1. Sign up at [clerk.com](https://clerk.com) - it's free and takes 2 minutes
2. Create a new application (name it "Clinch" or whatever you fancy)
3. Snag your publishable and secret keys from the API Keys section
4. Configure authentication methods:
   - Navigate to User & Authentication → Email, Phone, Username
   - Enable "Email address"
   - Toggle on "Email verification code" for that passwordless experience
   - (Optional) Add OAuth providers like Google for social sign-in

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

### 6. Configure Mobile App (Optional but Awesome)

Want the mobile experience? It's the same backend, same auth - just a different view.

```bash
cd packages/mobile
```

Edit `config.ts` with your Clerk key:
```typescript
export const config = {
  clerk: {
    publishableKey: 'pk_test_...',  // Same key from step 3!
  },
  api: {
    baseUrl: 'http://localhost:3003/api',  // Points to your web server
  },
};
```

**Pro tip**: Web and mobile share everything - one Clerk account, one database, one codebase. Beautiful, right?

### 7. Fire It Up! 🔥

**Start the web app:**
```bash
npm run dev:web
```
→ Opens at `http://localhost:3003` - your command center

**Start mobile (optional):**
```bash
npm run dev:mobile  # In a new terminal
```
→ Shows a QR code - magic portal to your phone

**Using the mobile app:**
1. Install "Expo Go" from App Store or Play Store
2. **iOS**: Point your Camera app at the QR code
3. **Android**: Open Expo Go, tap "Scan QR code"
4. Watch it load on your phone - same data, native feel
5. Sign in with the same account you created on web

**The beauty**: Both apps hit the same API, use the same database. Create a booking on web, see it on mobile instantly.

### 8. Create Your First Account

1. Head to `http://localhost:3003`
2. Hit "Get Started" - let's create something
3. Choose your path:
   - 🥋 **Trainee**: Looking to learn and book sessions
   - 💪 **Trainer**: Share your knowledge, manage bookings
   - 🏢 **Gym Owner**: Manage your facility (coming soon)

## ✨ What's Built (v0.6 - Payments, Availability & Testing)

### 🔐 Authentication & Onboarding
The modern way - passwordless by default, secure by design.

- **Passwordless Email Codes**: No passwords to remember (web & mobile)
- **Optional Password Auth**: Toggle available on mobile for flexibility
- **Email Verification**: Secure 6-digit codes for new accounts
- **Secure Storage**: Tokens safely stored with expo-secure-store on mobile
- **Role Selection**: Choose your path - Trainee, Trainer, or Gym Owner
- **Auto Profile Creation**: Your profile is ready the moment you sign up
- **Shared Sessions**: Sign in once, use anywhere - web or mobile

### 🔍 Browse & Discovery
Find the perfect trainer or gym for your journey.

- **Smart Filtering**: Search by city, state, rate, online availability
- **Smart Sorting**: By rating, experience, or price
- **Clean Results**: You won't see yourself in the trainer list (that'd be weird)
- **Rich Profiles**: See bios, certifications, specialties, experience, pricing
- **Gym Listings**: Browse facilities with amenities and pricing
- **Native Mobile Feel**: Pull-to-refresh, smooth scrolling, instant load

### 📅 Booking System
The complete flow - from discovery to done.

**For Trainees:**
- Book sessions in seconds with your favorite trainers
- Pick dates, times, duration (30min to 3 hours)
- Choose online or in-person training
- Add notes for your trainer
- Watch the price calculate in real-time
- Available on web and mobile

**For Trainers:**
- View all incoming booking requests
- Accept or decline with one tap
- See trainee details and session info
- Manage your schedule effortlessly

**Dual Dashboard Views:**
- **My Bookings**: Your training sessions as a trainee
- **Booking Requests**: Incoming requests as a trainer
- Filter by status: All, Pending, Confirmed, Completed
- Real-time status updates (no refresh needed)
- Color-coded status badges for quick scanning
- Native mobile lists with smooth animations

### 💳 Payment Processing
Secure, PCI-compliant payments with Stripe Checkout.

**Payment Flow:**
- Automatic redirect to Stripe Checkout after booking
- Professional hosted payment page (no PCI compliance needed)
- Support for all major credit/debit cards
- Real-time payment status tracking
- Automatic session confirmation on successful payment
- Webhook integration for payment events

**Payment Status Display:**
- **Unpaid** (Gray): Session created, awaiting payment
- **Pending** (Yellow): Payment in progress at Stripe
- **Paid** (Green): Payment successful, session confirmed
- **Refunded** (Blue): Payment refunded (future feature)

**Session Management:**
- Delete unpaid sessions (declutter your dashboard)
- Paid/pending sessions protected from deletion
- Smart deletion rules prevent data loss

**Database Integration:**
- Payment tracking with `stripePaymentIntentId`
- Checkout session tracking with `stripeCheckoutSessionId`
- Payment status field with multiple states
- Indexed for fast payment lookups

**Security:**
- Webhook signature verification
- Environment variable protection for API keys
- No sensitive payment data stored locally
- Stripe handles PCI compliance

**API Endpoints:**
- `/api/stripe/create-checkout-session` - Creates Stripe checkout
- `/api/stripe/webhook` - Handles payment confirmations
- `/api/sessions-supabase/[id]` - Delete with payment validation

**Test Mode:**
- Full test card support for development
- Stripe CLI webhook forwarding
- No real money processing in test mode

### 📅 Trainer Availability System
Smart scheduling prevents double-bookings and conflicts.

**Weekly Schedules:**
- Trainers set recurring weekly availability
- Multiple time slots per day (e.g., 9am-12pm, 2pm-6pm)
- 30-minute slot increments for booking precision
- Easy-to-use time picker interface

**Smart Slot Generation:**
- Only shows available time slots when booking
- Automatically filters out:
  - Existing bookings (no conflicts)
  - Trainer time-off periods
  - Times outside availability hours
- Real-time slot updates based on session duration

**Conflict Prevention:**
- Database-level validation prevents overlaps
- Algorithm checks availability + bookings + time-off
- Trainees can't book unavailable times
- Trainers won't get double-booked

**API Endpoints:**
- `/api/trainer-availability` - Manage weekly schedules
- `/api/trainer-availability/slots` - Get available slots for booking

**Database Tables:**
- `TrainerAvailability` - Weekly recurring schedules
- `TrainerTimeOff` - Vacation and blocked dates

### 🧪 Comprehensive Testing
Production-ready test coverage with automated quality checks.

**Test Coverage (68 tests total):**
- **Session Management** (9 tests): Creation, deletion rules, validation
- **Payment System** (11 tests): Status transitions, calculations, webhooks
- **Trainer Availability** (10 tests): Scheduling, conflicts, slot generation
- **Shared Validations** (38 tests): Zod schemas, data validation

**Automated Testing:**
- Pre-commit hooks run all tests before commits
- Git push blocked if tests fail
- Prettier auto-formatting on commit
- Zero tolerance for failing tests

**Real Bugs Caught:**
- Session ID passing bug (response.data.id)
- Payment status deletion bug (PAID sessions protected)
- Timezone issues (UTC consistency)

**Test Documentation:**
- See `docs/features/TESTING_GUIDE.md` for full details
- Test templates and examples included
- Run tests: `npm test` (all), `npm run test:web` (web only)

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
- 68 passing tests across all packages
  - 30 API/feature tests (Jest)
  - 38 validation tests (Vitest)
- Pre-commit hooks with Husky
- Automated test runner blocks bad commits
- Prettier code formatting on commit
- GitHub repository integration
- See `docs/features/TESTING_GUIDE.md` for details

#### Profile Management
- **Trainer Profile Editing**: Complete profile management interface
  - Bio editing with rich text area
  - Specialty selection (Traditional, Modern, Dutch, Golden Age, Fitness)
  - Experience years and hourly rate settings
  - Certification management (add/remove)
  - Location settings (city, state, country)
  - Online availability toggle
  - Real-time form validation and save feedback
- Accessible via user menu dropdown (My Profile)
- API endpoint for profile updates (`PATCH /api/trainers-supabase/[id]`)

#### UI/UX
- Modern, responsive design with Tailwind CSS 4
- Dark mode support throughout
- Consistent header navigation with DRY principle (Next.js layouts)
- User menu dropdown with profile access
  - Dashboard
  - My Profile (edit trainer profile)
  - Settings
  - Sign Out
- Loading states and error handling
- Toast notifications for user actions
- Smooth transitions and hover effects
- Mobile-responsive layouts

### 🔧 Ready for Enhancement

- ✅ ~~Payment processing integration (Stripe)~~ **DONE! v0.6**
- ✅ ~~Trainer availability management~~ **DONE! v0.6**
- ✅ ~~Session deletion with payment validation~~ **DONE! v0.6**
- ✅ ~~Comprehensive test suite with pre-commit hooks~~ **DONE! v0.6**
- Payment refunds and cancellations
- Trainer payout system (Stripe Connect)
- Time-off management for trainers (vacation blocking)
- Real-time messaging between users
- Email/SMS notifications for bookings
- Review and rating system UI
- Trainee and gym profile editing forms
- Advanced search with more filters
- Languages field for trainer profiles (migration script ready: `docs/sql/add-languages-column.sql`)
- Calendar view for session scheduling
- Subscription plans for gyms (Stripe Subscriptions)
- Promo codes and discounts (Stripe Coupons)

### 📱 Mobile App - Your Gym in Your Pocket

Everything you love about the web, now native on iOS and Android.

**Complete Feature Set:**
- Browse trainers anywhere, anytime
- View rich trainer profiles with all the details
- Book sessions on the go
- Manage your training schedule
- Accept/decline bookings as a trainer
- Profile management and sign out

**Native Experience:**
- Material Design with React Native Paper
- Buttery smooth bottom tab navigation
- Dark mode that's easy on the eyes
- Lightning fast with Expo
- Pull-to-refresh everywhere
- Native scrolling and animations

**The Magic:** Same Clerk auth, same API, same database as web. Start a booking on your laptop, finish it on your phone.

### 🚧 Coming Soon

The roadmap is exciting. Here's what's next:

- 📹 **Video Calling**: Face-to-face training for online sessions
- 🔔 **Push Notifications**: Never miss a booking update (mobile)
- 💬 **In-App Messaging**: Chat with your trainer or trainee
- 📊 **Progress Tracking**: Log workouts, track your journey
- 📸 **Media Uploads**: Add photos and videos to your profile
- 🏋️ **Gym Memberships**: Manage subscriptions and access
- 🗓️ **Class Scheduling**: Group classes for gyms
- 🎛️ **Admin Dashboard**: Platform management tools
- 📈 **Analytics**: Insights for trainers and gym owners

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

## 🎉 Recent Updates

### v0.6 - Payments, Availability & Testing (January 2025)

**💳 Stripe Payment Processing:**
- Complete Stripe Checkout integration for secure payments
- Automatic redirect to hosted payment page after booking
- Real-time payment status tracking (Unpaid, Pending, Paid, Refunded)
- Webhook integration for payment confirmation events
- Automatic session confirmation on successful payment
- Database fields for payment tracking (`stripePaymentIntentId`, `stripeCheckoutSessionId`, `paymentStatus`)
- Test mode with Stripe test cards for development
- PCI compliance handled by Stripe (no sensitive data stored)

**🗑️ Session Deletion with Payment Validation:**
- Delete button for unpaid sessions
- Paid/pending sessions protected from deletion
- Smart validation prevents data loss
- Clean up cluttered dashboards safely

**📅 Trainer Availability System:**
- Weekly recurring availability schedules
- Multiple time slots per day
- 30-minute increment slot generation
- Smart conflict detection (no double-bookings)
- Time-off periods support
- Real-time available slots in booking form
- UTC timezone consistency
- Database tables: `TrainerAvailability`, `TrainerTimeOff`

**🧪 Comprehensive Testing Suite:**
- 68 total tests passing (30 web + 38 shared)
- Session management tests (creation, deletion, validation)
- Payment system tests (status transitions, calculations, webhooks)
- Availability tests (scheduling, conflicts, slot generation)
- Pre-commit hooks block failing tests
- Automated test running before every commit
- Caught real bugs: session ID passing, payment deletion, timezone issues

**🐛 Bug Fixes:**
- Fixed user dropdown z-index issue
- Session ID passing bug in BookingForm (`response.data.id`)
- UTC timezone handling in availability system
- Test environment variable mocking

**📚 Documentation:**
- Reorganized into `docs/` folder structure
- `docs/setup/` - Environment and service setup
- `docs/features/` - Feature guides (payments, availability, testing)
- `docs/sql/` - All database migrations
- `docs/guides/` - Project guides and release notes
- Added `.claude/rules.md` - Project conventions for AI assistants
- `TESTING_GUIDE.md` - Complete testing documentation
- `TRAINER_AVAILABILITY_GUIDE.md` - Availability system architecture

**🎯 Database Migrations:**
- `docs/sql/add-stripe-payment-fields.sql` - Payment tracking fields
- `docs/sql/add-trainer-availability.sql` - Availability tables and constraints

### v0.5 - Maps & Performance (January 2025)

**🗺️ Interactive Maps:**
- Mapbox GL JS integration for beautiful, interactive maps
- Map view toggle on Browse Trainers page (List/Map)
- Automatic geocoding of trainer locations with Mapbox API
- Cached coordinates in database for instant loading
- Fallback coordinates for major US cities
- Custom map markers with popups showing trainer info
- Location maps on individual trainer and gym detail pages
- Dark theme maps matching app aesthetic

**📍 Enhanced Location Data:**
- Trainers can now add detailed addresses (street, city, state, ZIP, country)
- More precise map markers with full address support
- Helpful prompts encouraging complete location data
- Better geocoding accuracy with detailed addresses

**⚡ Major Performance Optimizations:**
- React Query integration for intelligent data caching
  - 2-minute cache for trainer lists
  - 5-minute cache for individual profiles
  - Instant navigation with cached data
- Optimized database queries (50% faster)
  - Removed unnecessary joins
  - Selective field fetching
  - Query result limiting (50 trainers)
- Removed auth checks from public endpoints
- HTTP cache headers (60s cache, 120s stale-while-revalidate)
- Next.js optimizations: SWC minification, package imports
- Database coordinate caching eliminates redundant geocoding

**🔍 Smarter Filters:**
- Specialty filters now auto-apply instantly (no "Apply" button needed)
- Fixed specialty filtering with proper array overlap queries
- Real-time filter application for better UX
- All other filters still use manual "Apply Filters" button

**Performance Results:**
- First load: ~2-3s (down from 5-11s)
- Subsequent loads: ~200-400ms (down from 3-5s)
- Route changes: ~100-300ms (instant with cache)
- 90% reduction in geocoding API calls

### v0.4 - Mobile Launch Edition (January 2025)

**🚀 Mobile App is Live!**
- Native iOS and Android apps with complete feature parity
- Built with Expo 54 and React Native Paper
- Passwordless authentication (just like the web)
- Browse, book, and manage - all from your phone
- Pull-to-refresh, native scrolling, dark mode
- Same backend, same data, different device

**✨ Trainer Features:**
- Full profile editing - update your bio, rates, specialties
- Manage certifications and availability
- Access everything from the user menu

**🔧 UX Polish:**
- Your profile won't show up when browsing trainers anymore
- Smoother email verification flow
- Password toggle option for mobile flexibility
- Consistent navigation everywhere

**December 2025 (v0.3)**
- Implemented complete booking system with session creation
- Added dual-view dashboard (trainee/trainer perspectives)
- Trainer can accept/decline booking requests
- Real-time session status updates
- Sign-out functionality
- Fixed trainee profile requirement for bookings
- Database-level foreign key constraints enforced
- Comprehensive error handling and user feedback
