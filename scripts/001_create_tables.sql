-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  avatar_url TEXT,
  phone TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  category TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  position TEXT,
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create incident_comments table
CREATE TABLE IF NOT EXISTS public.incident_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create incident_history table for tracking changes
CREATE TABLE IF NOT EXISTS public.incident_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'ru',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Incidents policies (authenticated users can view all, but only create/update their own or if admin)
CREATE POLICY "incidents_select_all" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "incidents_insert_auth" ON public.incidents FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "incidents_update_auth" ON public.incidents FOR UPDATE USING (
  auth.uid() = created_by OR 
  auth.uid() = assigned_to OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "incidents_delete_auth" ON public.incidents FOR DELETE USING (
  auth.uid() = created_by OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Team members policies
CREATE POLICY "team_members_select_all" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "team_members_insert_admin" ON public.team_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "team_members_update_admin" ON public.team_members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "team_members_delete_admin" ON public.team_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Comments policies
CREATE POLICY "comments_select_all" ON public.incident_comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_auth" ON public.incident_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update_own" ON public.incident_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete_own" ON public.incident_comments FOR DELETE USING (auth.uid() = user_id);

-- History policies
CREATE POLICY "history_select_all" ON public.incident_history FOR SELECT USING (true);
CREATE POLICY "history_insert_auth" ON public.incident_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "settings_select_own" ON public.settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "settings_insert_own" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "settings_update_own" ON public.settings FOR UPDATE USING (auth.uid() = user_id);
