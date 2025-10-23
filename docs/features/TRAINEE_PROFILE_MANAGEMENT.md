# Trainee Profile Management for Trainers

## Overview

This feature allows trainers to manage detailed profiles for their trainees, including:
- **Session notes**: Add notes after training sessions
- **Progress photos**: Upload photos to track physical progress
- **Technique videos**: Record/upload videos of trainees' technique
- **Media gallery**: View all photos and videos for each trainee
- **Session history**: See all past sessions with a trainee

## Use Cases

1. **Progress Tracking**: Upload photos every 4 weeks to show body transformation
2. **Technique Documentation**: Record videos of pad work, bag work, clinch techniques
3. **Session Notes**: Document what was covered, areas for improvement, injuries to watch
4. **Client Communication**: Show trainees their progress visually
5. **Training Plans**: Reference past sessions when planning future training

## Database Schema

### TrainerNotes Table
```sql
CREATE TABLE "TrainerNotes" (
  "id" TEXT PRIMARY KEY,
  "trainerId" TEXT NOT NULL,
  "traineeId" TEXT NOT NULL,
  "sessionId" TEXT, -- Optional link to specific session
  "note" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);
```

**Fields:**
- `trainerId`: Reference to TrainerProfile
- `traineeId`: Reference to TraineeProfile
- `sessionId`: Optional - link note to specific session
- `note`: The actual note content
- `createdAt/updatedAt`: Timestamps

### TraineeMedia Table
```sql
CREATE TABLE "TraineeMedia" (
  "id" TEXT PRIMARY KEY,
  "trainerId" TEXT NOT NULL,
  "traineeId" TEXT NOT NULL,
  "sessionId" TEXT, -- Optional link to specific session
  "mediaType" TEXT NOT NULL, -- 'photo' or 'video'
  "mediaUrl" TEXT NOT NULL, -- Supabase Storage URL
  "thumbnailUrl" TEXT, -- For videos
  "description" TEXT,
  "fileSizeBytes" INTEGER,
  "durationSeconds" INTEGER, -- For videos
  "createdAt" TIMESTAMP NOT NULL
);
```

**Fields:**
- `mediaType`: Either 'photo' or 'video'
- `mediaUrl`: Full URL to file in Supabase Storage
- `thumbnailUrl`: Thumbnail for video preview
- `description`: Optional caption/description
- `fileSizeBytes`: File size for storage tracking
- `durationSeconds`: Video duration (future feature)

## File Storage Structure

Files stored in Supabase Storage bucket: `trainee-media`

```
trainee-media/
├── trainer_[trainerId]/
│   ├── trainee_[traineeId]/
│   │   ├── photos/
│   │   │   └── 20250123_abc123.jpg
│   │   └── videos/
│   │       ├── 20250123_def456.mp4
│   │       └── 20250123_def456_thumb.jpg
```

**File Naming Convention:**
- Format: `[YYYYMMDD]_[UUID].[extension]`
- Example: `20250123_a1b2c3d4.jpg`

**File Limits:**
- Photos: 10 MB max
- Videos: 100 MB max
- Formats: JPEG, PNG, WebP, MP4, MOV, WebM

## API Endpoints

### Check if User is Trainer
```
GET /api/user/is-trainer
```

Returns whether the authenticated user has a trainer profile.

**Response:**
```json
{
  "isTrainer": true
}
```

### Get Trainees List
```
GET /api/trainer-trainees
```

Returns all trainees the authenticated trainer has worked with (from paid sessions only).

**Response:**
```json
{
  "data": [
    {
      "id": "trainee_123",
      "userId": "user_456",
      "goals": ["Weight Loss", "Fitness"],
      "experienceLevel": "Beginner",
      "fitnessLevel": "Average",
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "imageUrl": "https://..."
      },
      "sessionCount": 12,
      "lastSessionDate": "2025-01-20T10:00:00Z",
      "noteCount": 8,
      "mediaCount": 15
    }
  ]
}
```

### Get Notes for Trainee
```
GET /api/trainer-notes?traineeId=xxx
```

Returns all notes for a specific trainee.

**Response:**
```json
{
  "data": [
    {
      "id": "note_123",
      "trainerId": "trainer_456",
      "traineeId": "trainee_789",
      "sessionId": "session_abc",
      "note": "Great progress on jab-cross combo. Focus on hip rotation next session.",
      "createdAt": "2025-01-20T11:00:00Z",
      "updatedAt": "2025-01-20T11:00:00Z",
      "Session": {
        "scheduledAt": "2025-01-20T10:00:00Z",
        "duration": 60,
        "status": "COMPLETED"
      }
    }
  ]
}
```

### Create Note
```
POST /api/trainer-notes
Content-Type: application/json

{
  "traineeId": "trainee_123",
  "sessionId": "session_456", // optional
  "note": "Excellent technique today. Ready to move to advanced combos."
}
```

### Update Note
```
PATCH /api/trainer-notes/[id]
Content-Type: application/json

{
  "note": "Updated note content"
}
```

### Delete Note
```
DELETE /api/trainer-notes/[id]
```

### Get Media for Trainee
```
GET /api/trainee-media?traineeId=xxx&mediaType=photo
```

