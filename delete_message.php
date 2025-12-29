<?php
session_start();
header('Content-Type: application/json');

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized access'
    ]);
    exit;
}

// Database configuration
$host = 'localhost';
$dbname = 'crimson_web';
$username = 'root';
$password = '';

// Connect to database
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit;
}

// Get message ID
$message_id = $_POST['message_id'] ?? null;

if (!$message_id || !is_numeric($message_id)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid message ID'
    ]);
    exit;
}

try {
    // Check if message exists
    $stmt = $pdo->prepare("SELECT id FROM contact_messages WHERE id = ?");
    $stmt->execute([$message_id]);

    if (!$stmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Message not found'
        ]);
        exit;
    }

    // Delete the message
    $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = ?");
    $stmt->execute([$message_id]);

    echo json_encode([
        'success' => true,
        'message' => 'Message deleted successfully'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to delete message'
    ]);
}
?>