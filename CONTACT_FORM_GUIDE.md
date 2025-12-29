# Contact Form Backend Setup Guide

## 📋 Overview
This guide explains how the contact form backend works and how to use it.

## 🗂️ Files Created

### 1. **process.php** - Backend Processing
- Handles form submissions
- Validates input data
- Stores messages in the database
- Returns JSON responses

### 2. **contact.js** - Frontend Handler
- Handles AJAX form submission
- Provides user feedback
- Prevents page reload
- Shows success/error messages

### 3. **view_messages.php** - Admin Panel
- View all contact messages
- See statistics
- Filter by date
- Identify registered users

## 🚀 How It Works

### Form Submission Flow:
1. User fills out the contact form on `index.html`
2. JavaScript intercepts the form submission
3. Data is sent to `process.php` via AJAX
4. PHP validates and stores the data in database
5. Success/error message is displayed to user
6. Form is reset on success

### Database Storage:
Messages are stored in the `contact_messages` table with:
- **name** - Sender's name
- **email** - Sender's email
- **message** - Message content
- **user_id** - Links to user if logged in (optional)
- **created_at** - Timestamp

## 📊 Features

### ✅ Input Validation
- **Name**: Required
- **Email**: Required and must be valid format
- **Message**: Required, minimum 10 characters

### ✅ User Integration
- If a user is logged in, their user_id is automatically linked
- Admin panel shows which messages are from registered users

### ✅ AJAX Submission
- No page reload
- Instant feedback
- Better user experience
- Form auto-resets on success

### ✅ Security
- PDO prepared statements (SQL injection protection)
- Input sanitization
- Email validation
- XSS protection with htmlspecialchars

## 🎯 Testing Your Setup

### Step 1: Test Database Connection
Visit: `http://localhost/WebProject/test_db.php`
- Should show "Database Connection Successful"
- Should list your tables
- Should show user and message counts

### Step 2: Test Contact Form
1. Go to: `http://localhost/WebProject/index.html`
2. Scroll to the "Get In Touch" section
3. Fill out the form:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Message**: This is a test message
4. Click "Send Message"
5. You should see a success message

### Step 3: View Messages in Admin Panel
Visit: `http://localhost/WebProject/view_messages.php`
- You should see your test message
- Statistics should show 1 total message
- Message details should be displayed

### Step 4: Test with Logged-In User
1. Sign up or sign in on your website
2. Submit a contact form message
3. Check `view_messages.php` - it should show "Registered User" badge

## 🔧 Customization Options

### Change Validation Rules
Edit `process.php` around lines 30-50:

```php
// Example: Change minimum message length
if (strlen($message) < 20) {  // Changed from 10 to 20
    $errors[] = 'Message must be at least 20 characters long';
}
```

### Change Success Message
Edit `process.php` around line 75:

```php
'message' => 'Your custom success message here!'
```

### Change Form Styling
Edit `style.css` - form message styles are at lines 707-737

### Add Email Notifications
Add this to `process.php` after successful database insert:

```php
// Send email notification
$to = "your-email@example.com";
$subject = "New Contact Form Submission";
$body = "Name: $name\nEmail: $email\nMessage: $message";
$headers = "From: noreply@crimsonweb.com";
mail($to, $subject, $body, $headers);
```

## 📱 API Response Format

### Success Response:
```json
{
    "success": true,
    "message": "Thank you for contacting us! We will get back to you soon.",
    "message_id": 123
}
```

### Error Response:
```json
{
    "success": false,
    "message": "Email is required"
}
```

## 🐛 Troubleshooting

### Form doesn't submit
- Check browser console for JavaScript errors
- Verify `contact.js` is loaded
- Check XAMPP Apache is running

### Messages not saving to database
- Verify MySQL is running in XAMPP
- Check database exists: `crimson_web`
- Check table exists: `contact_messages`
- Run `test_db.php` to verify connection

### Success message not showing
- Check `#form-message` element exists in HTML
- Verify CSS styles are loaded
- Check browser console for errors

### Admin panel shows empty
- Verify messages exist in database
- Check phpMyAdmin → `contact_messages` table
- Ensure database connection is working

## 📂 File Locations

```
WebProject/
├── index.html           (Contact form)
├── process.php          (Backend handler)
├── contact.js           (AJAX handler)
├── view_messages.php    (Admin panel)
├── test_db.php          (Connection test)
├── style.css            (Includes form styles)
└── database_setup.sql   (Database structure)
```

## 🎨 Admin Panel Features

- **Total Messages**: Count of all submissions
- **From Registered Users**: Messages from logged-in users
- **Today**: Messages received today
- **Message Cards**: Display name, email, message, and timestamp
- **User Badge**: Shows if message is from registered user
- **Email Links**: Click to open email client
- **Responsive Design**: Works on mobile devices

## 🔐 Security Best Practices

1. ✅ Using PDO prepared statements
2. ✅ Input validation and sanitization
3. ✅ Email format validation
4. ✅ XSS protection with htmlspecialchars
5. ✅ Session management for user tracking
6. ✅ Error messages don't reveal system details

## 📈 Future Enhancements

Consider adding:
- Delete message functionality
- Mark as read/unread
- Reply to messages
- Export to CSV
- Search and filter
- Email notifications
- Message categories
- Spam protection (CAPTCHA)

## 🎓 Learning Resources

- **PDO Documentation**: https://www.php.net/manual/en/book.pdo.php
- **AJAX with Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **Form Validation**: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation

---

**Need Help?** Check the troubleshooting section or review the code comments in each file.
