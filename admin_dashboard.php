<?php
session_start();

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: admin_login.php');
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
    die("Database connection failed: " . $e->getMessage());
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin_login.php');
    exit;
}

// Get filter parameters
$filter = $_GET['filter'] ?? 'all';
$search = $_GET['search'] ?? '';

// Build query based on filters
$query = "
    SELECT 
        cm.id,
        cm.name,
        cm.email,
        cm.message,
        cm.created_at,
        cm.user_id,
        u.name as user_name,
        u.email as user_email
    FROM contact_messages cm
    LEFT JOIN users u ON cm.user_id = u.id
    WHERE 1=1
";

$params = [];

// Apply search filter
if (!empty($search)) {
    $query .= " AND (cm.name LIKE ? OR cm.email LIKE ? OR cm.message LIKE ?)";
    $searchTerm = "%$search%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $params[] = $searchTerm;
}

// Apply time filter
if ($filter === 'today') {
    $query .= " AND DATE(cm.created_at) = CURDATE()";
} elseif ($filter === 'week') {
    $query .= " AND cm.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
} elseif ($filter === 'month') {
    $query .= " AND cm.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
} elseif ($filter === 'registered') {
    $query .= " AND cm.user_id IS NOT NULL";
}

$query .= " ORDER BY cm.created_at DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get statistics
$stats = [
    'total' => $pdo->query("SELECT COUNT(*) FROM contact_messages")->fetchColumn(),
    'today' => $pdo->query("SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at) = CURDATE()")->fetchColumn(),
    'week' => $pdo->query("SELECT COUNT(*) FROM contact_messages WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetchColumn(),
    'registered' => $pdo->query("SELECT COUNT(*) FROM contact_messages WHERE user_id IS NOT NULL")->fetchColumn(),
];
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Contact Messages</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        /* Header */
        .dashboard-header {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .header-left h1 {
            color: #333;
            margin-bottom: 0.5rem;
            font-size: 2rem;
        }

        .header-left p {
            color: #666;
        }

        .admin-info {
            color: #667eea;
            font-weight: 600;
        }

        .header-right {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .logout-btn {
            background: #dc3545;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .logout-btn:hover {
            background: #c82333;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
        }

        .website-btn {
            background: #667eea;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .website-btn:hover {
            background: #5568d3;
            transform: translateY(-2px);
        }

        /* Statistics */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            color: #666;
            font-size: 0.9rem;
        }

        /* Filters */
        .filters-section {
            background: white;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }

        .filters-container {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: center;
        }

        .filter-group {
            display: flex;
            gap: 0.5rem;
        }

        .filter-btn {
            padding: 0.5rem 1rem;
            border: 2px solid #e0e0e0;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            text-decoration: none;
            color: #333;
        }

        .filter-btn:hover {
            border-color: #667eea;
            color: #667eea;
        }

        .filter-btn.active {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }

        .search-box {
            flex: 1;
            min-width: 250px;
        }

        .search-box input {
            width: 100%;
            padding: 0.625rem 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 0.95rem;
        }

        .search-box input:focus {
            outline: none;
            border-color: #667eea;
        }

        /* Messages */
        .messages-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }

        .messages-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .messages-header h2 {
            margin: 0;
        }

        .message-count {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
        }

        .message-card {
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #eee;
            transition: background-color 0.3s ease;
        }

        .message-card:hover {
            background-color: #f8f9fa;
        }

        .message-card:last-child {
            border-bottom: none;
        }

        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .message-info {
            display: flex;
            gap: 1rem;
            align-items: center;
            flex-wrap: wrap;
        }

        .message-name {
            font-weight: bold;
            color: #333;
            font-size: 1.1rem;
        }

        .message-email {
            color: #667eea;
            text-decoration: none;
            font-size: 0.95rem;
        }

        .message-email:hover {
            text-decoration: underline;
        }

        .message-date {
            color: #999;
            font-size: 0.9rem;
        }

        .message-content {
            color: #555;
            line-height: 1.6;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            margin-bottom: 0.5rem;
        }

        .message-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.85rem;
            color: #999;
        }

        .user-badge {
            display: inline-block;
            background: #4BB543;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .message-id {
            color: #999;
            font-size: 0.85rem;
        }

        .no-messages {
            padding: 4rem 2rem;
            text-align: center;
            color: #999;
        }

        .no-messages-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }

        /* Delete Button */
        .message-actions {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }

        .delete-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .delete-btn:hover {
            background: #c82333;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .delete-btn:active {
            transform: translateY(0);
        }

        /* Confirmation Modal */
        .confirm-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .confirm-modal.active {
            display: flex;
        }

        .confirm-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .confirm-content h3 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }

        .confirm-content p {
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }

        .confirm-buttons {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }

        .confirm-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .confirm-btn-cancel {
            background: #e0e0e0;
            color: #333;
        }

        .confirm-btn-cancel:hover {
            background: #d0d0d0;
        }

        .confirm-btn-delete {
            background: #dc3545;
            color: white;
        }

        .confirm-btn-delete:hover {
            background: #c82333;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        @media (max-width: 768px) {
            body {
                padding: 1rem;
            }

            .dashboard-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .header-right {
                width: 100%;
                justify-content: space-between;
            }

            .message-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .filters-container {
                flex-direction: column;
            }

            .search-box {
                width: 100%;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header -->
        <div class="dashboard-header">
            <div class="header-left">
                <h1>📊 Admin Dashboard</h1>
                <p>Welcome back, <span
                        class="admin-info"><?php echo htmlspecialchars($_SESSION['admin_name']); ?></span></p>
            </div>
            <div class="header-right">
                <a href="index.html" class="website-btn">🌐 View Website</a>
                <a href="?logout=1" class="logout-btn">🚪 Logout</a>
            </div>
        </div>

        <!-- Statistics -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📬</div>
                <div class="stat-number"><?php echo $stats['total']; ?></div>
                <div class="stat-label">Total Messages</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-number"><?php echo $stats['today']; ?></div>
                <div class="stat-label">Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-number"><?php echo $stats['week']; ?></div>
                <div class="stat-label">This Week</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">👤</div>
                <div class="stat-number"><?php echo $stats['registered']; ?></div>
                <div class="stat-label">From Users</div>
            </div>
        </div>

        <!-- Filters -->
        <div class="filters-section">
            <div class="filters-container">
                <div class="filter-group">
                    <a href="?filter=all" class="filter-btn <?php echo $filter === 'all' ? 'active' : ''; ?>">All</a>
                    <a href="?filter=today"
                        class="filter-btn <?php echo $filter === 'today' ? 'active' : ''; ?>">Today</a>
                    <a href="?filter=week" class="filter-btn <?php echo $filter === 'week' ? 'active' : ''; ?>">This
                        Week</a>
                    <a href="?filter=month" class="filter-btn <?php echo $filter === 'month' ? 'active' : ''; ?>">This
                        Month</a>
                    <a href="?filter=registered"
                        class="filter-btn <?php echo $filter === 'registered' ? 'active' : ''; ?>">Registered Users</a>
                </div>
                <form class="search-box" method="GET">
                    <input type="hidden" name="filter" value="<?php echo htmlspecialchars($filter); ?>">
                    <input type="text" name="search" placeholder="🔍 Search messages..."
                        value="<?php echo htmlspecialchars($search); ?>">
                </form>
            </div>
        </div>

        <!-- Messages -->
        <div class="messages-container">
            <div class="messages-header">
                <h2>Contact Messages</h2>
                <span class="message-count"><?php echo count($messages); ?> message(s)</span>
            </div>

            <?php if (empty($messages)): ?>
                <div class="no-messages">
                    <div class="no-messages-icon">📭</div>
                    <h3>No messages found</h3>
                    <p>
                        <?php if (!empty($search)): ?>
                            No messages match your search criteria
                        <?php else: ?>
                            Contact form submissions will appear here
                        <?php endif; ?>
                    </p>
                </div>
            <?php else: ?>
                <?php foreach ($messages as $message): ?>
                    <div class="message-card">
                        <div class="message-header">
                            <div class="message-info">
                                <span class="message-name">
                                    <?php echo htmlspecialchars($message['name']); ?>
                                    <?php if ($message['user_id']): ?>
                                        <span class="user-badge">Registered User</span>
                                    <?php endif; ?>
                                </span>
                                <a href="mailto:<?php echo htmlspecialchars($message['email']); ?>" class="message-email">
                                    <?php echo htmlspecialchars($message['email']); ?>
                                </a>
                            </div>
                            <span class="message-date">
                                <?php
                                $date = new DateTime($message['created_at']);
                                echo $date->format('M d, Y - h:i A');
                                ?>
                            </span>
                        </div>
                        <div class="message-content">
                            <?php echo nl2br(htmlspecialchars($message['message'])); ?>
                        </div>
                        <div class="message-meta">
                            <div class="message-meta-left">
                                <span class="message-id">ID: #<?php echo $message['id']; ?></span>
                                <?php if ($message['user_name']): ?>
                                    <span>User Account: <?php echo htmlspecialchars($message['user_name']); ?></span>
                                <?php endif; ?>
                            </div>
                            <button class="delete-btn" data-message-id="<?php echo $message['id']; ?>"
                                onclick="confirmDelete(<?php echo $message['id']; ?>)">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <!-- Confirmation Modal -->
    <div id="confirmModal" class="confirm-modal">
        <div class="confirm-content">
            <h3>⚠️ Delete Message?</h3>
            <p>Are you sure you want to delete this message? This action cannot be undone.</p>
            <div class="confirm-buttons">
                <button class="confirm-btn confirm-btn-cancel" onclick="closeConfirmModal()">Cancel</button>
                <button class="confirm-btn confirm-btn-delete" onclick="deleteMessage()">Delete</button>
            </div>
        </div>
    </div>

    <script>
        let messageToDelete = null;

        function confirmDelete(messageId) {
            messageToDelete = messageId;
            document.getElementById('confirmModal').classList.add('active');
        }

        function closeConfirmModal() {
            document.getElementById('confirmModal').classList.remove('active');
            messageToDelete = null;
        }

        function deleteMessage() {
            if (!messageToDelete) return;

            const formData = new FormData();
            formData.append('message_id', messageToDelete);

            // Show loading state
            const deleteBtn = document.querySelector(`[data-message-id="${messageToDelete}"]`);
            const originalText = deleteBtn.innerHTML;
            deleteBtn.innerHTML = '⏳ Deleting...';
            deleteBtn.disabled = true;

            fetch('delete_message.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Remove the message card with animation
                        const messageCard = deleteBtn.closest('.message-card');
                        messageCard.style.transition = 'all 0.3s ease';
                        messageCard.style.opacity = '0';
                        messageCard.style.transform = 'translateX(-20px)';

                        setTimeout(() => {
                            messageCard.remove();

                            // Check if there are no more messages
                            const remainingMessages = document.querySelectorAll('.message-card');
                            if (remainingMessages.length === 0) {
                                location.reload(); // Reload to show "no messages" state
                            }
                        }, 300);

                        closeConfirmModal();

                        // Show success notification (optional)
                        showNotification('Message deleted successfully', 'success');
                    } else {
                        alert('Error: ' + data.message);
                        deleteBtn.innerHTML = originalText;
                        deleteBtn.disabled = false;
                        closeConfirmModal();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while deleting the message');
                    deleteBtn.innerHTML = originalText;
                    deleteBtn.disabled = false;
                    closeConfirmModal();
                });
        }

        function showNotification(message, type) {
            // Simple notification (you can enhance this)
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#4BB543' : '#dc3545'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 2000;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Close modal when clicking outside
        document.getElementById('confirmModal').addEventListener('click', function (e) {
            if (e.target === this) {
                closeConfirmModal();
            }
        });
    </script>
</body>

</html>