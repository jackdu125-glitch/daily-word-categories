create table if not exists public.profiles (
  userid uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('member', 'moderator', 'admin'))
);

create table if not exists public.memberships (
  userid uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'free',
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memberships_status_check check (status in ('free', 'trialing', 'active', 'past_due', 'canceled'))
);

create table if not exists public.guide_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  puzzle_date date,
  title text not null,
  excerpt text not null,
  free_body text not null,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guide_articles_status_check check (status in ('draft', 'published'))
);

create table if not exists public.guide_premium_sections (
  guide_id uuid primary key references public.guide_articles(id) on delete cascade,
  premium_body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  userid uuid references auth.users(id) on delete set null,
  title text not null,
  body text not null,
  category text not null default 'Today Puzzle',
  is_official boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint forum_posts_category_check check (category in ('Today Puzzle', 'Strategy', 'Feedback', 'General'))
);

create table if not exists public.forum_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  userid uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forum_votes (
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  userid uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, userid)
);

create index if not exists memberships_status_idx on public.memberships (status);
create index if not exists guide_articles_puzzle_date_idx on public.guide_articles (puzzle_date);
create index if not exists forum_posts_created_at_idx on public.forum_posts (created_at desc);
create index if not exists forum_comments_post_id_idx on public.forum_comments (post_id);

alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.guide_articles enable row level security;
alter table public.guide_premium_sections enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_comments enable row level security;
alter table public.forum_votes enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

drop policy if exists "Users can upsert own profile" on public.profiles;
create policy "Users can upsert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = userid);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = userid)
  with check (auth.uid() = userid);

drop policy if exists "Users can read own membership" on public.memberships;
create policy "Users can read own membership"
  on public.memberships for select to authenticated
  using (auth.uid() = userid);

drop policy if exists "Published guide previews are public" on public.guide_articles;
create policy "Published guide previews are public"
  on public.guide_articles for select
  using (status = 'published');

drop policy if exists "Members can read premium guides" on public.guide_premium_sections;
create policy "Members can read premium guides"
  on public.guide_premium_sections for select to authenticated
  using (
    exists (
      select 1
      from public.memberships
      where memberships.userid = auth.uid()
        and memberships.status in ('trialing', 'active')
    )
  );

drop policy if exists "Forum posts are public" on public.forum_posts;
create policy "Forum posts are public"
  on public.forum_posts for select using (true);

drop policy if exists "Authenticated users can create forum posts" on public.forum_posts;
create policy "Authenticated users can create forum posts"
  on public.forum_posts for insert to authenticated
  with check (auth.uid() = userid);

drop policy if exists "Users can update own forum posts" on public.forum_posts;
create policy "Users can update own forum posts"
  on public.forum_posts for update to authenticated
  using (auth.uid() = userid)
  with check (auth.uid() = userid);

drop policy if exists "Forum comments are public" on public.forum_comments;
create policy "Forum comments are public"
  on public.forum_comments for select using (true);

drop policy if exists "Authenticated users can create forum comments" on public.forum_comments;
create policy "Authenticated users can create forum comments"
  on public.forum_comments for insert to authenticated
  with check (auth.uid() = userid);

drop policy if exists "Forum votes are public" on public.forum_votes;
create policy "Forum votes are public"
  on public.forum_votes for select using (true);

drop policy if exists "Authenticated users can vote once" on public.forum_votes;
create policy "Authenticated users can vote once"
  on public.forum_votes for insert to authenticated
  with check (auth.uid() = userid);

insert into public.guide_articles (slug, puzzle_date, title, excerpt, free_body, status)
values (
  'today',
  current_date,
  'Today''s Daily Word Categories Strategy',
  'Start with obvious semantic clusters, then save flexible words for the last two groups.',
  'Begin by scanning for four words that share a direct category. Do not spend early guesses on clever double meanings. If two words feel flexible, leave them unselected until the board has fewer distractors.',
  'published'
)
on conflict (slug) do update
set
  title = excluded.title,
  excerpt = excluded.excerpt,
  free_body = excluded.free_body,
  updated_at = now();

insert into public.guide_premium_sections (guide_id, premium_body)
select id, 'Premium walkthrough: identify the cleanest group first, then compare remaining words by part of speech, setting, and phrase usage. The strongest players avoid guessing when two selected words only share a vague theme.'
from public.guide_articles
where slug = 'today'
on conflict (guide_id) do update
set premium_body = excluded.premium_body, updated_at = now();

insert into public.forum_posts (title, body, category, is_official)
values
  ('How did today''s board feel?', 'Share the group that made the puzzle click for you. Keep full spoilers inside clearly marked comments.', 'Today Puzzle', true),
  ('Best first move: obvious group or weird words?', 'Some players clear the easy set first. Others isolate the suspicious words. Which habit works better for you?', 'Strategy', true)
on conflict do nothing;
