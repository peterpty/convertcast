# Supabase Setup Guide for ConvertCast

## Quick Setup (5 minutes)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub/Google
4. Click "New project"
5. Choose organization and enter:
   - **Name**: `convertcast`
   - **Database Password**: `your-secure-password`
   - **Region**: Choose closest to you
6. Click "Create new project"

### Step 2: Get Your Keys
Once your project is created:
1. Go to Settings → API
2. Copy these values:

```
Project URL: https://your-project-ref.supabase.co
anon public key: eyJhbGc...
service_role key: eyJhbGc...
```

### Step 3: Update Environment Variables
Update your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 4: Set Up Database Schema
1. In Supabase Dashboard, go to SQL Editor
2. Copy and paste the contents of `DATABASE-SCHEMA.sql`
3. Click "Run"

### Step 5: Enable Authentication
1. Go to Authentication → Settings
2. Set Site URL to: `http://localhost:3340`
3. Add Redirect URLs:
   - `http://localhost:3340/auth/callback`
4. Save configuration

### Step 6: Test Connection
Run in terminal:
```bash
npm run db:verify
```

You should see ✅ success messages for all tables.

## Alternative: Use Demo Mode

If you want to skip Supabase setup for now, I can create a demo mode that simulates the backend without requiring a database.

Let me know which option you prefer!