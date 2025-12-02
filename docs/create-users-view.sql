-- ============================================
-- Create Users View
-- ============================================
-- This creates a view in public schema to see all users
-- Run this in Supabase SQL Editor
-- ============================================

-- Create view for users (read-only from auth.users)
CREATE OR REPLACE VIEW public.users AS
SELECT 
  id,
  email,
  email_confirmed_at,
  phone,
  confirmed_at,
  last_sign_in_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
FROM auth.users;

-- Grant SELECT permission to authenticated users
-- (Only authenticated users can see the view)
GRANT SELECT ON public.users TO authenticated;

-- Optional: Create a more detailed view with task counts
CREATE OR REPLACE VIEW public.users_with_stats AS
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  u.last_sign_in_at,
  COUNT(t.id) as task_count,
  COUNT(CASE WHEN t.status = 'open' THEN 1 END) as open_tasks,
  COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as in_progress_tasks,
  COUNT(CASE WHEN t.status = 'done' THEN 1 END) as done_tasks
FROM auth.users u
LEFT JOIN public.tasks t ON u.id = t.user_id
GROUP BY u.id, u.email, u.email_confirmed_at, u.created_at, u.last_sign_in_at;

-- Grant SELECT permission
GRANT SELECT ON public.users_with_stats TO authenticated;

-- ============================================
-- Note: To view users in Supabase Dashboard
-- ============================================
-- 1. Go to Table Editor
-- 2. Select schema "public" (not "auth")
-- 3. You should see "users" and "users_with_stats" views
-- 
-- Or use SQL Editor:
-- SELECT * FROM public.users;
-- SELECT * FROM public.users_with_stats;

