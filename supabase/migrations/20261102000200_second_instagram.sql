-- A second Instagram account can be shown next to the first.
alter table public.site_settings add column if not exists instagram_url_2 text not null default '';
