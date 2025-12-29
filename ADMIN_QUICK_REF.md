# 🔐 Admin System - Quick Reference

## 🚀 Quick Start (3 Steps)

### 1️⃣ Run Setup
```
http://localhost/WebProject/setup_admin.php
```

### 2️⃣ Login
```
http://localhost/WebProject/admin_login.php
```

### 3️⃣ View Dashboard
Automatically redirected after login!

---

## 🔑 Default Credentials

```
Email:    admin@crimsonweb.com
Password: admin123
```

⚠️ **Change password after first login!**

---

## 📍 Important URLs

| Page | URL |
|------|-----|
| **Setup** | http://localhost/WebProject/setup_admin.php |
| **Login** | http://localhost/WebProject/admin_login.php |
| **Dashboard** | http://localhost/WebProject/admin_dashboard.php |

---

## ✨ Dashboard Features

### 📊 Statistics
- Total Messages
- Today's Messages
- This Week's Messages
- From Registered Users

### 🔍 Filters
- **All** - All messages
- **Today** - Today only
- **This Week** - Last 7 days
- **This Month** - Last 30 days
- **Registered Users** - From logged-in users

### 🔎 Search
Search by name, email, or message content

### 📬 Message Actions
- Click email to reply
- View message details
- See timestamps
- Identify registered users

---

## 🔐 Security

✅ Session-based authentication  
✅ Password hashing (bcrypt)  
✅ Admin-only access  
✅ SQL injection protection  
✅ XSS prevention  

---

## 🎯 Common Tasks

### Login as Admin
1. Go to admin_login.php
2. Enter credentials
3. Click "Login to Dashboard"

### View Messages
1. Login to dashboard
2. Messages appear automatically
3. Use filters to narrow down

### Search Messages
1. Type in search box
2. Press Enter
3. Results update automatically

### Logout
1. Click "Logout" button in header
2. Redirected to login page

### Change Password
1. Go to phpMyAdmin
2. Edit admin user in users table
3. Generate new hash:
```php
password_hash('new_password', PASSWORD_DEFAULT)
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Run setup_admin.php first |
| No messages | Submit test via contact form |
| Session issues | Clear browser cookies |
| Setup errors | Check MySQL is running |

---

## 📊 Database Info

### New Column
```sql
is_admin TINYINT(1) DEFAULT 0
```
- 0 = Regular user
- 1 = Admin user

### Admin Account
```
Table: users
Email: admin@crimsonweb.com
is_admin: 1
```

---

## 💡 Pro Tips

1. 🔖 **Bookmark** admin_login.php
2. 🔍 **Use search** to find specific messages
3. 📧 **Click emails** to reply quickly
4. 🗑️ **Delete** setup_admin.php after setup
5. 🔒 **Change** default password

---

## 📱 Mobile Friendly

✅ Responsive design  
✅ Works on all devices  
✅ Touch-friendly interface  

---

## 🎨 File Structure

```
admin_login.php       → Login page
admin_dashboard.php   → Main dashboard
setup_admin.php       → One-time setup
admin_setup.sql       → SQL commands
view_messages.php     → Redirects to login
```

---

## ⚡ Session Variables

```php
$_SESSION['admin_logged_in']  // true/false
$_SESSION['admin_id']         // User ID
$_SESSION['admin_name']       // Name
$_SESSION['admin_email']      // Email
```

---

## 🎯 Next Steps

1. ✅ Run setup_admin.php
2. ✅ Login with default credentials
3. ✅ Change password
4. ✅ Delete setup_admin.php
5. ✅ Start managing messages!

---

**Need detailed help?** See ADMIN_GUIDE.md
