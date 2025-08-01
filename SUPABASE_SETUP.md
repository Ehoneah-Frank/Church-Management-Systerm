# Supabase Setup for Church Management System

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in Supabase

## Database Setup

### 1. Run the SQL Setup Script

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql` into the editor
4. Click "Run" to execute the script

This will create all the necessary tables:
- `members` - Church member information
- `attendance` - Service attendance records
- `donations` - Financial donations
- `visitors` - Visitor information and follow-up
- `equipment` - Church equipment inventory
- `message_templates` - SMS/Email templates

## Environment Variables

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon/public key

### 2. Create Environment File

Create a `.env.local` file in your project root with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

## Features

### ✅ **Database Integration**
- All data is now stored in Supabase PostgreSQL database
- Real-time data persistence across sessions
- Automatic data synchronization

### ✅ **Image Storage**
- Member photos are stored as base64 strings in the database
- Images persist across page refreshes and sessions

### ✅ **Error Handling**
- Graceful fallback to mock data if database connection fails
- User-friendly error messages
- Loading states for better UX

### ✅ **Data Validation**
- Database constraints ensure data integrity
- Proper foreign key relationships
- Check constraints for enum values

### ✅ **Performance**
- Database indexes for faster queries
- Optimized data loading with Promise.all
- Efficient data updates

## Database Schema

### Members Table
- `id` - UUID primary key
- `name` - Member's full name
- `phone` - Contact phone number
- `email` - Email address
- `department` - Church department
- `baptism_status` - Baptism status (baptized/not-baptized/scheduled)
- `status` - Active/inactive status
- `join_date` - Date joined church
- `birth_date` - Date of birth
- `address` - Physical address
- `photo` - Base64 encoded profile photo
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

### Attendance Table
- `id` - UUID primary key
- `member_id` - Foreign key to members
- `service_date` - Date of service
- `service_type` - Type of service (sunday/wednesday/special)
- `present` - Boolean attendance status
- `notes` - Optional notes
- `created_at` - Record creation timestamp

### Donations Table
- `id` - UUID primary key
- `member_id` - Foreign key to members
- `amount` - Donation amount in Ghana Cedis
- `category` - Donation type (tithe/offering/project/special)
- `date` - Date of donation
- `method` - Payment method (cash/check/online/transfer)
- `notes` - Optional notes
- `receipt_sent` - Boolean receipt status
- `created_at` - Record creation timestamp

### Visitors Table
- `id` - UUID primary key
- `name` - Visitor's name
- `phone` - Contact phone
- `email` - Email address (optional)
- `visit_date` - Date of visit
- `invited_by` - Who invited them (optional)
- `follow_up_status` - Follow-up status (pending/contacted/completed)
- `notes` - Optional notes
- `created_at` - Record creation timestamp

### Equipment Table
- `id` - UUID primary key
- `name` - Equipment name
- `category` - Equipment category
- `condition` - Equipment condition (excellent/good/fair/needs-repair)
- `purchase_date` - Date purchased
- `value` - Equipment value in Ghana Cedis
- `location` - Storage location
- `notes` - Optional notes
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

### Message Templates Table
- `id` - UUID primary key
- `name` - Template name
- `subject` - Email subject line
- `content` - Message content
- `type` - Message type (sms/email)
- `created_at` - Record creation timestamp

## Security

The database includes:
- Row Level Security (RLS) enabled on all tables
- Public access policies for development
- Proper data validation and constraints
- Foreign key relationships for data integrity

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure your `.env.local` file exists with correct credentials
   - Restart your development server after adding environment variables

2. **"Failed to load data from database"**
   - Check your Supabase project URL and API key
   - Verify your database tables were created successfully
   - Check the browser console for detailed error messages

3. **"Error creating member"**
   - Ensure all required fields are filled
   - Check that the database connection is working
   - Verify RLS policies are set correctly

### Testing Database Connection

1. Open browser developer tools (F12)
2. Check the console for database connection messages
3. Look for "Loading data from Supabase..." and "Data loading completed" messages
4. If you see error messages, check your environment variables

## Next Steps

1. **Authentication**: Add user authentication with Supabase Auth
2. **File Storage**: Use Supabase Storage for better image handling
3. **Real-time**: Enable real-time subscriptions for live updates
4. **Backup**: Set up automated database backups
5. **Monitoring**: Add database monitoring and analytics

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Supabase credentials
3. Ensure all database tables were created successfully
4. Check the Supabase dashboard for any service issues 