Query params:
- `traineeId` (required): ID of trainee
- `mediaType` (optional): Filter by 'photo' or 'video'

**Response:**
```json
{
  "data": [
    {
      "id": "media_123",
      "trainerId": "trainer_456",
      "traineeId": "trainee_789",
      "mediaType": "photo",
      "mediaUrl": "https://supabase.co/storage/trainee-media/...",
      "description": "Progress photo - 4 week mark",
      "fileSizeBytes": 2048000,
      "createdAt": "2025-01-20T11:00:00Z"
    }
  ]
}
```

### Upload Media
```
POST /api/trainee-media
Content-Type: multipart/form-data

file: [File object]
traineeId: trainee_123
sessionId: session_456 (optional)
description: Progress photo - 8 week mark (optional)
```

### Delete Media
```
DELETE /api/trainee-media/[id]
```

Deletes both the database record and the file from Supabase Storage.

## Security

**Authentication:**
- All endpoints require Clerk authentication
- User must have a trainer profile
- "My Trainees" menu link only visible to users with trainer profiles

**Authorization:**
- Trainers can only access trainees they've trained (paid sessions)
- Trainers can only CRUD their own notes and media
- Enforced at API level with trainer ID checks
- UI conditionally renders trainer-specific features based on `/api/user/is-trainer` endpoint

**File Upload Security:**
- MIME type validation (server-side)
- File size limits enforced
- Private storage bucket (not publicly accessible)
- Filenames sanitized with UUID

**Row Level Security (RLS):**
- Enabled on TrainerNotes and TraineeMedia tables
- Policies allow trainers to access only their own data

## UI Flow

### 1. My Trainees List Page
**Route:** `/my-trainees`

Shows cards/table of all trainees:
- Trainee name and photo
- Session count
- Last session date
- Number of notes and media files
- Click to view detailed profile

### 2. Trainee Profile Page
**Route:** `/my-trainees/[traineeId]`

Tabs:
1. **Overview**: Basic info, goals, fitness level
2. **Sessions**: List of all past sessions
3. **Notes**: All notes for this trainee (add/edit/delete)
4. **Photos**: Photo gallery with upload
5. **Videos**: Video gallery with upload

Features:
- Add note button (opens modal/form)
- Upload media button (opens upload modal)
- Camera capture button (mobile optimized)
- Delete media (with confirmation)
- Filter media by date range

### 3. Add Note Modal
- Text area for note content
- Optional: Link to specific session
- Save/Cancel buttons

### 4. Upload Media Modal
Options:
- **Take Photo**: Opens camera (mobile-optimized)
- **Record Video**: Opens video recorder
- **Upload from Device**: File picker
- Add description field
- Preview before upload
- Upload progress indicator

## Camera Capture Component

Uses browser MediaStream API:
```typescript
navigator.mediaDevices.getUserMedia({
  video: { facingMode: 'environment' },
  audio: false
})
```

Features:
- Switch between front/back camera (mobile)
- Capture photo or record video
- Preview before saving
- Fallback to file upload if camera not available

## Future Enhancements

- [ ] Video thumbnails (auto-generate from first frame)
- [ ] Video playback with controls
- [ ] Image editing (crop, rotate, filters)
- [ ] Bulk upload multiple files
- [ ] Share media with trainee (via email or in-app)
- [ ] Progress comparison (side-by-side photos)
- [ ] Video annotations (draw on video frames)
- [ ] Export trainee report (PDF with notes and photos)
- [ ] Media tags/categories (e.g., "before", "after", "technique")
- [ ] Search notes by keyword
- [ ] Video duration tracking and display

## Testing Checklist

- [ ] Can only see own trainees
- [ ] Can add/edit/delete notes
- [ ] File upload validates type and size
- [ ] Camera capture works on mobile
- [ ] Media deletes from both DB and storage
- [ ] Unauthorized users blocked
- [ ] Large file uploads show progress
- [ ] Error handling for storage failures
- [ ] Notes display with correct session info
- [ ] Media gallery loads quickly (pagination)

## Setup Instructions

1. **Run SQL migration:**
   ```bash
   # In Supabase SQL Editor
   Run: docs/sql/add-trainer-trainee-notes.sql
   ```

2. **Set up Supabase Storage:**
   - Follow: `docs/setup/SUPABASE_STORAGE_SETUP.md`
   - Create `trainee-media` bucket
   - Configure storage policies
   - Set file size limits

3. **Environment variables:**
   Already configured in `.env.local`

4. **Test API endpoints:**
   - Get trainees list
   - Add test note
   - Upload test photo

## Cost Considerations

**Storage:**
- Free tier: 1 GB storage
- Estimated: 50 MB per trainee (100 trainees = 5 GB)
- Cost: ~$0.10/month per GB on paid tier

**Bandwidth:**
- Free tier: 2 GB/month
- Image views and video streams count toward bandwidth
- Cost: ~$0.09/GB on paid tier

**Optimization:**
- Use image transformations for thumbnails
- Lazy load gallery images
- Compress photos before upload (client-side)
- Limit video length (e.g., max 2 minutes)

---

**Ready to build the UI!** 🚀

This feature will significantly enhance the trainer-trainee relationship and provide valuable documentation for training progress.
