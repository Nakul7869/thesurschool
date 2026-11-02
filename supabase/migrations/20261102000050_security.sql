-- Security rules: the public reads published content, only the admin writes. Plus photo storage.

alter table public.site_settings enable row level security;
drop policy if exists "Read settings" on public.site_settings;
drop policy if exists "Admin adds settings" on public.site_settings;
drop policy if exists "Admin edits settings" on public.site_settings;
create policy "Read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admin adds settings" on public.site_settings for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admin edits settings" on public.site_settings for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

do $$
declare t text;
begin
  foreach t in array array['courses', 'course_levels', 'gallery_items', 'events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Read published" on public.%I', t);
    execute format('drop policy if exists "Admin adds" on public.%I', t);
    execute format('drop policy if exists "Admin edits" on public.%I', t);
    execute format('drop policy if exists "Admin removes" on public.%I', t);
    execute format('create policy "Read published" on public.%I for select to anon, authenticated using (is_published or (select public.is_admin()))', t);
    execute format('create policy "Admin adds" on public.%I for insert to authenticated with check ((select public.is_admin()))', t);
    execute format('create policy "Admin edits" on public.%I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('create policy "Admin removes" on public.%I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admin reads media" on storage.objects;
drop policy if exists "Admin uploads media" on storage.objects;
drop policy if exists "Admin replaces media" on storage.objects;
drop policy if exists "Admin deletes media" on storage.objects;
create policy "Admin reads media" on storage.objects for select to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()));
create policy "Admin uploads media" on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and (select public.is_admin()));
create policy "Admin replaces media" on storage.objects for update to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()))
  with check (bucket_id = 'site-media' and (select public.is_admin()));
create policy "Admin deletes media" on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()));
