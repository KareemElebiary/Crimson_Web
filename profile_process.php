<?php
session_start();
header('Content-Type: application/json');

// Database connection
require_once 'db_config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'get_messages':
        getMessages($conn, $user_id);
        break;

    case 'update_profile':
        updateProfile($conn, $user_id);
        break;

    case 'update_profile_picture':
        updateProfilePicture($conn, $user_id);
        break;

    case 'reset_password':
        resetPassword($conn, $user_id);
        break;

    case 'delete_account':
        deleteAccount($conn, $user_id);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function getMessages($conn, $user_id)
{
    // Get user email
    $stmt = $conn->prepare("SELECT email FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        return;
    }

    // Get messages sent by this user
    $stmt = $conn->prepare("SELECT id, name, email, message, created_at FROM contact_messages WHERE email = ? ORDER BY created_at DESC");
    $stmt->bind_param("s", $user['email']);
    $stmt->execute();
    $result = $stmt->get_result();

    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }

    echo json_encode(['success' => true, 'messages' => $messages]);
}

function updateProfile($conn, $user_id)
{
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');

    // Validate input
    if (empty($name) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Name and email are required']);
        return;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        return;
    }

    // Check if email already exists for another user
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->bind_param("si", $email, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already in use']);
        return;
    }

    // Update user profile
    $stmt = $conn->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
    $stmt->bind_param("ssi", $name, $email, $user_id);

    if ($stmt->execute()) {
        // Update session
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;

        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
    }
}

function updateProfilePicture($conn, $user_id)
{
    if (!isset($_FILES['profile_picture']) || $_FILES['profile_picture']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'message' => 'No file uploaded']);
        return;
    }

    $file = $_FILES['profile_picture'];

    // Validate file type
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mime_type, $allowed_types)) {
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, and GIF allowed']);
        return;
    }

    // Validate file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        echo json_encode(['success' => false, 'message' => 'File size must be less than 5MB']);
        return;
    }

    // Create uploads directory if it doesn't exist
    $upload_dir = 'uploads/profile_pictures/';
    if (!file_exists($upload_dir)) {
        if (!mkdir($upload_dir, 0777, true)) {
            echo json_encode(['success' => false, 'message' => 'Failed to create upload directory']);
            return;
        }
    }

    // Generate unique filename
    $extension = 'jpg'; // Always save as JPG since we're converting from canvas
    $filename = 'profile_' . $user_id . '_' . time() . '.' . $extension;
    $filepath = $upload_dir . $filename;

    // Check if profile_picture column exists
    $column_check = $conn->query("SHOW COLUMNS FROM users LIKE 'profile_picture'");
    if ($column_check->num_rows == 0) {
        // Column doesn't exist, create it
        $conn->query("ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) DEFAULT NULL");
    }

    // Delete old profile picture if exists
    try {
        $stmt = $conn->prepare("SELECT profile_picture FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user && !empty($user['profile_picture']) && file_exists($user['profile_picture'])) {
            unlink($user['profile_picture']);
        }
    } catch (Exception $e) {
        // Ignore if column doesn't exist
    }

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Update database
        $stmt = $conn->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
        $stmt->bind_param("si", $filepath, $user_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Profile picture updated', 'profile_picture' => $filepath]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update database: ' . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload file']);
    }
}

function resetPassword($conn, $user_id)
{
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';

    // Validate input
    if (empty($current_password) || empty($new_password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        return;
    }

    if (strlen($new_password) < 6) {
        echo json_encode(['success' => false, 'message' => 'New password must be at least 6 characters']);
        return;
    }

    // Verify current password
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user || !password_verify($current_password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
        return;
    }

    // Update password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $hashed_password, $user_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Password reset successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to reset password']);
    }
}

function deleteAccount($conn, $user_id)
{
    $password = $_POST['password'] ?? '';

    // Validate password
    if (empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Password is required']);
        return;
    }

    // Verify password
    $stmt = $conn->prepare("SELECT password, profile_picture FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user || !password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Incorrect password']);
        return;
    }

    // Delete profile picture if exists
    if (!empty($user['profile_picture']) && file_exists($user['profile_picture'])) {
        unlink($user['profile_picture']);
    }

    // Delete user account
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);

    if ($stmt->execute()) {
        // Destroy session
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Account deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete account']);
    }
}

$conn->close();
?>