#!/bin/bash

# Clinch - Start All Services
# Starts both web backend and mobile app in separate terminal windows

echo "🚀 Starting Clinch Platform..."
echo ""

# Check if we're in the root directory
if [ ! -d "packages/web" ] || [ ! -d "packages/mobile" ]; then
    echo "❌ Error: Not in project root directory"
    echo "Please run this from: /Users/kangillee/Desktop/clinch"
    exit 1
fi

# Function to open new terminal and run command (macOS)
open_terminal() {
    local title=$1
    local command=$2
    osascript <<EOF
tell application "Terminal"
    activate
    set newTab to do script "cd \"$(pwd)\" && clear && echo \"$title\" && echo \"\" && $command"
    set custom title of newTab to "$title"
end tell
EOF
}

echo "📦 Starting Web Backend (port 3002)..."
open_terminal "Clinch - Web Backend" "cd packages/web && npm run dev"

echo "⏳ Waiting 5 seconds for backend to initialize..."
sleep 5

echo "📱 Starting Mobile App (Expo)..."
open_terminal "Clinch - Mobile App" "cd packages/mobile && ./start.sh"

echo ""
echo "✅ All services started!"
echo ""
echo "🌐 Web Backend: http://localhost:3002"
echo "📱 Mobile App: Check the Expo terminal for QR code"
echo ""
echo "Next steps:"
echo "  1. Wait for Expo to show QR code"
echo "  2. Press 'i' for iOS Simulator"
echo "  3. Or scan QR with Expo Go app"
echo ""
echo "To stop: Close the terminal windows or press Ctrl+C in each"
