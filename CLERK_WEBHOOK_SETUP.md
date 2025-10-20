# Clerk Webhook Setup Instructions

The app now includes a Clerk webhook to automatically sync users from Clerk to your Supabase database.

## Local Development Setup

For local testing, you'll need to expose your localhost to the internet so Clerk can send webhooks to it.

### Option 1: Using ngrok (Recommended)

1. Install ngrok:
   ```bash
   brew install ngrok
   ```

2. Start ngrok to expose port 3001:
   ```bash
   ngrok http 3001
   ```

3. ngrok will give you a public URL like: `https://abc123.ngrok.io`

4. Go to Clerk Dashboard: https://dashboard.clerk.com
   - Navigate to **Webhooks** in the left sidebar
   - Click **Add Endpoint**
   - Enter your ngrok URL + webhook path: `https://abc123.ngrok.io/api/webhooks/clerk`
   - Subscribe to these events:
     - `user.created`
     - `user.updated`
     - `user.deleted`
   - Copy the **Signing Secret**

5. Add the signing secret to your `.env.local`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

6. Restart your dev server

### Option 2: Deploy to Production

1. Deploy your app to Vercel/Netlify/etc.
2. Use your production URL for the webhook endpoint
3. Add the webhook secret to your environment variables

## Testing the Webhook

1. Sign up for a new account at http://localhost:3001/sign-up
2. Check your Supabase database - a new user should be created in the `User` table
3. Update your profile in Clerk - the changes should sync to Supabase
4. The user will be redirected to `/onboarding` to select their role

## Authentication Flow

1. **Sign Up** → User creates account with Clerk
2. **Webhook** → Clerk sends `user.created` event to your API
3. **Database** → User created in Supabase with default role `TRAINEE`
4. **Onboarding** → User redirected to `/onboarding` to select role
5. **Role Selection** → User chooses TRAINEE, TRAINER, or GYM_OWNER
6. **Profile Creation** → Appropriate profile (TrainerProfile, TraineeProfile, or GymProfile) is created
7. **Dashboard** → User redirected to their dashboard

## Protected Routes

The middleware protects these routes (requires authentication):
- `/dashboard`
- `/profile/*`
- `/sessions/*`
- `/messages/*`

Public routes (no authentication required):
- `/` (homepage)
- `/browse/trainers`
- `/browse/gyms`
- `/sign-in`
- `/sign-up`

## Troubleshooting

### Webhook not firing:
- Check ngrok is running and URL is correct
- Verify webhook is enabled in Clerk Dashboard
- Check webhook logs in Clerk Dashboard
- Ensure `CLERK_WEBHOOK_SECRET` is set in `.env.local`

### User not created in database:
- Check Supabase connection is working
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check API logs for errors: `/api/webhooks/clerk`

### ClerkProvider error:
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- Check that ClerkProvider wraps your app in `layout.tsx`
