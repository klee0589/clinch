# How to Run the Clinch Mobile App

## Three Ways to Start

### Option 1: Simple (Manual)

**Terminal 1 - Start Web Backend:**
```bash
cd /Users/kangillee/Desktop/clinch/packages/web
npm run dev
```

**Terminal 2 - Start Mobile App:**
```bash
cd /Users/kangillee/Desktop/clinch/packages/mobile
npx expo start
```

Then press **`i`** for iOS or **`a`** for Android

---

### Option 2: With Helper Script (Recommended)

**Terminal 1 - Start Web Backend:**
```bash
cd /Users/kangillee/Desktop/clinch/packages/web
npm run dev
```

**Terminal 2 - Start Mobile with Checks:**
```bash
cd /Users/kangillee/Desktop/clinch/packages/mobile
./start.sh
```

The script automatically:
- Checks if web backend is running
- Clears port 8081 if needed
- Restarts Watchman
- Starts Expo

---

### Option 3: Start Everything (Easiest)

**One Command:**
```bash
cd /Users/kangillee/Desktop/clinch
./start-all.sh
```

Opens two terminal windows automatically:
1. Web backend on port 3002
2. Mobile app with Expo

---

## What You'll See

### Web Backend Terminal
```
▲ Next.js 15.5.6
- Local:        http://localhost:3002
✓ Ready in 3s
```

### Mobile App Terminal
```
Starting project at .../packages/mobile
Starting Metro Bundler
...
› Metro waiting on exp://192.168.1.x:8081

› Scan the QR code above with Expo Go (Android) or Camera (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

---

## Running on Different Devices

### iOS Simulator (Mac Only)
1. Wait for Expo to start
2. Press **`i`**
3. Simulator opens automatically
4. App loads in 30-60 seconds

### Android Emulator
1. Start emulator from Android Studio
2. Wait for Expo to start
3. Press **`a`**
4. App installs and launches

### iPhone (Physical)
1. Install "Expo Go" from App Store
2. Open Camera app
3. Scan QR code from terminal
4. Tap "Open in Expo Go"

### Android Phone (Physical)
1. Install "Expo Go" from Play Store
2. Open Expo Go app
3. Scan QR code from terminal
4. App loads

---

## Common Issues & Solutions

### Issue: "Waiting on http://localhost:8081" forever

**Solution:**
```bash
lsof -ti:8081 | xargs kill -9
```
Then restart Expo.

---

### Issue: "Waiting for Watchman" forever

**Solution:**
```bash
watchman shutdown-server
```
Then restart Expo.

---

### Issue: "Connection refused" or API errors

**Check web backend:**
```bash
curl http://localhost:3002/api/trainers-supabase
```

Should return JSON. If not, restart web backend.

---

### Issue: Expo won't start at all

**Full reset:**
```bash
cd /Users/kangillee/Desktop/clinch/packages/mobile

# Kill everything
ps aux | grep expo | awk '{print $2}' | xargs kill -9

# Clear caches
rm -rf .expo node_modules
npm install

# Start fresh
npx expo start --clear
```

---

## Testing the App

### Test as Trainee:
1. "Get Started" → Sign up
2. Select "I'm looking for training"
3. Browse → Tap trainer → Book Session
4. Dashboard → "My Bookings"

### Test as Trainer:
1. Sign up (different email)
2. Select "I'm a Trainer"
3. Get someone to book you
4. Dashboard → "Booking Requests"
5. Accept or decline

---

## Development Commands

```bash
# Start normally
npx expo start

# Start with cleared cache
npx expo start --clear

# Start and open iOS
npx expo start --ios

# Start and open Android
npx expo start --android

# Start with tunnel (for external testing)
npx expo start --tunnel

# Update packages
npx expo install --fix
```

---

## Need More Help?

- 📖 Full docs: `packages/mobile/README.md`
- 🔧 Technical details: `MOBILE_APP_SUMMARY.md`
- 🚀 Quick start: `QUICK_START_MOBILE.md`
- 📝 Main README: Root `README.md`

---

## Summary

**Web Backend**: Must be running on port 3002
**Mobile App**: Connects to http://localhost:3002/api
**Auth**: Same Clerk credentials as web app
**Platforms**: iOS, Android, Web, Physical devices

The mobile app is **100% functional** with full feature parity to the web app! 🎉
