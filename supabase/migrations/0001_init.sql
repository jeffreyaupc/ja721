-- 個人網站 schema: categories (open-ended, keyed to a fixed set of display
-- styles), items, notes (1:1 extension for note_page-style items), and a
-- singleton site_settings row for header/footer text.

create extension if not exists pgcrypto;

create type display_style as enum (
  'teaser_reveal',
  'full_text',
  'image_caption',
  'audio_player',
  'tag_list',
  'note_page'
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  display_style display_style not null,
  is_builtin boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete restrict,
  title text not null,
  teaser text,
  body text,
  image_url text,
  audio_url text,
  song_kind text check (song_kind in ('original', 'cover')),
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table notes (
  item_id uuid primary key references items(id) on delete cascade,
  slug text not null unique,
  template text not null default 'standard' check (template in ('custom', 'standard')),
  markdown_body text,
  custom_html text,
  custom_css text,
  updated_at timestamptz not null default now()
);

create table site_settings (
  id boolean primary key default true check (id),
  eyebrow text not null default '',
  title text not null default '尚未命名',
  motto text not null default '如此可爾',
  intro text not null default '',
  seal_text text not null default '手記',
  footer_text text not null default '如此可爾——不是結論，是一種姿勢。',
  updated_at timestamptz not null default now()
);

create index items_category_idx on items(category_id);

-- Row level security: anyone can read, only an authenticated session (the
-- single author account, since there is no public signup) can write.

alter table categories enable row level security;
alter table items enable row level security;
alter table notes enable row level security;
alter table site_settings enable row level security;

create policy categories_public_read on categories for select using (true);
create policy categories_admin_write on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy items_public_read on items for select using (true);
create policy items_admin_write on items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy notes_public_read on notes for select using (true);
create policy notes_admin_write on notes for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy site_settings_public_read on site_settings for select using (true);
create policy site_settings_admin_write on site_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage bucket for painting images / song audio+covers.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy media_public_read on storage.objects for select
  using (bucket_id = 'media');
create policy media_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'media');
create policy media_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'media');
create policy media_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'media');
