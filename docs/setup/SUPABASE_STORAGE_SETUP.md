# Supabase Storage Setup for Trainee Media

This guide explains how to set up Supabase Storage for trainee photos and videos.

## Why Supabase Storage?

- **Integrated**: Works seamlessly with Supabase database
- **Secure**: Row Level Security policies for access control
- **CDN**: Fast global delivery
- **Cost-effective**: Generous free tier
- **Transformations**: Automatic image resizing and optimization

## Setup Steps

### 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Configure:
   - **Name**: `trainee-media`
   - **Public bucket**: ❌ **OFF** (keep private)
   - **File size limit**: 50 MB (adjust as needed)
   - **Allowed MIME types**:
     - `image/jpeg`
     - `image/png`
     - `image/webp`
     - `video/mp4`
     - `video/quicktime` (for iPhone .mov files)

### 2. Set Up Storage Policies

Click on the `trainee-media` bucket → **Policies** tab → Add these policies:

#### Policy 1: Trainers can upload files
```sql
CREATE POLICY "Trainers can upload to trainee-media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'trainee-media'
  -- Additional auth checks handled at API level
);
```

#### Policy 2: Trainers can read their own files
```sql
CREATE POLICY "Trainers can view trainee-media"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'trainee-media'
  -- Additional auth checks handled at API level
);
```

#### Policy 3: Trainers can delete their own files
```sql
CREATE POLICY "Trainers can delete trainee-media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'trainee-media'
  -- Additional auth checks handled at API level
);
```

### 3. Folder Structure

Files will be organized as:
```
trainee-media/
├── trainer_[trainerId]/
│   ├── trainee_[traineeId]/
│   │   ├── photos/
│   │   │   ├── [timestamp]_[uuid].jpg
│   │   │   └── [timestamp]_[uuid].png
│   │   └── videos/
│   │       ├── [timestamp]_[uuid].mp4
│   │       └── [timestamp]_[uuid]_thumb.jpg
```

Example:
```
trainee-media/
├── trainer_abc123/
│   ├── trainee_xyz789/
│   │   ├── photos/
│   │   │   └── 20250123_def456.jpg
│   │   └── videos/
│   │       ├── 20250123_ghi789.mp4
│   │       └── 20250123_ghi789_thumb.jpg
```

### 4. Environment Variables

Add to `packages/web/.env.local`:

```env
# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The service role key is needed for:
- Creating signed URLs
- Bypassing RLS for admin operations
- Deleting files

### 5. File Size Limits

**Recommended Limits:**
- **Photos**: 10 MB max
- **Videos**: 100 MB max (or 50 MB for faster uploads)

**Why?**
- Mobile uploads over cellular
- Storage costs
- Loading performance
- User experience

### 6. Testing Upload

You can test uploads via Supabase dashboard:
1. Go to Storage → `trainee-media`
2. Click **Upload File**
3. Try uploading a test image
4. If successful, policies are working!

## API Integration

### Upload Example
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Upload file
const filePath = `trainer_${trainerId}/trainee_${traineeId}/photos/${timestamp}_${uuid}.jpg`;
const { data, error } = await supabase.storage
  .from('trainee-media')
  .upload(filePath, file, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: false
  });

// Get public URL
const { data: urlData } = supabase.storage
  .from('trainee-media')
  .getPublicUrl(filePath);
```

### Delete Example
```typescript
const { error } = await supabase.storage
  .from('trainee-media')
  .remove([filePath]);
```

## Security Considerations

1. **Authentication Required**: All uploads must be authenticated
2. **Trainer Verification**: Only trainers can upload media
3. **Ownership Check**: Trainers can only access their own trainees' media
4. **File Type Validation**: Server-side validation of MIME types
5. **Size Limits**: Enforce max file sizes
6. **Malware Scanning**: Consider adding virus scanning for production

## Image Optimization

Supabase Storage supports automatic transformations:

```typescript
// Get optimized image URL
const optimizedUrl = supabase.storage
  .from('trainee-media')
  .getPublicUrl(filePath, {
    transform: {
      width: 800,
      height: 600,
      resize: 'cover',
      quality: 80,
      format: 'webp'
    }
  });
```

**Use Cases:**
- **Thumbnails**: 200x200 for gallery views
- **Medium**: 800x600 for detail views
- **Original**: Full size for download

## Troubleshooting

### Upload Fails with "Unauthorized"
- Check storage policies are created
- Verify service role key in .env.local
- Ensure bucket name is correct (`trainee-media`)

### Files Not Visible
- Check if bucket is public (should be private)
- Verify RLS policies are enabled
- Use `getPublicUrl()` or create signed URLs

### Large Videos Timeout
- Reduce max video size limit
- Implement chunked upload for large files
- Show upload progress to user
- Consider video compression before upload

### CORS Errors
- Supabase handles CORS automatically
- If issues persist, check Supabase project settings

## Cost Estimate

**Supabase Free Tier:**
- 1 GB storage
- 2 GB bandwidth/month

**Paid Tier (Pro - $25/mo):**
- 100 GB storage
- 200 GB bandwidth/month
- Additional storage: $0.021/GB/month

**Example Usage:**
- 100 photos (5 MB each) = 500 MB
- 20 videos (50 MB each) = 1 GB
- Total: 1.5 GB (~$0.03/month on paid tier)

## Next Steps

1. Run the SQL migration: `docs/sql/add-trainer-trainee-notes.sql`
2. Create the storage bucket as described above
3. Set up storage policies
4. Add environment variables
5. Test upload via API endpoints

---

**Ready to build!** 🚀

Once storage is set up, we can start building the upload UI and camera capture features.
