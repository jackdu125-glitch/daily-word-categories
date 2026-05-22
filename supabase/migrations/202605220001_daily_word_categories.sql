create table if not exists public.puzzles (
  date date primary key,
  words jsonb not null,
  categories jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint puzzles_words_is_16 check (jsonb_array_length(words) = 16),
  constraint puzzles_categories_is_4 check (jsonb_array_length(categories) = 4)
);

create table if not exists public.userprogress (
  userid uuid not null references auth.users(id) on delete cascade,
  puzzledate date not null references public.puzzles(date) on delete cascade,
  solvedat timestamptz not null default now(),
  primary key (userid, puzzledate)
);

create index if not exists userprogress_userid_idx
  on public.userprogress (userid);

create index if not exists userprogress_puzzledate_idx
  on public.userprogress (puzzledate);

alter table public.puzzles enable row level security;
alter table public.userprogress enable row level security;

drop policy if exists "Anyone can read published puzzles" on public.puzzles;
create policy "Anyone can read published puzzles"
  on public.puzzles
  for select
  using (true);

drop policy if exists "Authenticated users can read own progress" on public.userprogress;
create policy "Authenticated users can read own progress"
  on public.userprogress
  for select
  to authenticated
  using (auth.uid() = userid);

drop policy if exists "Authenticated users can insert own progress" on public.userprogress;
create policy "Authenticated users can insert own progress"
  on public.userprogress
  for insert
  to authenticated
  with check (auth.uid() = userid);

drop policy if exists "Authenticated users can update own progress" on public.userprogress;
create policy "Authenticated users can update own progress"
  on public.userprogress
  for update
  to authenticated
  using (auth.uid() = userid)
  with check (auth.uid() = userid);
