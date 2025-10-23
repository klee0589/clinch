# 🧪 Testing Guide

## Overview

Clinch uses Jest for testing to catch bugs before they reach production. Tests automatically run before every Git commit.

## Test Coverage

### ✅ What We Test

**1. Session Management (`sessions.test.ts`)**
- Session creation validation
- Required fields checking
- Session deletion rules (UNPAID vs PENDING vs PAID)
- Data format validation

**2. Payment System (`payment.test.ts`)**
- Payment status transitions (UNPAID → PENDING → PAID)
- Price calculations (hourly rate * duration)
- Stripe amount conversion (dollars to cents)
- Session ID passing (caught the `response.data.id` bug!)
- Webhook signature validation
- Payment metadata requirements

**3. Availability System (`availability.test.ts`)**
- Day of week validation (0-6)
- Time slot validation (start < end)
- 30-minute increment validation
- Slot conflict detection
- Slot generation within availability hours
- Date filtering and timezone handling

## Running Tests

### Manually Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run tests for specific package
npm run test --workspace=@clinch/web
```

### Automatic Testing
Tests automatically run:
- ✅ **Before every Git commit** (via pre-commit hook)
- ✅ **Before every push** (coming soon - pre-push hook)

## Pre-Commit Hook

Location: `.husky/pre-commit`

The hook runs:
1. **`npm test`** - All test suites must pass
2. **`npx lint-staged`** - Linting and formatting

**If tests fail, the commit is blocked!**

## Test Results

Current Status: **✅ 30/30 tests passing**

```
Test Suites: 3 passed, 3 total
Tests:       30 passed, 30 total
Time:        ~0.8s
```

### Test Breakdown:
- **Session Tests**: 9 tests
- **Payment Tests**: 11 tests
- **Availability Tests**: 10 tests

## Writing New Tests

### Test File Location
```
packages/web/app/api/__tests__/
├── sessions.test.ts
├── payment.test.ts
└── availability.test.ts
```

### Test Template
```typescript
import { describe, it, expect } from '@jest/globals';

describe('Feature Name Tests', () => {
  describe('Sub-feature', () => {
    it('should validate something', () => {
      const result = someFunction();
      expect(result).toBe(expected);
    });
  });
});
```

### Common Assertions
```typescript
// Equality
expect(value).toBe(expected);
expect(value).toEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Numbers
expect(number).toBeGreaterThan(5);
expect(number).toBeLessThanOrEqual(10);

// Arrays/Objects
expect(array).toContain(item);
expect(array).toHaveLength(3);
```

## Real Bugs Caught by Tests

### 1. Session ID Bug (Payment System)
**Bug**: Accessing `response.id` instead of `response.data.id`
**Test**: `payment.test.ts` - "should pass session ID correctly to checkout"
**Fix**: Updated BookingForm.tsx line 75

### 2. Timezone Issues (Availability)
**Bug**: Date calculations using local time instead of UTC
**Test**: `availability.test.ts` - "should match day of week correctly"
**Fix**: Use `getUTCDay()` and `setUTCHours()`

### 3. Payment Status Deletion (Sessions)
**Bug**: Could delete PAID sessions (data loss risk!)
**Test**: `sessions.test.ts` - "should prevent deletion of PAID sessions"
**Prevention**: Added backend validation in DELETE endpoint

## CI/CD Integration (Future)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
```

## Test Configuration

**Jest Config**: `packages/web/jest.config.js`
- Uses Next.js Jest config
- JSX/DOM environment
- Path aliases (`@/` → root)

**Setup File**: `packages/web/jest.setup.js`
- Imports jest-dom matchers
- Mocks environment variables

## Best Practices

### ✅ DO:
- Write tests for critical business logic
- Test edge cases (negative numbers, null values)
- Test error conditions
- Keep tests simple and focused
- Use descriptive test names

### ❌ DON'T:
- Test implementation details
- Mock everything (test real behavior when possible)
- Write flaky tests (random failures)
- Skip failing tests (fix or remove them)
- Test external APIs directly (use mocks)

## Mocking

### Mocking Supabase
```typescript
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      // ...
    })),
  },
}));
```

### Mocking Clerk Auth
```typescript
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(() => ({ userId: 'test-user-id' })),
}));
```

## Troubleshooting

### Tests Fail Locally
```bash
# Clear Jest cache
npm test -- --clearCache

# Check for syntax errors
npm run lint

# Run in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Pre-Commit Hook Not Running
```bash
# Reinstall Husky
npm run prepare

# Check hook is executable
chmod +x .husky/pre-commit

# Manually test hook
./.husky/pre-commit
```

### Skip Pre-Commit (Emergency Only!)
```bash
# Skip hooks (NOT RECOMMENDED)
git commit --no-verify -m "message"
```

## Future Enhancements

- [ ] Add E2E tests with Playwright
- [ ] Add component tests with React Testing Library
- [ ] Set up GitHub Actions CI/CD
- [ ] Add test coverage requirements (80%+)
- [ ] Add performance tests for API endpoints
- [ ] Add visual regression tests

---

**Keep tests green!** 🟢

Never commit failing tests. Fix them or remove them.
