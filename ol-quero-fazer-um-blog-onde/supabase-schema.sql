create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'member' check (role in ('admin', 'editor', 'member')),
  avatar text,
  created_at timestamptz not null default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  cover text not null,
  gallery text[] not null default '{}',
  affiliate_link text,
  author text not null default 'Editor Nexus',
  date timestamptz not null default now(),
  read_time text not null default '4 min',
  likes integer not null default 0,
  comments integer not null default 0,
  featured boolean not null default false,
  trending boolean not null default false,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table posts add column if not exists gallery text[] not null default '{}';
alter table posts add column if not exists affiliate_link text;
alter table posts add column if not exists author text not null default 'Editor Nexus';
alter table posts add column if not exists date timestamptz not null default now();
alter table posts add column if not exists likes integer not null default 0;
alter table posts add column if not exists comments integer not null default 0;
alter table posts alter column date type timestamptz using date::timestamptz;
alter table posts alter column date set default now();

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  user_name text not null default 'Visitante',
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists likes (
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;
alter table push_subscriptions enable row level security;

drop policy if exists "Public profiles are readable" on profiles;
drop policy if exists "Posts are readable" on posts;
drop policy if exists "Posts can be created from app" on posts;
drop policy if exists "Posts can be updated from app" on posts;
drop policy if exists "Posts can be deleted from app" on posts;
drop policy if exists "Comments are readable" on comments;
drop policy if exists "Comments can be created from app" on comments;
drop policy if exists "Likes are readable" on likes;
drop policy if exists "Users can like" on likes;
drop policy if exists "Users can remove own like" on likes;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Push subscriptions are service-managed" on push_subscriptions;

create policy "Public profiles are readable" on profiles for select using (true);
create policy "Posts are readable" on posts for select using (true);
create policy "Posts can be created from app" on posts for insert with check (true);
create policy "Posts can be updated from app" on posts for update using (true) with check (true);
create policy "Posts can be deleted from app" on posts for delete using (true);
create policy "Comments are readable" on comments for select using (true);
create policy "Comments can be created from app" on comments for insert with check (true);
create policy "Likes are readable" on likes for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can like" on likes for insert with check (auth.uid() = user_id);
create policy "Users can remove own like" on likes for delete using (auth.uid() = user_id);
create policy "Push subscriptions are service-managed" on push_subscriptions for all using (false) with check (false);
