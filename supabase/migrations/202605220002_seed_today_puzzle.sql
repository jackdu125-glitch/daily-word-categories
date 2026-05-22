insert into public.puzzles (date, words, categories)
values (
  current_date,
  '["BASIL","THYME","SAGE","DILL","MERCURY","VENUS","MARS","SATURN","BOW","ARROW","QUIVER","TARGET","RIVER","DELTA","BANK","CURRENT"]'::jsonb,
  '[
    {"name":"Herbs","words":["BASIL","THYME","SAGE","DILL"],"difficulty":"easy"},
    {"name":"Planets","words":["MERCURY","VENUS","MARS","SATURN"],"difficulty":"medium"},
    {"name":"Archery words","words":["BOW","ARROW","QUIVER","TARGET"],"difficulty":"hard"},
    {"name":"River terms","words":["RIVER","DELTA","BANK","CURRENT"],"difficulty":"tricky"}
  ]'::jsonb
)
on conflict (date) do update set
  words = excluded.words,
  categories = excluded.categories,
  updated_at = now();
