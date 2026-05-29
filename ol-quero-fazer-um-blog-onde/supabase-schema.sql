create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'member' check (role in ('admin', 'editor', 'member')),
  avatar text,
  created_at timestamptz not null default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  cover text not null,
  author_id uuid references profiles(id),
  read_time text not null default '4 min',
  featured boolean not null default false,
  trending boolean not null default false,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create table likes (
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;

create policy "Public profiles are readable" on profiles for select using (true);
create policy "Posts are readable" on posts for select using (true);
create policy "Comments are readable" on comments for select using (true);
create policy "Likes are readable" on likes for select using (true);

create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can comment" on comments for insert with check (auth.uid() = user_id);
create policy "Users can like" on likes for insert with check (auth.uid() = user_id);
create policy "Users can remove own like" on likes for delete using (auth.uid() = user_id);
