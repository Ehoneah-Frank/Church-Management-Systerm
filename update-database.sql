-- Update Church Management System Database
-- Run this script to update your existing database with new service types and member groups

-- Update service types in attendance table
-- First, let's check what service types currently exist
SELECT DISTINCT service_type FROM attendance;

-- Update existing records to new service types
UPDATE attendance 
SET service_type = 'sunday-encounter' 
WHERE service_type = 'sunday';

UPDATE attendance 
SET service_type = 'wednesday-miracle' 
WHERE service_type = 'wednesday';

UPDATE attendance 
SET service_type = 'friday-prayer' 
WHERE service_type = 'special';

-- Update the CHECK constraint for service_type
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_service_type_check;
ALTER TABLE attendance ADD CONSTRAINT attendance_service_type_check 
CHECK (service_type IN ('sunday-encounter', 'wednesday-miracle', 'friday-prayer'));

-- Update member departments to new groups
-- First, let's see what departments currently exist
SELECT DISTINCT department FROM members;

-- Update existing departments to new groups
-- You may want to manually review and update these based on your church structure
UPDATE members 
SET department = 'Faith' 
WHERE department IN ('worship', 'choir', 'prayer');

UPDATE members 
SET department = 'Love' 
WHERE department IN ('youth', 'children', 'ushers');

UPDATE members 
SET department = 'Hope' 
WHERE department IN ('evangelism', 'administration', 'media');

-- Update the CHECK constraint for department
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_department_check;
ALTER TABLE members ADD CONSTRAINT members_department_check 
CHECK (department IN ('Faith', 'Love', 'Hope'));

-- Verify the updates
SELECT 'Updated service types:' as info;
SELECT DISTINCT service_type FROM attendance;

SELECT 'Updated member groups:' as info;
SELECT DISTINCT department FROM members;

-- Show summary
SELECT 'Database update completed successfully!' as status; 