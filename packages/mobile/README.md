# Clinch Mobile App

React Native mobile application for the Clinch platform - connecting Muay Thai trainers with trainees.

## Features

### Implemented

- **Authentication** (Clerk)
  - Sign up and sign in
  - Role-based onboarding (Trainee, Trainer, Gym Owner)
  - Secure token storage

- **Browse Trainers**
  - Search and filter trainers
  - View trainer profiles with details
  - See rates, specialties, and certifications

- **Book Sessions**
  - Select date, time, and duration
  - Choose online or in-person sessions
  - Add notes for trainers
  - Real-time price calculation

- **Dashboard**
  - My Bookings: View sessions you've booked
  - Booking Requests: Manage incoming requests (trainers)
  - Accept/decline booking requests
  - Status tracking (Pending, Confirmed, Cancelled)

- **Profile Management**
  - View user profile
  - Sign out functionality
  - Settings (coming soon)

## Tech Stack

- **React Native** with Expo 54
- **React Navigation** 7 (Stack + Bottom Tabs)
- **React Native Paper** for UI components
- **Clerk** for authentication
- **Axios** for API calls
- **TypeScript** for type safety

## Setup

### Prerequisites

- Node.js 18+
- npm
- Expo CLI (installed automatically)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# From the root of the monorepo
npm install

# Or from the mobile package directory
cd packages/mobile
npm install
```

### Configuration

The app is pre-configured to connect to:
- **API**: `http://localhost:3001/api` (web app backend)
- **Clerk**: Uses the same Clerk credentials as the web app

To change the API URL, edit `packages/mobile/config.ts`:

```typescript
export const config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  // ...
};
```

### Running the App

```bash
# From the root
npm run dev:mobile

# Or from packages/mobile
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan QR code with Expo Go app on your physical device

## Project Structure

```
packages/mobile/
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx        # Main navigation container
│   │   ├── AuthNavigator.tsx        # Auth flow screens
│   │   ├── MainNavigator.tsx        # Bottom tabs
│   │   ├── BrowseNavigator.tsx      # Browse/book flow
│   │   ├── DashboardNavigator.tsx   # Dashboard screens
│   │   └── ProfileNavigator.tsx     # Profile screens
│   ├── screens/
│   │   ├── auth/                    # Welcome, Sign In, Sign Up, Onboarding
│   │   ├── browse/                  # Trainer List, Detail, Book Session
│   │   ├── dashboard/               # My Bookings, Booking Requests
│   │   └── profile/                 # Profile, Edit, Settings
│   ├── services/
│   │   └── api.ts                   # API client (axios)
│   └── providers/
│       └── ClerkProvider.tsx        # Clerk auth wrapper
├── App.tsx                          # Main app entry
├── config.ts                        # App configuration
└── package.json
```

## Navigation Flow

```
RootNavigator
├── Auth (if not signed in)
│   ├── Welcome
│   ├── SignIn
│   ├── SignUp
│   └── Onboarding
└── Main (if signed in)
    ├── Browse Tab
    │   ├── Trainer List
    │   ├── Trainer Detail
    │   └── Book Session
    ├── Dashboard Tab
    │   ├── My Bookings
    │   └── Booking Requests (trainers)
    └── Profile Tab
        ├── Profile View
        ├── Edit Profile
        └── Settings
```

## API Integration

The mobile app connects to the web app's backend API:

- `GET /api/trainers-supabase` - List trainers
- `GET /api/trainers-supabase/:id` - Get trainer details
- `POST /api/sessions-supabase` - Create booking
- `GET /api/sessions-supabase` - List bookings
- `PATCH /api/sessions-supabase/:id` - Update booking status
- `POST /api/users/onboarding` - Complete onboarding
- `GET /api/trainee-profile` - Get trainee profile

All API calls are authenticated with Clerk tokens.

## Development

### Hot Reload

Expo provides fast refresh - changes to code will automatically reload in the app.

### Debugging

- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) to open dev menu
- Enable Remote Debugging in Chrome
- Use React Native Debugger for better experience

### TypeScript

All navigation types are defined in `src/navigation/types.ts`. TypeScript will provide autocomplete for:
- Screen names
- Route params
- Navigation props

## Building for Production

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache and restart
npx expo start -c
```

### iOS Simulator Not Opening

```bash
# Make sure Xcode is installed
xcode-select --install
```

### Android Emulator Issues

```bash
# Make sure Android Studio and emulator are installed
# Start emulator from Android Studio AVD Manager
```

### API Connection Issues

Make sure the web app is running on `http://localhost:3001`:

```bash
# In another terminal
npm run dev:web
```

## Future Enhancements

- Push notifications for booking updates
- In-app messaging between trainers and trainees
- Calendar view for sessions
- Photo upload for profiles
- Video calling for online sessions
- Offline mode with data caching
- Payment integration
- Reviews and ratings UI
- Advanced filtering and search

## License

MIT
