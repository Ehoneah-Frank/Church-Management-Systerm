-- Clear all data from Church Management System tables
-- WARNING: This will permanently delete all data!

-- Clear all tables (in reverse dependency order)
DELETE FROM attendance;
DELETE FROM donations;
DELETE FROM visitors;
DELETE FROM equipment;
DELETE FROM message_templates;
DELETE FROM members;

-- Reset auto-increment sequences (if any)
-- Note: Supabase uses UUIDs, so no sequences to reset

-- Verify tables are empty
SELECT 'members' as table_name, COUNT(*) as count FROM members
UNION ALL
SELECT 'attendance' as table_name, COUNT(*) as count FROM attendance
UNION ALL
SELECT 'donations' as table_name, COUNT(*) as count FROM donations
UNION ALL
SELECT 'visitors' as table_name, COUNT(*) as count FROM visitors
UNION ALL
SELECT 'equipment' as table_name, COUNT(*) as count FROM equipment
UNION ALL
SELECT 'message_templates' as table_name, COUNT(*) as count FROM message_templates; 