# 🔐 Authentication System Quick Reference

## 📁 Project Files

```
WebProject/
├── index.html              ← Main page (updated with auth)
├── auth.css               ← Authentication styles
├── auth.js                ← Authentication JavaScript
├── auth_process.php       ← Backend authentication handler
├── database_setup.sql     ← Database schema
├── AUTH_SETUP_GUIDE.md    ← Detailed setup instructions
├── style.css              ← Existing styles
├── obj.js                 ← Existing JavaScript
└── process.php            ← Existing contact form handler
```

## 🚀 Quick Start (3 Steps)

### 1️⃣ Start XAMPP
- Open XAMPP Control Panel
- Start **Apache** and **MySQL**

### 2️⃣ Create Database
- Go to `http://localhost/phpmyadmin`
- Run the SQL from `database_setup.sql`

### 3️⃣ Open Website
- Move project to `C:\xampp\htdocs\WebProject\`
- Visit `http://localhost/WebProject/index.html`

## 🎯 Features at a Glance

### ✅ Sign Up
- Full name, email, password
- Password confirmation
- Email validation
- Secure password hashing

### ✅ Sign In
- Email & password login
- Remember me option
- Password visibility toggle
- Session management

### ✅ User Menu
- Avatar with initials
- Profile dropdown
- Logout functionality

### ✅ Security
- Bcrypt password hashing
- SQL injection protection
- XSS protection
- Session management

## 🧪 Test Credentials

**Demo Account:**
- Email: `demo@crimsonweb.com`
- Password: `password123`

## 🎨 UI Components

### Navbar Buttons (Logged Out)
```html
<button class="auth-btn signin">Sign In</button>
<button class="auth-btn signup">Sign Up</button>
```

### User Avatar (Logged In)
```html
<div class="user-avatar">KE</div>
```

### Authentication Modal
- Glassmorphism design
- Smooth animations
- Tab switching (Sign In/Sign Up)
- Password toggles
- Social login placeholders

## 🔧 Common Customizations

### Change Primary Color
Edit `auth.css`:
```css
/* Find and replace */
#dc143c → your-color
#ff1493 → your-accent-color
```

### Modify Password Requirements
Edit `auth_process.php`:
```php
if (strlen($password) < 6) {  // Change 6 to your requirement
```

### Add Email Verification
1. Add `email_verified` column to database
2. Generate verification token
3. Send email with verification link
4. Create verification endpoint

## 📊 Database Tables

### users
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(100) | User's full name |
| email | VARCHAR(255) | Unique email |
| password | VARCHAR(255) | Hashed password |
| created_at | TIMESTAMP | Registration date |
| last_login | TIMESTAMP | Last login time |

### contact_messages
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(100) | Sender name |
| email | VARCHAR(255) | Sender email |
| message | TEXT | Message content |
| created_at | TIMESTAMP | Submission date |
| user_id | INT | Foreign key to users |

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal doesn't open | Check browser console, ensure auth.js is loaded |
| Database error | Verify MySQL is running, check credentials |
| Styles broken | Clear cache, check auth.css is loaded |
| Session not working | Enable cookies, check PHP session settings |

## 🔐 Security Checklist

- [x] Password hashing (bcrypt)
- [x] SQL injection protection (PDO)
- [x] XSS protection
- [ ] CSRF tokens (recommended)
- [ ] Rate limiting (recommended)
- [ ] Email verification (recommended)
- [ ] HTTPS (production only)
- [ ] Two-factor authentication (optional)

## 📞 API Endpoints

### Sign Up
```
POST auth_process.php
action=signup
name=John Doe
email=john@example.com
password=secret123
```

### Sign In
```
POST auth_process.php
action=signin
email=john@example.com
password=secret123
remember=on (optional)
```

### Logout
```
POST auth_process.php
action=logout
```

### Check Session
```
GET auth_process.php?action=check_session
```

## 🎨 Color Palette

```css
Primary: #dc143c (Crimson)
Accent: #ff1493 (Deep Pink)
Background: rgba(20, 20, 30, 0.95)
Border: rgba(220, 20, 60, 0.3)
Text: #ffffff
Text Secondary: rgba(255, 255, 255, 0.7)
```

## 💡 Pro Tips

1. **Clear browser cache** if changes don't appear
2. **Check browser console** for JavaScript errors
3. **Use demo account** for quick testing
4. **Enable error reporting** during development
5. **Backup database** before making changes

## 🔄 Workflow

```
User clicks "Sign Up"
    ↓
Modal opens with Sign Up form
    ↓
User fills form and submits
    ↓
JavaScript validates (passwords match)
    ↓
AJAX POST to auth_process.php
    ↓
PHP validates and creates user
    ↓
Success message shown
    ↓
User switches to Sign In
    ↓
User logs in
    ↓
Session created
    ↓
UI updates (avatar shown, buttons hidden)
```

## 📝 Next Steps

1. ✅ Test sign up with new account
2. ✅ Test sign in with demo account
3. ✅ Test logout functionality
4. ⬜ Implement password reset
5. ⬜ Add email verification
6. ⬜ Create user profile page
7. ⬜ Add profile picture upload
8. ⬜ Implement OAuth (Google/Facebook)

---

**Need help?** Check `AUTH_SETUP_GUIDE.md` for detailed instructions!
