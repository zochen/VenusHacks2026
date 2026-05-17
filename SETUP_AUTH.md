# Supabase Authentication Setup Guide

This guide walks you through setting up Supabase authentication for CapyConnect.

## Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/create an account
2. Click "New Project"
3. Choose your organization and fill in the project details:
   - **Name**: `capyconnect` (or similar)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Wait for project to be created (2-3 minutes)

### 2. Get Your Credentials

1. Go to Project Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** (optional) → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure Environment Variables

1. Copy `apps/web/.env.local.example` to `apps/web/.env.local`
2. Paste your credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Create Database Tables

1. Go to your Supabase project dashboard
2. Click "SQL Editor" on the left sidebar
3. Click "New Query"
4. Paste this SQL to create the required tables:

```sql
-- User Profiles table (extends Supabase auth_users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  birthdate DATE,
  location TEXT,
  avatar_url TEXT,
  company TEXT,
  company_role TEXT,
  role TEXT DEFAULT 'candidate', -- 'candidate', 'interviewer', 'both'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences table
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  communication_style TEXT DEFAULT 'default', -- 'default', 'relaxed', 'focus'
  captions_enabled BOOLEAN DEFAULT TRUE,
  comfort_companion_enabled BOOLEAN DEFAULT TRUE,
  font_scale INTEGER DEFAULT 100, -- percentage
  selected_features TEXT[] DEFAULT ARRAY[]::TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Planned Interviews table
CREATE TABLE public.planned_interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_email TEXT,
  candidate_name TEXT,
  interviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID NOT NULL REFERENCES public.planned_interviews(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  notes TEXT,
  order_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can read own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for planned_interviews (can see as candidate or interviewer)
CREATE POLICY "Users can read their interviews" ON public.planned_interviews
  FOR SELECT USING (
    auth.uid() = candidate_id
    OR auth.uid() = interviewer_id
    OR candidate_email = auth.jwt() ->> 'email'
  );
CREATE POLICY "Interviewers can insert their interviews" ON public.planned_interviews
  FOR INSERT WITH CHECK (auth.uid() = interviewer_id);
CREATE POLICY "Users can update their interviews" ON public.planned_interviews
  FOR UPDATE USING (
    auth.uid() = candidate_id
    OR auth.uid() = interviewer_id
    OR candidate_email = auth.jwt() ->> 'email'
  );

-- RLS Policies for questions (inherit from interview)
CREATE POLICY "Users can read interview questions" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.planned_interviews
      WHERE planned_interviews.id = interview_id
      AND (
        auth.uid() = planned_interviews.candidate_id
        OR auth.uid() = planned_interviews.interviewer_id
        OR planned_interviews.candidate_email = auth.jwt() ->> 'email'
      )
    )
  );
CREATE POLICY "Interviewers can insert interview questions" ON public.questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.planned_interviews
      WHERE planned_interviews.id = interview_id
      AND auth.uid() = planned_interviews.interviewer_id
    )
  );

```

5. Run the query (click "Run" or Ctrl+Enter)

If you already created the tables before `selected_features` was added, run this migration once:

```sql
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS company_role TEXT;

ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS selected_features TEXT[] DEFAULT ARRAY[]::TEXT[];
```

If you already created `planned_interviews` before candidate email scheduling was added, run this migration once:

```sql
ALTER TABLE public.planned_interviews
ALTER COLUMN candidate_id DROP NOT NULL,
ADD COLUMN IF NOT EXISTS candidate_email TEXT,
ADD COLUMN IF NOT EXISTS candidate_name TEXT,
ADD COLUMN IF NOT EXISTS role TEXT;

CREATE POLICY "Interviewers can insert their interviews" ON public.planned_interviews
  FOR INSERT WITH CHECK (auth.uid() = interviewer_id);

CREATE POLICY "Interviewers can insert interview questions" ON public.questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.planned_interviews
      WHERE planned_interviews.id = interview_id
      AND auth.uid() = planned_interviews.interviewer_id
    )
  );

CREATE POLICY "Candidates can read emailed interviews" ON public.planned_interviews
  FOR SELECT USING (candidate_email = auth.jwt() ->> 'email');

CREATE POLICY "Candidates can read emailed interview questions" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.planned_interviews
      WHERE planned_interviews.id = interview_id
      AND planned_interviews.candidate_email = auth.jwt() ->> 'email'
    )
  );
```

### 5. Configure Email Templates (Optional but Recommended)

1. Go to Authentication → Email Templates
2. Customize the confirmation email template if desired
3. The default template works fine for basic needs

### 6. Set Up Redirect URLs

1. Go to Authentication → URL Configuration
2. Add these redirect URLs:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-domain.com/auth/callback` (for production)

### 7. Install Dependencies

In the repository root:
```bash
npm install
```

This will install all packages including the Supabase dependencies added to:
- `apps/web/package.json`
- `packages/shared-lib/package.json`

### 8. Test Login Flow

1. Start the development server:
   ```bash
   cd apps/web
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth/signup`
3. Create a test account
4. You should be redirected to the onboarding page after signup

## File Changes Summary

### New Files Created:
- `apps/web/app/auth/login/page.tsx` - Login page
- `apps/web/app/auth/signup/page.tsx` - Signup page
- `apps/web/app/auth/callback/route.ts` - OAuth callback handler
- `apps/web/app/api/auth/logout/route.ts` - Logout endpoint
- `apps/web/app/HeaderNav.tsx` - Dynamic navigation component
- `apps/web/lib/AuthContext.tsx` - Auth context and useAuth hook
- `apps/web/middleware.ts` - Route protection middleware
- `apps/web/.env.local.example` - Environment variables template
- `packages/shared-lib/src/auth/index.ts` - Auth utilities
- `SETUP_AUTH.md` - This file

### Modified Files:
- `apps/web/app/layout.tsx` - Added AuthProvider and HeaderNav
- `apps/web/package.json` - Added Supabase dependencies
- `packages/shared-lib/package.json` - Added @supabase/ssr
- `packages/shared-lib/src/supabase/client.ts` - Implemented createBrowserSupabaseClient and createServerSupabaseClient
- `packages/shared-types/src/index.ts` - Added User, UserProfile, UserPreferences types

## Protected Routes

These routes now require authentication:
- `/onboarding`
- `/candidate/*`
- `/interviewer/*`

Unauthenticated users will be redirected to `/auth/login`

## Features Implemented

✅ User registration with email/password
✅ User login
✅ User logout
✅ Route protection with middleware
✅ Auth context for accessing user data
✅ User profiles table
✅ User preferences table
✅ Planned interviews tracking
✅ Row Level Security (RLS) on all tables

## Next Steps

1. Update the onboarding flow to save user profile data to the database
2. Create API endpoints to fetch/update user preferences
3. Create interview scheduling functionality
4. Add password reset flow
5. Add social authentication (Google, GitHub, etc.)

## Troubleshooting

### "Cannot find module '@supabase/ssr'"
Run `npm install` in the repository root to install dependencies

### Redirect loop on login
Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local`

### Email confirmation not working
Check that your redirect URLs are configured correctly in Supabase dashboard under Authentication → URL Configuration

### RLS policies blocking queries
Check Supabase logs (Project Settings → Logs) to see which policy is blocking the query
