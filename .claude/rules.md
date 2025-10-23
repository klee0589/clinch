# Clinch Project Rules

## Project Overview
Clinch is a Muay Thai trainer and trainee marketplace platform built with Next.js, React Native, Supabase, and Stripe.

## Architecture

### Monorepo Structure
```
clinch/
├── packages/
│   ├── web/          # Next.js web app
│   ├── mobile/       # React Native/Expo app
│   ├── shared/       # Shared utilities and validations
│   └── database/     # Prisma schema (not actively used)
```

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Mobile**: React Native, Expo
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk
- **Payments**: Stripe Checkout + Webhooks
- **Maps**: Mapbox GL JS
- **Testing**: Jest (web), Vitest (shared)

## Development Guidelines

### Testing Requirements
- **ALL code changes must have tests**
- Tests automatically run on pre-commit via Husky
- Never commit failing tests
- Test files location: `packages/web/app/api/__tests__/`
- Run tests: `npm test` (runs all 68 tests across workspaces)
- Current test suites:
  - `sessions.test.ts` - Session management (9 tests)
  - `payment.test.ts` - Stripe payments (11 tests)
  - `availability.test.ts` - Trainer scheduling (10 tests)
  - `packages/shared/src/__tests__/validations.test.ts` - Validations (38 tests)

### Code Style
- Use TypeScript for all new files
- Follow existing patterns in the codebase
- Use Tailwind CSS for styling (no custom CSS files)
- Prefer server components over client components when possible
- Use `"use client"` directive only when necessary (forms, state, interactivity)

### Database & API Patterns

#### Supabase Usage
```typescript
// Always use server-side Supabase client
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for API routes
);
```

#### API Response Format
```typescript
// Success response
return NextResponse.json({ data: result });

// Error response
return NextResponse.json({ error: 'Error message' }, { status: 400 });

// Always access data as: response.data.id (NOT response.id)
```

#### Running SQL Migrations
1. Write SQL file in root directory (e.g., `add-feature.sql`)
2. Document in PR/commit what SQL needs to be run
3. User runs SQL manually in Supabase dashboard
4. Never use Prisma migrate (we use raw SQL for Supabase)

### Payment System Rules

#### Payment Status Flow
```
UNPAID → PENDING → PAID
```
- **UNPAID**: Session created, no payment attempted
- **PENDING**: Stripe checkout session created, awaiting payment
- **PAID**: Payment completed via webhook

#### Session Deletion Rules
- ✅ **UNPAID**: Can be deleted by user
- ❌ **PENDING**: Cannot be deleted (payment in progress)
- ❌ **PAID**: Cannot be deleted (data integrity)

#### Stripe Integration
- Use Stripe Checkout for payments (not Payment Intents directly)
- Always validate webhook signatures
- Store these IDs: `stripeCheckoutSessionId`, `stripePaymentIntentId`
- Test mode cards: `4242 4242 4242 4242` (any future date, any CVC)
- Webhook endpoint: `/api/stripe/webhook`
- Local webhook testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Authentication
- Use Clerk for authentication
- Get user ID: `const { userId } = await auth()`
- Protect API routes with auth check
- Store `userId` as `trainerId` or `traineeId` in database

### UI/UX Guidelines
- Use shadcn/ui components when available
- Mobile-first responsive design
- Use proper z-index layering:
  - Header: `z-50`
  - Dropdowns/Modals: `z-[100]`
  - Overlays: `z-[200]`
- Show payment status badges: UNPAID (gray), PENDING (yellow), PAID (green)

### Trainer Availability System
- Weekly recurring schedules stored in `TrainerAvailability` table
- Time slots generated in 30-minute increments
- Conflict detection prevents double-bookings
- All times stored in UTC, converted for display
- Day of week: 0=Sunday, 6=Saturday (JavaScript convention)
- Algorithm: Check trainer availability → filter existing sessions → filter time-off → generate slots

