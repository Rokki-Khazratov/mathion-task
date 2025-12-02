-- ============================================
-- Seed Data - Test Tasks
-- ============================================
-- Run this in Supabase SQL Editor to populate tasks table
-- ============================================

-- User IDs (from your tokens)
-- User A: 8a89a30f-afa3-4e5f-a414-6e100ded48f8
-- User B: 45fac2fe-512f-4462-8111-712680955a1b

-- ============================================
-- 1. Insert tasks for User A
-- ============================================

INSERT INTO public.tasks (user_id, title, description, status, deadline) VALUES
  ('8a89a30f-afa3-4e5f-a414-6e100ded48f8', 'Complete project documentation', 'Write comprehensive API documentation for the task management app', 'in_progress', '2025-12-15'),
  ('8a89a30f-afa3-4e5f-a414-6e100ded48f8', 'Setup authentication flow', 'Implement login and registration screens in React Native', 'open', '2025-12-10'),
  ('8a89a30f-afa3-4e5f-a414-6e100ded48f8', 'Test RLS policies', 'Verify that users can only see their own tasks', 'done', '2025-12-01'),
  ('8a89a30f-afa3-4e5f-a414-6e100ded48f8', 'Design task list UI', 'Create mockups for the task list screen with filters and sorting', 'open', NULL);

-- ============================================
-- 2. Insert tasks for User B
-- ============================================

INSERT INTO public.tasks (user_id, title, description, status, deadline) VALUES
  ('45fac2fe-512f-4462-8111-712680955a1b', 'Review code changes', 'Review pull request for backend CRUD implementation', 'in_progress', '2025-12-08'),
  ('45fac2fe-512f-4462-8111-712680955a1b', 'Write unit tests', 'Add test coverage for task management endpoints', 'open', '2025-12-20'),
  ('45fac2fe-512f-4462-8111-712680955a1b', 'Deploy to staging', 'Deploy the application to staging environment for testing', 'open', '2025-12-12');

-- ============================================
-- 3. Verify inserted data
-- ============================================

-- Check total count
SELECT COUNT(*) as total_tasks FROM public.tasks;

-- Check tasks by user
SELECT user_id, COUNT(*) as task_count 
FROM public.tasks 
GROUP BY user_id;

