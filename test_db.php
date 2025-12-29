<?php
// Database connection test
$host = 'localhost';
$dbname = 'crimson_web';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>✅ Database Connection Successful!</h2>";
    echo "<p>Connected to database: <strong>$dbname</strong></p>";
    
    // Check tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<h3>Tables found:</h3>";
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>$table</li>";
    }
    echo "</ul>";
    
    // Count users
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $userCount = $stmt->fetchColumn();
    echo "<p>Total users: <strong>$userCount</strong></p>";
    
    // Count contact messages
    $stmt = $pdo->query("SELECT COUNT(*) FROM contact_messages");
    $messageCount = $stmt->fetchColumn();
    echo "<p>Total contact messages: <strong>$messageCount</strong></p>";
    
} catch(PDOException $e) {
    echo "<h2>❌ Database Connection Failed!</h2>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
    echo "<h3>Troubleshooting:</h3>";
    echo "<ul>";
    echo "<li>Make sure XAMPP MySQL is running</li>";
    echo "<li>Check if the database 'crimson_web' exists in phpMyAdmin</li>";
    echo "<li>Verify database credentials are correct</li>";
    echo "</ul>";
}
?>
