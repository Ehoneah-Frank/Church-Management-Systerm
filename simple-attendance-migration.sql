-- Simple migration: Add count columns to existing attendance table
-- This allows both old and new systems to work during transition

-- Add new columns for count-based tracking (with defaults)
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS total_count INTEGER DEFAULT 0;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS men_count INTEGER DEFAULT 0;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS women_count INTEGER DEFAULT 0;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS youth_count INTEGER DEFAULT 0;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS children_count INTEGER DEFAULT 0;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS guests_count INTEGER DEFAULT 0;

-- Add check constraints for the new columns
ALTER TABLE attendance ADD CONSTRAINT IF NOT EXISTS attendance_counts_positive 
  CHECK (total_count >= 0 AND men_count >= 0 AND women_count >= 0 AND youth_count >= 0 AND children_count >= 0 AND guests_count >= 0);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_date_service ON attendance(service_date, service_type);

-- Optional: Insert some sample count-based data
INSERT INTO attendance (service_date, service_type, total_count, men_count, women_count, youth_count, children_count, guests_count, notes, created_at)
VALUES 
  (CURRENT_DATE, 'sunday-encounter', 120, 35, 45, 25, 12, 3, 'Sample attendance record', NOW()),
  (CURRENT_DATE - INTERVAL '3 days', 'wednesday-miracle', 80, 25, 30, 15, 8, 2, 'Midweek service', NOW()),
  (CURRENT_DATE - INTERVAL '7 days', 'sunday-encounter', 135, 40, 50, 30, 10, 5, 'Previous Sunday service', NOW())
ON CONFLICT DO NOTHING;