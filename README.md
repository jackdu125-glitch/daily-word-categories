# Daily Word Categories

A mobile-first daily word category game inspired by the quiet structure of NYT Connections, styled as the selected Midnight Puzzle Cards concept.

## Local Development

```powershell
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and fill:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL`
- `DEEPSEEK_MODEL`
- `CRON_SECRET`

The app works with a fallback puzzle when Supabase variables are missing. The daily generator route requires Supabase service role access and `DEEPSEEK_API_KEY`.

## Database

Apply the migration in `supabase/migrations/202605220001_daily_word_categories.sql`.

Tables:

- `puzzles`: one row per date, with 16 words and 4 category definitions.
- `userprogress`: one row per authenticated user per solved puzzle date.

RLS:

- Anyone can read puzzles.
- Authenticated users can read, insert, and update only their own progress.

## Cron

`vercel.json` schedules `/api/cron/generate-puzzle` at `0 22 * * *`, which is 06:00 Asia/Shanghai.
