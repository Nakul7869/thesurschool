-- The Sur School: tables, security rules, photo storage and starting content.
-- Safe to run more than once.

-- 1. Who is the admin ---------------------------------------------------------
create table if not exists public.admin_emails (
  email text primary key check (email = lower(email))
);
alter table public.admin_emails enable row level security; -- no policies: only is_admin() can read it

insert into public.admin_emails (email) values ('thesurschool@gmail.com') on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_emails a
    join auth.users u on lower(u.email) = a.email
    where u.id = auth.uid()
      and u.email_confirmed_at is not null
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2. Tables -------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  school_name text not null default '',
  tagline text not null default '',
  hero_heading text not null default '',
  hero_subheading text not null default '',
  teacher_name text not null default '',
  teacher_title text not null default '',
  teacher_bio text not null default '',
  teacher_photo_path text,
  whatsapp_number text not null default '',
  phone text not null default '',
  email text not null default '',
  instagram_url text not null default '',
  youtube_url text not null default '',
  facebook_url text not null default '',
  service_area text not null default '',
  class_modes_note text not null default '',
  grading_note text not null default '',
  stats jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.course_levels (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  level_name text not null,
  description text not null default '',
  duration text not null default '',
  fee text not null default '',
  offers_grading boolean not null default true,
  grading_fee text not null default '',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists course_levels_course_id_idx on public.course_levels (course_id);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('photo', 'video')),
  storage_path text,
  video_url text,
  caption text not null default '',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  check ((kind = 'photo' and storage_path is not null) or (kind = 'video' and video_url is not null))
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'event' check (kind in ('event', 'news')),
  title text not null,
  summary text not null default '',
  details text not null default '',
  starts_on date not null,
  location text not null default '',
  tags text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists events_starts_on_idx on public.events (starts_on);
