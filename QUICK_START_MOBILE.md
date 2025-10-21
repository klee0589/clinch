# Quick Start Guide - Mobile App

## Prerequisites

- Node.js 18+ installed
- Expo CLI (installed with npm install)
- **iOS**: Xcode and iOS Simulator (Mac only)
- **Android**: Android Studio and Android Emulator
- **Physical Device**: Expo Go app from App Store/Play Store

## Step 1: Start the Web Backend

The mobile app needs the web backend API to be running.

```bash
cd /Users/kangillee/Desktop/clinch/packages/web
npm run dev
```

Wait for:
```
✓ Ready in 3s
- Local: http://localhost:3002
```

**Keep this terminal open!**

## Step 2: Start the Mobile App

Open a **new terminal** window:

```bash
cd /Users/kangillee/Desktop/clinch/packages/mobile
npx expo start
```

Wait for the QR code to appear (may take 30-60 seconds first time).

## Step 3: Choose Your Platform

Once Expo starts, you'll see:

```
› Press i │ open iOS simulator
› Press a │ open Android emulator
› Press w │ open web browser
```

### Option A: iOS Simulator (Mac only)

1. Press **`i`**
2. iOS Simulator will open automatically
3. App will load in ~30 seconds

### Option B: Android Emulator

1. Start your Android Emulator from Android Studio first
2. Press **`a`**
3. App will install and launch

### Option C: Physical Device

1. Install **Expo Go** app from your app store
2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
3. App will load on your device

### Option D: Web Browser (for quick testing)

1. Press **`w`**
2. Opens in your default browser
3. Limited functionality (no native features)

## Step 4: Test the App

### As a Trainee:
1. Tap "Get Started" on welcome screen
2. Fill in sign up form
3. Select "I'm looking for training"
4. Browse trainers in the Browse tab
5. Tap a trainer → View profile → Book Session
6. View your bookings in Dashboard tab

### As a Trainer:
1. Sign up with a different email
2. Select "I'm a Trainer"
3. Have someone book a session with you
4. View booking requests in Dashboard
5. Accept or decline requests

## Troubleshooting

### "Waiting on http://localhost:8081" Forever

**Solution**: Kill any processes on port 8081

```bash
lsof -ti:8081 | xargs kill -9
```

Then restart Expo.

### "Waiting for Watchman" Forever

**Solution**: Restart Watchman

```bash
watchman shutdown-server
watchman version
```

Then restart Expo.

### "Connection refused" or API Errors

**Check**: Web backend is running on port 3002

```bash
curl http://localhost:3002/api/trainers-supabase
```

Should return JSON data. If not, restart web backend.

### Expo Version Warnings

**Optional**: Update Expo packages (not required, app works as-is)

```bash
cd packages/mobile
npx expo install --fix
```

### Port 3002 Instead of 3001

The web app is running on port 3002 (3001 was taken). The mobile app is already configured for this in `config.ts`.

### Clear Cache Issues

If you see bundling errors:

```bash
cd packages/mobile
npx expo start --clear
```

## Common Commands

```bash
# Start mobile app
cd packages/mobile
npx expo start

# Start mobile app (clear cache)
npx expo start --clear

# Start with tunnel (for testing on external devices)
npx expo start --tunnel

# Start iOS only
npx expo start --ios

# Start Android only
npx expo start --android

# Install missing dependencies
npm install

# Update Expo packages
npx expo install --fix
```

## Dev Tips

1. **Hot Reload**: Changes to code auto-reload in the app
2. **Shake Device**: Opens developer menu on physical device
3. **Cmd+D (iOS)** or **Cmd+M (Android)**: Opens dev menu in simulator
4. **Console Logs**: Appear in the terminal where Expo is running
5. **Network Inspect**: Use React Native Debugger or Flipper

## What's Working

✅ Authentication (Clerk)
✅ Browse trainers with search
✅ View trainer profiles
✅ Book sessions
✅ Trainee dashboard (view your bookings)
✅ Trainer dashboard (manage booking requests)
✅ Accept/decline bookings
✅ Profile view & sign out
✅ Pull to refresh on all lists
✅ Real-time price calculation
✅ Online/in-person toggle
✅ Dark mode theme

## API Configuration

**Current Setup** (in `packages/mobile/config.ts`):
```typescript
api: {
  baseUrl: 'http://localhost:3002/api'
}
```

**Change for Production**:
Update `config.ts` with your production API URL.

## Next Steps

- Test all flows (trainee and trainer)
- Try booking a session
- Test accept/decline functionality
- Check pull-to-refresh
- Try signing out and back in

## Need Help?

- Check `packages/mobile/README.md` for full documentation
- See `MOBILE_APP_SUMMARY.md` for technical details
- Review TypeScript errors: `cd packages/mobile && npx tsc --noEmit`

Happy testing! 🎉
