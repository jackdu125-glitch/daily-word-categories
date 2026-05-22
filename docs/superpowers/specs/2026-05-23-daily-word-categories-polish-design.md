# Daily Word Categories Polish Design

## Goal

Daily Word Categories should become a polished single-game site for the US market. The site should feel like a focused daily habit product: open the page, play today's puzzle, share the result, and optionally browse rules or past answers.

The first polished version combines two ideas:

- A NYT Games-style game experience: minimal, calm, daily, and easy to understand.
- An Apple homepage-style visual tone: gray background, clear typography, spacious hierarchy, and a premium but quiet feel.

This phase keeps the product scoped to one game. It does not turn the site into a multi-game hub.

## Product Scope

### In Scope

- Polish the home page game experience.
- Add a small SEO page system:
  - `/how-to-play`
  - `/archive`
  - `/answers/[date]`
- Update sitemap generation to include the new static and answer pages.
- Keep puzzle data in Supabase.
- Keep daily puzzle generation through the existing scheduled AI route.
- Store game progress, streak, and completed state locally in the browser for now.

### Out of Scope

- User accounts.
- Leaderboards.
- Paid memberships.
- Newsletter capture.
- Multiple games.
- Heavy animation.
- Automatically generated social images.
- Complex analytics dashboards.

## Visual Direction

The site should use a gray visual system rather than a black dark theme.

- Background: soft gray, with enough contrast to make the game area easy to scan.
- Cards: keep the current word-card structure and general card feeling.
- Typography: clearer and more confident, with strong readability on mobile.
- Layout: spacious and simple, closer to Apple product pages than ad-heavy game portals.
- Game controls: simple NYT-like controls, no decorative clutter.
- Category success blocks: use restrained, low-saturation colors so solved groups are clear but not loud.

The first viewport should show the product name and the active game quickly. It should not become a marketing landing page.

## Home Page Game Experience

The home page remains the main product surface.

Expected flow:

1. The player opens `/`.
2. Today's puzzle loads from Supabase.
3. The player selects four words.
4. The player submits the selection.
5. If correct, the category locks into a solved group above the grid.
6. If incorrect, mistakes remaining decreases.
7. When all four groups are solved, the page shows a completion state and share option.

Required controls:

- `Submit`
- `Shuffle`
- `Deselect All`
- `Share` after completion

Required states:

- Loading puzzle.
- Fallback puzzle if remote data is unavailable.
- Selected words.
- Not enough selected words.
- Incorrect guess.
- Solved category.
- Complete puzzle.
- Local progress restored after refresh.

## Game Rules

The puzzle has 16 English words and 4 categories. Each category contains exactly 4 words.

Interaction rules:

- A selection can contain at most 4 words.
- Submit is only active when 4 words are selected.
- Correct groups are removed from the active word grid and displayed as solved groups.
- The player has 4 mistakes.
- When mistakes reach 0, the player should see the solution state or a clear failed state.
- The game should be playable without login.

## Local Progress

Store progress in browser local storage by puzzle date.

Store:

- Solved category names.
- Solved category words.
- Mistakes used or mistakes remaining.
- Completion timestamp.
- Current streak.
- Last played date.

This is intentionally local-only for phase one. Supabase `userprogress` can remain available for a future authenticated version.

## Sharing

After completion, the site should provide a share text that is easy to paste into social apps.

Example:

```text
Daily Word Categories
May 23, 2026
Solved with 1 mistake
https://jackdu2.me
```

The wording should be short and US-user-friendly. It should not expose answer words.

## SEO Pages

### `/how-to-play`

Purpose:

- Explain the rules for new users.
- Give Google a clear page about the game.

Content:

- What Daily Word Categories is.
- How to select and submit words.
- What categories mean.
- How mistakes work.
- When a new puzzle appears.

### `/archive`

Purpose:

- Let users browse previous puzzles.
- Give search engines a crawlable list of answer pages.

Content:

- List puzzle dates from Supabase.
- Link each date to `/answers/[date]`.
- Keep layout simple and scan-friendly.

### `/answers/[date]`

Purpose:

- Show the answer for a specific daily puzzle.
- Capture search traffic for date-based answer queries.

Content:

- Date.
- The 4 category names.
- The 4 words in each category.
- Link back to today's puzzle.
- Link to archive.

The answer page can show answers directly. It should avoid spoiling today's puzzle from the home page unless the user intentionally opens the answer page.

## Sitemap And Robots

`robots.txt` should allow indexing and point to the sitemap.

`sitemap.xml` should include:

- `/`
- `/how-to-play`
- `/archive`
- Recent `/answers/[date]` pages from Supabase

If Supabase is unavailable during sitemap generation, the sitemap should still return the static routes.

## Data Flow

Home page:

1. Client requests `/api/puzzle`.
2. API reads today's puzzle from Supabase.
3. API returns fallback puzzle if Supabase is unavailable or today's row is missing.
4. Client initializes or restores local progress.

Archive page:

1. Server fetches recent puzzle dates from Supabase.
2. Page renders links to answer pages.
3. If Supabase is unavailable, page renders a graceful empty state.

Answer page:

1. Server reads puzzle by date.
2. If found, render answer.
3. If not found, show not found.

Cron route:

1. Vercel cron calls `/api/cron/generate-puzzle`.
2. Route checks `CRON_SECRET`.
3. Route calls the configured DeepSeek-compatible API.
4. Generated puzzle is validated.
5. Puzzle is upserted into Supabase.

## Error Handling

- If puzzle fetch fails, keep the fallback puzzle playable.
- If archive fetch fails, show a short empty state instead of crashing.
- If answer date does not exist, render a not-found page.
- If share API is unavailable, copy share text to clipboard where possible.
- If local storage is unavailable, the game still works for the current session.

## Testing

Manual checks:

- Mobile viewport home page.
- Desktop viewport home page.
- Select, deselect, shuffle, submit correct group.
- Submit wrong group and check mistakes.
- Complete puzzle and share text.
- Refresh after partial progress.
- `/how-to-play` loads.
- `/archive` loads.
- `/answers/[date]` loads for a known puzzle.
- `/sitemap.xml` includes static routes and answer routes.
- `npm run build` passes.

## Acceptance Criteria

- The home page feels polished, gray, readable, and mobile-first.
- The game remains immediately playable in the first viewport.
- Word cards keep their current recognizable structure.
- Correct and incorrect states are clear.
- Share text works after completion.
- The SEO pages are crawlable and visually consistent.
- Sitemap includes the new pages.
- Build passes without TypeScript or lint errors.
