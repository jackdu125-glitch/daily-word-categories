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
- `NEXT_PUBLIC_SITE_URL`
- `PADDLE_ENVIRONMENT`
- `PADDLE_API_KEY`
- `PADDLE_PRICE_ID`

The app works with a fallback puzzle when Supabase variables are missing. The daily generator route requires Supabase service role access and `DEEPSEEK_API_KEY`.

## Membership Revenue

The `/membership` page starts a Paddle checkout through `POST /api/membership/checkout`.

Paddle setup:

1. In Paddle, create the `new game Pro` product.
2. Create a recurring monthly price, currently shown on the site as `$3.99 / month`.
3. Copy the Paddle price ID into `PADDLE_PRICE_ID`.
4. Create a server-side API key with transaction write access and save it as `PADDLE_API_KEY`.
5. Set `PADDLE_ENVIRONMENT=sandbox` while testing, then switch to `live` after Paddle approval.
6. Set Paddle Checkout's approved/default payment link or domain to the production site.

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
