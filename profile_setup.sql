-- Add profile_picture column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255) DEFAULT NULL;

-- Add created_at column if it doesn't exist (for showing member since date)
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create uploads directory structure (you'll need to create this manually)
-- uploads/profile_pictures/
