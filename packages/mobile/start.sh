#!/bin/bash

# Clinch Mobile App Startup Script
# This script helps you start the mobile app with proper checks

echo "🚀 Starting Clinch Mobile App..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in mobile package directory"
    echo "Please run this from: /Users/kangillee/Desktop/clinch/packages/mobile"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if web backend is running
echo "🔍 Checking if web backend is running..."
if curl -s http://localhost:3002/api/trainers-supabase > /dev/null 2>&1; then
    echo "✅ Web backend is running on port 3002"
else
    echo "⚠️  Warning: Web backend doesn't seem to be running"
    echo "   Please start it in another terminal:"
    echo "   cd /Users/kangillee/Desktop/clinch/packages/web"
    echo "   npm run dev"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if port 8081 is in use
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8081 is in use. Clearing it..."
    lsof -ti:8081 | xargs kill -9 2>/dev/null
    echo "✅ Port 8081 cleared"
fi

# Check watchman
echo "🔍 Checking Watchman..."
if command -v watchman &> /dev/null; then
    echo "✅ Watchman is installed"
    # Restart watchman to avoid issues
    watchman shutdown-server > /dev/null 2>&1
else
    echo "⚠️  Watchman not found (optional but recommended)"
    echo "   Install with: brew install watchman"
fi

echo ""
echo "🎉 Starting Expo..."
echo ""
echo "Options after startup:"
echo "  • Press 'i' for iOS Simulator"
echo "  • Press 'a' for Android Emulator"
echo "  • Press 'w' for Web Browser"
echo "  • Scan QR code with Expo Go app"
echo ""

# Start Expo
npx expo start
