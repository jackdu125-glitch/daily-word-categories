update public.guide_articles
set
  title = 'Today''s new game AAA Strategy Brief',
  excerpt = 'Track the newest AAA release chatter, then compress guides into routes, builds, bosses, and key player questions.',
  free_body = 'Start with the game''s current patch, highest-search guide topics, and the biggest blocker players mention. A useful brief should answer what to do next, what to collect, what build works, and what mistake to avoid.',
  updated_at = now()
where slug = 'today';

update public.guide_premium_sections
set
  premium_body = 'Premium synthesis: compare IGN-style news discovery, Game8-style guide matrices, Fextralife-style route and build depth, and Guide Strats-style concise step writing. Convert the best parts into one readable brief with route order, build priority, boss counter, collectible checklist, and common player mistakes.',
  updated_at = now()
where guide_id in (
  select id from public.guide_articles where slug = 'today'
);

update public.forum_posts
set
  title = 'Which AAA guide should new game break down next?',
  body = 'Drop the game, boss, build, quest, or collectible route you want summarized into a cleaner player brief.',
  category = 'General',
  updated_at = now()
where title in ('How did today''s board feel?', 'Which AAA guide should new game break down next?');

update public.forum_posts
set
  title = 'Best guide format: route map, build card, or boss checklist?',
  body = 'The strongest guide sites organize information differently. Which format helps you act fastest in-game?',
  category = 'Guides',
  updated_at = now()
where title in ('Best first move: obvious group or weird words?', 'Best guide format: route map, build card, or boss checklist?');
