<?php
// Admin Setup Script
// Run this file once to set up the admin account

$host = 'localhost';
$dbname = 'crimson_web';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "<h2>Setting up Admin Account...</h2>";

    // Check if is_admin column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'is_admin'");
    if ($stmt->rowCount() == 0) {
        echo "<p>Adding is_admin column to users table...</p>";
        $pdo->exec("ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0 AFTER password");
        echo "<p style='color: green;'>✓ Column added successfully</p>";
    } else {
        echo "<p style='color: blue;'>ℹ is_admin column already exists</p>";
    }

    // Create admin account
    $adminEmail = 'admin@crimsonweb.com';
    $adminPassword = 'admin123';
    $adminName = 'Admin';
    $hashedPassword = password_hash($adminPassword, PASSWORD_DEFAULT);

    // Check if admin exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$adminEmail]);

    if ($stmt->rowCount() > 0) {
        // Update existing user to admin
        echo "<p>Updating existing user to admin...</p>";
        $stmt = $pdo->prepare("UPDATE users SET is_admin = 1, password = ? WHERE email = ?");
        $stmt->execute([$hashedPassword, $adminEmail]);
        echo "<p style='color: green;'>✓ User updated to admin successfully</p>";
    } else {
        // Create new admin user
        echo "<p>Creating new admin user...</p>";
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, is_admin, created_at) VALUES (?, ?, ?, 1, NOW())");
        $stmt->execute([$adminName, $adminEmail, $hashedPassword]);
        echo "<p style='color: green;'>✓ Admin user created successfully</p>";
    }

    echo "<hr>";
    echo "<h3 style='color: green;'>✅ Setup Complete!</h3>";
    echo "<div style='background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;'>";
    echo "<h4>Admin Login Credentials:</h4>";
    echo "<p><strong>Email:</strong> admin@crimsonweb.com</p>";
    echo "<p><strong>Password:</strong> admin123</p>";
    echo "</div>";
    echo "<p><a href='admin_login.php' style='background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block;'>Go to Admin Login →</a></p>";

    echo "<hr>";
    echo "<p style='color: #999; font-size: 0.9rem;'>⚠️ For security, you should delete this file (setup_admin.php) after setup is complete.</p>";

} catch (PDOException $e) {
    echo "<h3 style='color: red;'>❌ Error:</h3>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<p>Make sure:</p>";
    echo "<ul>";
    echo "<li>XAMPP MySQL is running</li>";
    echo "<li>Database 'crimson_web' exists</li>";
    echo "<li>Users table exists</li>";
    echo "</ul>";
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Setup</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        h2,
        h3,
        h4 {
            color: #333;
        }

        p,
        ul {
            line-height: 1.6;
        }

        body>* {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>

<body>
</body>

</html>