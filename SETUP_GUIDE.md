# Church Management System - Setup Guide

## 🚨 Fixing "Failed to mark attendance" Error

If you're getting the error "Failed to mark attendance. Please try again", this is because the database connection is not properly configured. Follow these steps to fix it:

### Step 1: Set Up Supabase Database

#### Option A: Use Existing Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your existing project
3. Go to **Settings > API**
4. Copy your **Project URL** and **anon/public key**

#### Option B: Create New Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Choose your organization and fill in project details
4. Wait for the project to be created (1-2 minutes)
5. Go to **Settings > API**
6. Copy your **Project URL** and **anon/public key**

### Step 2: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-setup.sql` from this project
3. Paste it into the SQL Editor
4. Click **"Run"** to create all necessary tables

### Step 3: Configure Environment Variables

1. In your project root, you'll find a file called `.env.local`
2. Open this file and replace the placeholder values:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**Example:**
```env
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Restart Development Server

After updating the `.env.local` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## ✅ Verifying the Fix

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Try marking attendance again
4. You should see database connection messages in the console
5. If successful, you'll see "Attendance recorded successfully!"

## 🔧 Troubleshooting

### Error: "Missing environment variables"
- Make sure your `.env.local` file exists in the project root
- Check that the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your development server after making changes

### Error: "Invalid Supabase URL format"
- Your URL should start with `https://` and end with `.supabase.co`
- Example: `https://xyzabc123.supabase.co`

### Error: "Database authentication failed"
- Double-check your anon key is correct
- Make sure you copied the **anon/public** key, not the service key
- The anon key is safe to use in your frontend code

### Error: "Already recorded for this date and service"
- This means attendance has already been marked for the selected date and service
- Check the attendance records table to see existing entries
- You can only record attendance once per service per date

### Still Having Issues?

1. Check the browser console for detailed error messages
2. Verify your Supabase project is active (not paused)
3. Make sure you ran the `supabase-setup.sql` script
4. Try refreshing the page after configuration changes

## 🎯 Quick Test

To verify everything is working:

1. Select today's date
2. Choose a service type (Sunday Encounter, Wednesday Miracle, or Friday Prayer)
3. Enter attendance numbers (make sure Total matches the sum of individual counts)
4. Click "Save Attendance"
5. You should see "Attendance recorded successfully!"

## 📊 Database Tables Created

The setup script creates these tables:
- **attendance** - Service attendance records
- **members** - Church member information  
- **donations** - Financial donations
- **visitors** - Visitor information
- **equipment** - Equipment inventory
- **message_templates** - SMS/Email templates

All tables include proper constraints and relationships for data integrity.