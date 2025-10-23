# 📅 Trainer Availability System

## Overview

The Trainer Availability System prevents double-bookings and shows trainees only available time slots when booking sessions.

## Features

✅ **Weekly Recurring Schedule** - Set your regular hours for each day
✅ **Smart Slot Detection** - Automatically blocks already-booked times
✅ **Flexible Time Slots** - 30-minute increments
✅ **Real-time Updates** - Booking form shows only truly available slots
✅ **No Double-Bookings** - System prevents conflicting bookings

## For Trainers: Setting Your Availability

### 1. Access Availability Settings
Navigate to: **http://localhost:3000/settings/availability**

### 2. Set Your Weekly Schedule
- Each day can have multiple time slots
- Click **"+ Add Time Slot"** to add hours for a day
- Select start and end times from dropdowns
- Click **"Remove"** to delete a time slot

### 3. Save Changes
- Click **"Save Availability"** when done
- Changes apply immediately to the booking system

### Example Schedule:
```
Monday:    9:00 AM - 12:00 PM, 2:00 PM - 6:00 PM
Tuesday:   9:00 AM - 5:00 PM
Wednesday: 9:00 AM - 5:00 PM
Thursday:  9:00 AM - 5:00 PM
Friday:    9:00 AM - 3:00 PM
Saturday:  10:00 AM - 2:00 PM
Sunday:    Closed
```

## For Trainees: Booking with Availability

### Updated Booking Flow:

1. **Select Date** - Choose a day from the calendar
2. **Choose Duration** - Pick session length (30 min, 1 hour, etc.)
3. **Pick Time Slot** - See only available times as clickable buttons
4. **Complete Booking** - Continue with location, notes, and payment

### What You'll See:
- ✅ **Green buttons** = Available time slots
- 🚫 **No slots shown** = Trainer not available that day
- ⏰ **Real-time** = Slots update as other trainees book

## Database Schema

### TrainerAvailability Table
```sql
id              TEXT (Primary Key)
trainerId       TEXT (FK to TrainerProfile)
dayOfWeek       INTEGER (0=Sun, 1=Mon, ..., 6=Sat)
startTime       TIME (e.g., '09:00:00')
endTime         TIME (e.g., '17:00:00')
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

### TrainerTimeOff Table (Future)
```sql
id              TEXT (Primary Key)
trainerId       TEXT (FK to TrainerProfile)
startDate       TIMESTAMP
endDate         TIMESTAMP
reason          TEXT (Optional)
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

## API Endpoints

### GET `/api/trainer-availability`
**Fetch trainer's schedule**
- Query params: `trainerId`
- Returns: Array of availability slots

### POST `/api/trainer-availability`
**Set trainer's schedule**
- Body: `{ trainerId, availability: [...] }`
- Replaces all existing slots

### GET `/api/trainer-availability/slots`
**Get available booking slots**
- Query params: `trainerId`, `date` (YYYY-MM-DD), `duration` (minutes)
- Returns: Array of ISO timestamp strings
- Checks: Existing bookings, weekly schedule

## How It Works

### Slot Generation Algorithm:
1. Get trainer's availability for the day of week
2. Fetch existing bookings for that specific date
3. Generate 30-minute slots within available hours
4. Filter out slots that:
   - Conflict with existing bookings
   - Don't fit the requested session duration
   - Are outside availability hours
5. Return only truly available slots

### Example:
```
Trainer available: 9am - 5pm
Existing booking: 2pm - 3pm (60 min session)
Duration requested: 60 min

Available slots shown:
✅ 9:00 AM
✅ 9:30 AM
✅ 10:00 AM
... (continuing)
✅ 1:00 PM
✅ 1:30 PM
❌ 2:00 PM (conflicts)
❌ 2:30 PM (conflicts)
✅ 3:00 PM
✅ 3:30 PM
✅ 4:00 PM (last slot that fits 60 min)
```

## Future Enhancements

- 🌴 **Time Off Management** - Block specific dates for vacation/sick days
- 🔔 **Buffer Times** - Add breaks between sessions
- ⚡ **Quick Templates** - Save/load common schedules
- 📊 **Analytics** - See your busiest times
- 🔄 **Recurring Exceptions** - Override schedule for specific dates

## Testing

### As a Trainer:
1. Go to `/settings/availability`
2. Set your hours
3. Save changes
4. Try booking a session with yourself using a trainee account
5. Verify only your available times appear

### As a Trainee:
1. Browse trainers
2. Click "Book Session" on any trainer
3. Select a date
4. Choose duration
5. See available time slots appear
6. Book a slot
7. Try booking same time again - should be unavailable

## Default Setup

All existing trainers automatically get:
- Monday - Friday: 9:00 AM - 5:00 PM
- Saturday & Sunday: Not available

Trainers can customize this anytime in settings.

---

**Built for Clinch v0.7** 🥊
