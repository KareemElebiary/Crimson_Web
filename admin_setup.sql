-- Add admin role to users table
USE crimson_web;

-- Add is_admin column to users table
ALTER TABLE users 
ADD COLUMN is_admin TINYINT(1) DEFAULT 0 AFTER password;

-- Create a default admin account
-- Username: admin@crimsonweb.com
-- Password: admin123
INSERT INTO users (name, email, password, is_admin, created_at) 
VALUES ('Admin', 'admin@crimsonweb.com', '$2y$10$YourHashedPasswordHere', 1, NOW())
ON DUPLICATE KEY UPDATE is_admin = 1;

-- Update the admin password with proper hash
-- This will be the actual password: admin123
UPDATE users 
SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', is_admin = 1
WHERE email = 'admin@crimsonweb.com';
