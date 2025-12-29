# 🚀 Contact Form Backend - Quick Reference

## 📍 Important URLs

| Purpose | URL |
|---------|-----|
| **Your Website** | `http://localhost/WebProject/index.html` |
| **Admin Panel** | `http://localhost/WebProject/view_messages.php` |
| **Test Database** | `http://localhost/WebProject/test_db.php` |
| **phpMyAdmin** | `http://localhost/phpmyadmin` |

## 🗂️ Database Info

- **Database Name**: `crimson_web`
- **Table**: `contact_messages`
- **Columns**: id, name, email, message, user_id, created_at

## ✅ Quick Test Checklist

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] Database `crimson_web` exists
- [ ] Table `contact_messages` exists
- [ ] Visit test_db.php - shows success
- [ ] Submit contact form - shows success message
- [ ] Check view_messages.php - message appears

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `process.php` | Handles form submissions |
| `contact.js` | AJAX form handler |
| `view_messages.php` | View all messages |
| `test_db.php` | Test database connection |

## 🔧 Common Tasks

### View All Messages
```
http://localhost/WebProject/view_messages.php
```

### Check Database in phpMyAdmin
1. Go to `http://localhost/phpmyadmin`
2. Click `crimson_web` database
3. Click `contact_messages` table
4. Click "Browse" tab

### Test Form Submission
1. Go to website
2. Scroll to "Get In Touch"
3. Fill form and submit
4. Look for success message

### Clear All Messages (via phpMyAdmin)
```sql
TRUNCATE TABLE contact_messages;
```

## 📊 Response Messages

| Type | Message |
|------|---------|
| **Success** | "Thank you for contacting us! We will get back to you soon." |
| **Empty Name** | "Name is required" |
| **Empty Email** | "Email is required" |
| **Invalid Email** | "Invalid email format" |
| **Short Message** | "Message must be at least 10 characters long" |
| **DB Error** | "Failed to send message. Please try again later." |

## 🎨 Form Message Styles

Messages appear below the submit button with these styles:
- **Success**: Green background with green text
- **Error**: Red background with red text
- **Auto-hide**: Success messages disappear after 5 seconds

## 🔐 Security Features

✅ SQL Injection Protection (PDO)  
✅ XSS Protection (htmlspecialchars)  
✅ Email Validation  
✅ Input Sanitization  
✅ Session Management  

## 📱 Features

- ✨ AJAX submission (no page reload)
- ✨ Real-time validation
- ✨ User integration (tracks logged-in users)
- ✨ Admin panel with statistics
- ✨ Responsive design
- ✨ Auto-reset form on success

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Form doesn't submit | Check console, verify contact.js loaded |
| No success message | Check #form-message element exists |
| Messages not saving | Verify MySQL running, check test_db.php |
| Admin panel empty | Check database in phpMyAdmin |
| Connection failed | Start MySQL in XAMPP Control Panel |

---

**Pro Tip**: Bookmark `view_messages.php` to quickly check new submissions!
