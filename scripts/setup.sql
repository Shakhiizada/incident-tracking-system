-- Create incidents table
create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text default 'open',
  priority text default 'medium',
  category text default 'other',
  user_id uuid not null,
  created_by uuid,
  assigned_to uuid,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create team_members table
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text default 'member',
  status text default 'active',
  user_id uuid not null,
  created_at timestamp with time zone default now()
);

-- Create incident_comments table
create table if not exists public.incident_comments (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.incidents(id) on delete cascade,
  user_id uuid not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.incidents enable row level security;
alter table public.team_members enable row level security;
alter table public.incident_comments enable row level security;

-- Incidents policies
create policy "incidents_select" on public.incidents for select using (true);
create policy "incidents_insert" on public.incidents for insert with check (auth.uid() = user_id);
create policy "incidents_update" on public.incidents for update using (auth.uid() = user_id);
create policy "incidents_delete" on public.incidents for delete using (auth.uid() = user_id);

-- Team members policies
create policy "team_select" on public.team_members for select using (true);
create policy "team_insert" on public.team_members for insert with check (auth.uid() = user_id);
create policy "team_update" on public.team_members for update using (auth.uid() = user_id);
create policy "team_delete" on public.team_members for delete using (auth.uid() = user_id);

-- Comments policies
create policy "comments_select" on public.incident_comments for select using (true);
create policy "comments_insert" on public.incident_comments for insert with check (auth.uid() = user_id);
