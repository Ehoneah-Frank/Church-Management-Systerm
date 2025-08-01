-- Update attendance table for count-based tracking
-- This script transforms the individual member tracking to aggregate counts

-- First, backup existing data if needed
-- CREATE TABLE attendance_backup AS SELECT * FROM attendance;

-- Drop existing constraints and foreign keys
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_member_id_fkey;

-- Add new columns for count-based tracking
ALTER TABLE attendance ADD COLUMN total_count INTEGER DEFAULT 0;
ALTER TABLE attendance ADD COLUMN men_count INTEGER DEFAULT 0;
ALTER TABLE attendance ADD COLUMN women_count INTEGER DEFAULT 0;
ALTER TABLE attendance ADD COLUMN youth_count INTEGER DEFAULT 0;
ALTER TABLE attendance ADD COLUMN children_count INTEGER DEFAULT 0;
ALTER TABLE attendance ADD COLUMN guests_count INTEGER DEFAULT 0;

-- For existing data, you might want to aggregate individual records into counts
-- This is an example - adjust based on your needs:
-- INSERT INTO attendance (service_date, service_type, total_count, men_count, women_count, youth_count, children_count, guests_count, notes)
-- SELECT 
--   service_date,
--   service_type,
--   COUNT(*) as total_count,
--   -- Add logic to count by gender/category based on your member data
--   0 as men_count,
--   0 as women_count, 
--   0 as youth_count,
--   0 as children_count,
--   0 as guests_count,
--   'Migrated from individual records' as notes
-- FROM attendance_backup 
-- WHERE present = true
-- GROUP BY service_date, service_type;

-- Remove old columns (be careful - backup first!)
-- ALTER TABLE attendance DROP COLUMN member_id;
-- ALTER TABLE attendance DROP COLUMN present;

-- Make new columns NOT NULL after setting defaults
ALTER TABLE attendance ALTER COLUMN total_count SET NOT NULL;
ALTER TABLE attendance ALTER COLUMN men_count SET NOT NULL;
ALTER TABLE attendance ALTER COLUMN women_count SET NOT NULL;
ALTER TABLE attendance ALTER COLUMN youth_count SET NOT NULL;
ALTER TABLE attendance ALTER COLUMN children_count SET NOT NULL;
ALTER TABLE attendance ALTER COLUMN guests_count SET NOT NULL;

-- Add check constraints
ALTER TABLE attendance ADD CONSTRAINT attendance_counts_positive 
  CHECK (total_count >= 0 AND men_count >= 0 AND women_count >= 0 AND youth_count >= 0 AND children_count >= 0 AND guests_count >= 0);

-- Optionally add a constraint to ensure breakdown adds up to total
-- ALTER TABLE attendance ADD CONSTRAINT attendance_counts_match_total
--   CHECK (total_count = men_count + women_count + youth_count + children_count + guests_count);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_attendance_date_service ON attendance(service_date, service_type);