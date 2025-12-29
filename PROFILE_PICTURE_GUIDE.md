# Profile Picture Upload with Image Cropping - Setup Guide

## ✅ What's Been Fixed and Added

### 1. **Fixed Login Issue**
- Removed references to non-existent database columns that were causing login failures
- Login now works normally again

### 2. **Added Advanced Image Cropping**
- **Preview before upload**: See your image before committing
- **Drag to reposition**: Move the image around to frame it perfectly
- **Zoom slider**: Zoom in/out from 100% to 300%
- **Resizable crop box**: Drag corner handles to adjust crop size
- **Real-time circular preview**: See exactly how your profile picture will look
- **Automatic optimization**: Images are cropped and optimized before upload

## 🚀 Setup Instructions

### Step 1: Update Database (REQUIRED)

You have two options:

**Option A: Run the safe SQL script (Recommended)**
1. Open phpMyAdmin
2. Select your `crimson_web` database
3. Go to the SQL tab
4. Copy and paste the contents of `add_profile_columns.sql`
5. Click "Go"

**Option B: Run simple SQL**
```sql
ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

### Step 2: Create Uploads Directory (REQUIRED)

Create this folder structure in your WebProject directory:
```
WebProject/
  └── uploads/
      └── profile_pictures/
```

**On Windows:**
1. Navigate to `c:\xampp\htdocs\WebProject\`
2. Create a folder named `uploads`
3. Inside `uploads`, create a folder named `profile_pictures`

### Step 3: Test the Feature

1. **Login** to your account (should work normally now)
2. **Click your avatar** in the top-right corner
3. **Click "Profile"** from the dropdown
4. **Click "Change Photo"** button
5. **Select an image** from your computer
6. **Use the crop tool**:
   - Drag the image to reposition
   - Use the zoom slider to zoom in/out
   - Drag the corner handles to resize the crop box
   - Watch the circular preview update in real-time
7. **Click "Apply & Upload"**
8. Your profile picture will appear in:
   - The large profile avatar on the profile page
   - The small circular avatar in the navbar
   - It persists across all pages!

## 🎨 How the Image Cropper Works

### Features:
1. **Drag to Reposition**: Click and drag anywhere on the crop box to move it
2. **Zoom Control**: Use the slider to zoom from 100% to 300%
3. **Resize Crop Box**: Drag any corner handle to resize (maintains square aspect ratio)
4. **Live Preview**: See a real-time circular preview of your cropped image
5. **Smart Constraints**: Crop box can't go outside image boundaries

### Technical Details:
- **Max upload size**: 10MB (before cropping)
- **Output format**: JPEG at 90% quality
- **Output size**: 150x150px (perfect for profile pictures)
- **Supported formats**: JPG, PNG, GIF
- **Processing**: Client-side using HTML5 Canvas API

## 📁 Files Created/Modified

### New Files:
1. **crop_modal.html** - Crop modal HTML structure (reference)
2. **add_profile_columns.sql** - Safe database update script

### Modified Files:
1. **profile.html** - Added crop modal
2. **profile.css** - Added crop modal styles (200+ lines of CSS)
3. **profile.js** - Complete rewrite with cropping functionality
4. **auth_process.php** - Fixed to work without new columns

### Backend Files (Already Created):
- **profile_process.php** - Handles image upload
- **db_config.php** - Database configuration

## 🔧 Troubleshooting

### "Profile picture upload error"
**Cause**: Database columns don't exist yet
**Solution**: Run the SQL from Step 1

### "Failed to upload file"
**Cause**: uploads/profile_pictures/ directory doesn't exist
**Solution**: Create the directory structure from Step 2

### "Permission denied" error
**Cause**: Web server doesn't have write permissions
**Solution** (Windows with XAMPP): Usually not needed, but if it occurs:
- Right-click the `uploads` folder
- Properties → Security → Edit
- Give "Users" full control

### Image doesn't appear after upload
**Cause**: Path issue or caching
**Solution**: 
- Hard refresh the page (Ctrl+F5)
- Check if file exists in `uploads/profile_pictures/`
- Check browser console for errors

### Crop modal doesn't open
**Cause**: JavaScript error
**Solution**:
- Open browser console (F12)
- Look for error messages
- Make sure all files are properly uploaded

## 🎯 Usage Tips

### For Best Results:
1. **Use square images** or images with the subject centered
2. **Higher resolution is better** - the cropper will optimize it
3. **Zoom in** to focus on faces or important details
4. **Use the preview** to see exactly how it will look

### Keyboard Shortcuts:
- **ESC**: Close crop modal (coming soon)
- **Enter**: Apply crop (coming soon)

## 🔒 Security Features

1. **File type validation**: Only images allowed
2. **File size limits**: 10MB max upload, optimized to ~50KB after crop
3. **Secure file naming**: Uses user ID + timestamp
4. **Old file cleanup**: Automatically deletes previous profile picture
5. **SQL injection protection**: All queries use prepared statements

## 📊 What Happens Behind the Scenes

1. User selects image → File is read into memory
2. Image displayed in crop modal → Canvas element created
3. User adjusts crop → Preview updates in real-time
4. User clicks "Apply" → Canvas extracts cropped region
5. Canvas converts to JPEG blob → Optimized for web
6. Blob uploaded to server → Saved to uploads/profile_pictures/
7. Database updated → profile_picture column stores path
8. UI updates → New image appears everywhere

## 🎨 Customization Options

Want to customize the cropper? Edit these in `profile.css`:

```css
/* Crop box color */
.crop-box {
    border: 2px solid #dc143c; /* Change color here */
}

/* Preview size */
.preview-avatar {
    width: 150px;  /* Change size */
    height: 150px; /* Keep same as width */
}

/* Zoom range */
#zoom-slider {
    min: 100;  /* Minimum zoom */
    max: 300;  /* Maximum zoom */
}
```

## ✨ Next Steps

Your profile picture feature is now fully functional! Users can:
- ✅ Upload profile pictures with advanced cropping
- ✅ See real-time preview before uploading
- ✅ Zoom and reposition images
- ✅ Have their picture appear across all pages
- ✅ Update or change their picture anytime

---

**Created**: 2025-12-30
**Version**: 2.0 with Image Cropping
**Status**: ✅ Ready to Use
