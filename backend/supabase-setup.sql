
-- 1. Create tasks table
-- ============================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done')),
  deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create index for faster queries by user
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);

-- 3. Enable Row Level Security
-- ============================================
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (for re-running script)
-- ============================================
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;

-- 5. RLS Policies - Users can only access their own tasks
-- ============================================

-- SELECT: Users can view only their own tasks
CREATE POLICY "Users can view own tasks"
  ON public.tasks
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can create tasks only for themselves
CREATE POLICY "Users can create own tasks"
  ON public.tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update only their own tasks
CREATE POLICY "Users can update own tasks"
  ON public.tasks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete only their own tasks
CREATE POLICY "Users can delete own tasks"
  ON public.tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Auto-update updated_at using Supabase's built-in moddatetime
-- ============================================
-- Enable the extension if not already enabled
CREATE EXTENSION IF NOT EXISTS moddatetime;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS handle_updated_at ON public.tasks;

-- Create trigger using moddatetime extension
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime('updated_at');
