# User Profile Page - Setup Guide

## Overview
A comprehensive user profile page has been created with the following features:
- View and edit profile information (name, email)
- Upload and display profile picture
- View previous contact messages
- Reset password
- Delete account

## Files Created

### 1. Frontend Files
- **profile.html** - Main profile page HTML
- **profile.css** - Premium dark-themed styling
- **profile.js** - Client-side functionality

### 2. Backend Files
- **profile_process.php** - Server-side processing for all profile operations
- **db_config.php** - Centralized database configuration

### 3. Database Files
- **profile_setup.sql** - Database schema updates

## Setup Instructions

### Step 1: Update Database Schema
Run the following SQL commands in phpMyAdmin or MySQL:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

Or import the `profile_setup.sql` file.

### Step 2: Create Uploads Directory
Create the following directory structure in your project root:
```
WebProject/
  └── uploads/
      └── profile_pictures/
```

Make sure the directory has write permissions (chmod 777 on Linux/Mac).

### Step 3: Update auth.js (Already Done)
The profile button click handler has been added to redirect to profile.html.

## Features

### 1. Profile Picture Upload
- Click "Change Photo" button
- Select an image (JPG, PNG, GIF)
- Max file size: 5MB
- Image is displayed in:
  - Large profile avatar on profile page
  - Small circular avatar in navbar
  - Main page navbar (persists across pages)

### 2. View Previous Messages
- Displays all contact form messages sent by the user
- Shows message content, date, and status
- Automatically fetches based on user's email

### 3. Update Profile Information
- Edit name and email
- Real-time validation
- Updates reflected across all pages

### 4. Reset Password
- Requires current password verification
- New password must be at least 6 characters
- Secure password hashing

### 5. Delete Account
- Confirmation modal with password verification
- Deletes user account and profile picture
- Logs out and redirects to home page

## How to Access

### For Users:
1. Sign in to your account
2. Click on your avatar in the top-right corner
3. Click "Profile" from the dropdown menu
4. You'll be redirected to profile.html

### Direct URL:
`http://localhost/WebProject/profile.html`

Note: Users must be logged in to access the profile page. Unauthenticated users are automatically redirected to the home page.

## Security Features

1. **Session Validation**: All requests verify user is logged in
2. **Password Verification**: Required for sensitive operations (password reset, account deletion)
3. **File Upload Validation**: 
   - File type checking (images only)
   - File size limit (5MB)
   - Unique filename generation
4. **SQL Injection Protection**: All queries use prepared statements
5. **XSS Protection**: HTML escaping for user-generated content

## Database Schema

### users table (updated)
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- profile_picture (VARCHAR, nullable) -- NEW
- created_at (TIMESTAMP) -- NEW
```

## API Endpoints (profile_process.php)

### GET Requests:
- `?action=get_messages` - Fetch user's contact messages

### POST Requests:
- `action=update_profile` - Update name and email
- `action=update_profile_picture` - Upload new profile picture
- `action=reset_password` - Change password
- `action=delete_account` - Delete user account

## Styling

The profile page uses:
- Dark theme with crimson accents
- Glassmorphism effects
- Smooth animations and transitions
- Responsive design for mobile devices
- Consistent with main page design

## Troubleshooting

### Profile picture not uploading?
1. Check if `uploads/profile_pictures/` directory exists
2. Verify directory has write permissions
3. Check file size (must be < 5MB)
4. Ensure file is an image (JPG, PNG, GIF)

### Messages not showing?
1. Verify user has sent messages through contact form
2. Check that contact_messages table exists
3. Ensure email in messages matches user's email

### Can't access profile page?
1. Make sure you're logged in
2. Check browser console for errors
3. Verify auth_process.php is working correctly

## Next Steps

You can enhance the profile page by:
1. Adding email verification
2. Implementing two-factor authentication
3. Adding more profile fields (phone, address, bio)
4. Creating activity logs
5. Adding social media links
6. Implementing profile privacy settings

## Testing Checklist

- [ ] User can access profile page after login
- [ ] Profile information displays correctly
- [ ] Profile picture upload works
- [ ] Profile picture appears in navbar
- [ ] Previous messages load correctly
- [ ] Profile update saves successfully
- [ ] Password reset works with validation
- [ ] Account deletion requires password
- [ ] Unauthenticated users are redirected
- [ ] Responsive design works on mobile

---

**Created**: 2025-12-30
**Version**: 1.0
**Status**: Ready for Testing
