-- Migration to add access_type and price_cents columns to quizzes table
-- Run this if your database was created before these columns were added

-- Add access_type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'quizzes' 
        AND column_name = 'access_type'
    ) THEN
        ALTER TABLE quizzes 
        ADD COLUMN access_type TEXT DEFAULT 'private' 
        CHECK (access_type IN ('private', 'market_free', 'market_paid'));
    END IF;
END $$;

-- Add price_cents column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'quizzes' 
        AND column_name = 'price_cents'
    ) THEN
        ALTER TABLE quizzes 
        ADD COLUMN price_cents INTEGER DEFAULT 0;
    END IF;
END $$;

-- Update existing quizzes to have default values
UPDATE quizzes 
SET access_type = 'private', price_cents = 0 
WHERE access_type IS NULL;

-- Verify the migration
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'quizzes' 
AND column_name IN ('access_type', 'price_cents');
