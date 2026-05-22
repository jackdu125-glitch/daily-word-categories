# Daily Word Categories Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first complete single-game version: polished play flow, local progress/share, rules page, archive, answer pages, and sitemap updates.

**Architecture:** Keep the current Next.js App Router structure. Move reusable puzzle data access into a small server utility, keep the interactive game in the existing client page, and add focused server-rendered SEO pages.

**Tech Stack:** Next.js 16 App Router, React 19, CSS Modules, Supabase JS, TypeScript.

---

## File Structure

- Modify `src/lib/puzzle.ts`: add puzzle helpers for dates, share text, local progress keys, solved-word filtering, and puzzle display formatting.
- Create `src/lib/puzzles-data.ts`: server-only Supabase access for today's puzzle, puzzle by date, and recent puzzle list.
- Modify `src/app/api/puzzle/route.ts`: use the shared data helper.
- Modify `src/app/page.tsx`: add local progress, mistakes limit, completion state, deselect, share, and better failure handling.
- Modify `src/app/page.module.css`: style new controls, completion panel, and failed state.
- Create `src/app/how-to-play/page.tsx` and `src/app/how-to-play/page.module.css`: rules page.
- Create `src/app/archive/page.tsx` and `src/app/archive/page.module.css`: recent puzzle list.
- Create `src/app/answers/[date]/page.tsx` and `src/app/answers/[date]/page.module.css`: answer page.
- Modify `src/app/sitemap.ts`: include static routes and recent answer pages.

## Tasks

### Task 1: Shared Puzzle Data And Helpers

**Files:**
- Modify: `src/lib/puzzle.ts`
- Create: `src/lib/puzzles-data.ts`
- Modify: `src/app/api/puzzle/route.ts`

- [ ] Add helper functions in `src/lib/puzzle.ts`:
  - `todayIsoDate()`
  - `formatPuzzleDate(date)`
  - `getProgressStorageKey(date)`
  - `getSolvedWords(solved)`
  - `createShareText(puzzle, mistakesUsed, completed)`

- [ ] Create `src/lib/puzzles-data.ts` with:
  - `getTodayPuzzle()`
  - `getPuzzleByDate(date)`
  - `getRecentPuzzles(limit)`

- [ ] Update `/api/puzzle` to call `getTodayPuzzle()`.

- [ ] Run `npm run build`.

### Task 2: Complete Game Flow

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.module.css`

- [ ] Add local progress type and restore progress by puzzle date from `localStorage`.
- [ ] Save progress after solved groups, mistakes, and completion change.
- [ ] Add `Deselect All`.
- [ ] Rename reset flow to a non-destructive board reset that preserves solved progress only when appropriate.
- [ ] Add failed state when mistakes reach 0.
- [ ] Add completion panel with `Share`.
- [ ] Implement share through `navigator.share`, with clipboard fallback.
- [ ] Run `npm run build`.

### Task 3: SEO Pages

**Files:**
- Create: `src/app/how-to-play/page.tsx`
- Create: `src/app/how-to-play/page.module.css`
- Create: `src/app/archive/page.tsx`
- Create: `src/app/archive/page.module.css`
- Create: `src/app/answers/[date]/page.tsx`
- Create: `src/app/answers/[date]/page.module.css`

- [ ] Build `/how-to-play` with concise rules and links back to the game.
- [ ] Build `/archive` from recent Supabase puzzles, with graceful fallback.
- [ ] Build `/answers/[date]` with puzzle answers or `notFound()`.
- [ ] Add route-level metadata for SEO titles/descriptions.
- [ ] Run `npm run build`.

### Task 4: Sitemap And Final Verification

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] Include `/`, `/how-to-play`, `/archive`.
- [ ] Include recent `/answers/[date]` pages from Supabase.
- [ ] Keep static sitemap entries if Supabase is unavailable.
- [ ] Run `npm run build`.
- [ ] Use browser checks for mobile and desktop home page.
- [ ] Commit, push, and deploy.

## Self-Review

- Spec coverage: game polish, local progress, share, SEO pages, answer pages, archive, sitemap, and error handling are covered.
- Placeholder scan: no TBD or TODO placeholders are present.
- Type consistency: all helper names are defined before use in later tasks.