### File Organization
```
packages/web/
├── app/
│   ├── (main)/              # Protected routes
│   │   ├── dashboard/       # User dashboard
│   │   ├── trainers/        # Trainer listings
│   │   └── settings/        # User settings
│   ├── api/                 # API routes
│   │   ├── __tests__/       # API tests
│   │   ├── sessions-supabase/
│   │   ├── stripe/
│   │   └── trainer-availability/
│   └── (auth)/              # Public auth routes
├── components/
│   ├── layout/              # Header, Footer, UserMenu
│   ├── sessions/            # BookingForm, SessionCard
│   └── ui/                  # shadcn/ui components
└── lib/                     # Utilities, Supabase client
```

### Environment Variables

#### Required for Web App
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=
```

### Common Patterns

#### Creating a New API Route
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  // 1. Authenticate
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Get Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3. Query database
  const { data, error } = await supabase
    .from('Table')
    .select('*')
    .eq('userId', userId);

  // 4. Handle errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 5. Return data
  return NextResponse.json({ data });
}
```

#### Writing Tests
```typescript
import { describe, it, expect } from '@jest/globals';

describe('Feature Tests', () => {
  describe('Sub-feature', () => {
    it('should validate expected behavior', () => {
      const result = someFunction();
      expect(result).toBe(expected);
    });

    it('should handle edge cases', () => {
      const edgeCase = someFunction(edgeCaseInput);
      expect(edgeCase).toBeTruthy();
    });
  });
});
```

### Git Workflow
1. Make changes
2. Run `npm test` to verify tests pass
3. Stage changes: `git add .`
4. Commit: `git commit -m "message"` (tests run automatically via pre-commit hook)
5. Push: `git push`

### Commit Message Format
```
Add [feature] and [feature] (v0.x)

Brief description of what was added/changed.

**Feature Category**
- Bullet point of specific change
- Another specific change

**Another Category**
- More changes

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Important Reminders

### Do's ✅
- Write tests for all new features
- Use UTC for all date/time operations
- Validate payment status before allowing operations
- Check authentication on all API routes
- Use proper error handling with try-catch
- Return consistent API response format
- Update documentation when adding features

### Don'ts ❌
- Never skip pre-commit hooks (tests must pass)
- Never use Prisma migrations (use raw SQL)
- Never store sensitive data in git (use .env.local)
- Never access `response.id` (use `response.data.id`)
- Never use local time (always UTC)
- Never allow deletion of PAID sessions
- Never commit without running tests first

## Key Files to Reference
- `TESTING_GUIDE.md` - Testing documentation and examples
- `TRAINER_AVAILABILITY_GUIDE.md` - Availability system architecture
- `PAYMENT_FLOW_DIAGRAM.md` - Payment flow documentation
- `SETUP.md` - Environment setup instructions
- `README.md` - Project overview and getting started

## Debugging Tips

### Payment Issues
1. Check Stripe dashboard test mode
2. Verify webhook is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Check `STRIPE_WEBHOOK_SECRET` in `.env.local`
4. Verify session has correct payment status in database

### Database Issues
1. Check Supabase dashboard for data
2. Verify Row Level Security (RLS) policies
3. Use service role key in API routes (not anon key)
4. Check SQL syntax in Supabase SQL editor

### Test Failures
1. Clear Jest cache: `npm test -- --clearCache`
2. Check for timezone issues (use UTC methods)
3. Verify environment variables in `jest.setup.js`
4. Run tests in watch mode: `npm run test:watch`

## Workspace Commands
```bash
# Development
npm run dev:web          # Start web app
npm run dev:mobile       # Start mobile app

# Testing
npm test                 # Run all tests (shared + web)
npm run test:web         # Run web tests only
npm run test:shared      # Run shared tests only

# Database
npm run db:generate      # Generate Prisma types (not used)
npm run db:studio        # Open Prisma Studio (not used)

# Building
npm run build:web        # Build web app
npm run build:mobile     # Build mobile app
```

## Production Considerations
- [ ] Set up environment variables in production
- [ ] Configure Stripe webhook endpoint in production dashboard
- [ ] Set up proper logging and error tracking
- [ ] Configure CORS for mobile app
- [ ] Set up CI/CD pipeline with GitHub Actions
- [ ] Add rate limiting to API routes
- [ ] Set up database backups
- [ ] Configure proper RLS policies in Supabase

---

**Last Updated**: Version 0.6 - Added testing, trainer availability, and session deletion features
