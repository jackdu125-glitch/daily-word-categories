alter table public.forum_posts
  drop constraint if exists forum_posts_category_check;

update public.forum_posts
set category = case
  when category = 'Today Puzzle' then 'General'
  when category = 'Strategy' then 'Guides'
  when category = 'Feedback' then 'Bug Report'
  else category
end
where category in ('Today Puzzle', 'Strategy', 'Feedback');

alter table public.forum_posts
  add constraint forum_posts_category_check
  check (category in ('Announcements', 'General', 'Guides', 'Fan-Art', 'Bug Report'));
