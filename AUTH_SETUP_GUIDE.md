# Crimson Web Authentication System - Setup Guide

## Overview
A complete sign-in and sign-up authentication system has been added to your Crimson Web project with:
- Modern, premium UI design matching your existing aesthetic
- Secure password hashing
- Session management
- User profile dropdown
- Remember me functionality
- Social login placeholders (Facebook, Google)

## Files Created

1. **auth.css** - Authentication styling with glassmorphism effects
2. **auth.js** - Frontend JavaScript for authentication logic
3. **auth_process.php** - Backend PHP for handling authentication
4. **database_setup.sql** - Database schema for users and messages
5. **index.html** - Updated with authentication modal and buttons

## Setup Instructions

### Step 1: Start XAMPP
1. Open XAMPP Control Panel
2. Start **Apache** server
3. Start **MySQL** server

### Step 2: Create Database
1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click on "SQL" tab
3. Copy the contents of `database_setup.sql` and paste it into the SQL query box
4. Click "Go" to execute

This will create:
- Database: `crimson_web`
- Table: `users` (for authentication)
- Table: `contact_messages` (for contact form)
- Demo user: email: `demo@crimsonweb.com`, password: `password123`

### Step 3: Configure Database Connection (Optional)
If your MySQL settings are different, edit `auth_process.php`:

```php
$host = 'localhost';        // Usually 'localhost'
$dbname = 'crimson_web';    // Database name
$username = 'root';         // Usually 'root' for XAMPP
$password = '';             // Usually empty for XAMPP
```

### Step 4: Move Files to XAMPP
1. Copy your entire `WebProject` folder to: `C:\xampp\htdocs\`
2. Your project should be at: `C:\xampp\htdocs\WebProject\`

### Step 5: Access Your Website
Open your browser and go to:
```
http://localhost/WebProject/index.html
```

## Features

### Sign Up
- Users can create new accounts with:
  - Full name
  - Email address
  - Password (minimum 6 characters)
  - Password confirmation
- Email validation
- Duplicate email detection
- Secure password hashing (bcrypt)

### Sign In
- Users can log in with:
  - Email address
  - Password
- "Remember me" checkbox for persistent login
- Password visibility toggle
- Forgot password link (placeholder)

### User Menu
Once logged in, users see:
- Avatar with initials
- Dropdown menu with:
  - User name and email
  - Profile link (placeholder)
  - Settings link (placeholder)
  - Logout button

### Security Features
- Password hashing using PHP's `password_hash()` (bcrypt)
- SQL injection protection using PDO prepared statements
- Session management
- XSS protection through proper output encoding
- CSRF protection ready (can be enhanced)

## Testing

### Test with Demo Account
1. Click "Sign In" button
2. Enter:
   - Email: `demo@crimsonweb.com`
   - Password: `password123`
3. Click "Sign In"

### Create New Account
1. Click "Sign Up" button
2. Fill in all fields
3. Click "Create Account"
4. You'll be redirected to sign in
5. Sign in with your new credentials

## Customization

### Change Colors
Edit `auth.css` to match your brand colors:
```css
/* Primary color gradient */
background: linear-gradient(135deg, #dc143c, #ff1493);

/* Border colors */
border: 1px solid rgba(220, 20, 60, 0.3);
```

### Add Social Login
The social login buttons are placeholders. To implement:
1. Set up OAuth with Facebook/Google
2. Add event listeners in `auth.js`
3. Create separate PHP handlers for OAuth flow

### Email Verification
To add email verification:
1. Add `email_verified` column to users table
2. Generate verification token on signup
3. Send verification email
4. Create verification endpoint

## Troubleshooting

### "Database connection failed"
- Make sure MySQL is running in XAMPP
- Check database credentials in `auth_process.php`
- Verify database `crimson_web` exists

### "Email already registered"
- This email is already in the database
- Try a different email or sign in instead

### Modal doesn't appear
- Check browser console for JavaScript errors
- Ensure `auth.js` is loaded (check Network tab)
- Clear browser cache and reload

### Styles look broken
- Ensure `auth.css` is loaded
- Check file paths are correct
- Clear browser cache

### Session not persisting
- Check PHP session is enabled
- Ensure cookies are enabled in browser
- Check session settings in `php.ini`

## Database Schema

### Users Table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR 100)
- email (VARCHAR 255, UNIQUE)
- password (VARCHAR 255, hashed)
- created_at (TIMESTAMP)
- last_login (TIMESTAMP)
```

### Contact Messages Table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR 100)
- email (VARCHAR 255)
- message (TEXT)
- created_at (TIMESTAMP)
- user_id (INT, FOREIGN KEY to users.id)
```

## Next Steps

### Recommended Enhancements
1. **Password Reset**: Implement forgot password functionality
2. **Email Verification**: Add email verification on signup
3. **Profile Page**: Create user profile management
4. **Two-Factor Authentication**: Add 2FA for extra security
5. **OAuth Integration**: Implement real social login
6. **Rate Limiting**: Prevent brute force attacks
7. **Password Strength Meter**: Visual feedback for password strength
8. **Account Settings**: Allow users to update their information

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check XAMPP error logs
3. Verify all files are in the correct location
4. Ensure XAMPP Apache and MySQL are running

## Security Notes

⚠️ **Important for Production:**
- Use HTTPS in production
- Set secure session cookies
- Implement CSRF tokens
- Add rate limiting
- Use environment variables for database credentials
- Enable error logging (disable display_errors)
- Implement account lockout after failed attempts
- Add email verification
- Use strong session IDs
- Set proper CORS headers

---

**Created for Crimson Web**
Premium authentication system with modern design
