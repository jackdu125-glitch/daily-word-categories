# Membership Guides Forum Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-phase paid membership, premium guide, and light forum layer to the Daily Word Categories site.

**Architecture:** Keep the current Next.js App Router structure. Use Supabase tables and RLS for durable data, client-side Supabase auth for user identity, and a server route for Stripe Checkout creation. Seed guide and forum data locally so pages are useful before production content automation is added.

**Tech Stack:** Next.js 16, React 19, Supabase Auth/Postgres/RLS, Stripe Checkout REST API, CSS Modules.

---

## File Map

- Create `supabase/migrations/202605270001_membership_guides_forum.sql`: profiles, memberships, guides, forum tables, indexes, RLS policies, seed content.
- Modify `src/lib/supabase-browser.ts`: add table types for new client-facing tables.
- Create `src/lib/community-data.ts`: server-side data helpers for guides, membership summaries, and forum posts.
- Create `src/app/membership/page.tsx` and `src/app/membership/page.module.css`: public membership sales page.
- Create `src/app/guides/page.tsx` and `src/app/guides/page.module.css`: guide index.
- Create `src/app/guides/today/page.tsx` and `src/app/guides/today/page.module.css`: today's guide with premium gate.
- Create `src/app/forum/page.tsx`, `src/app/forum/forum-client.tsx`, and `src/app/forum/page.module.css`: forum list and composer.
- Create `src/app/forum/[id]/page.tsx` and `src/app/forum/[id]/page.module.css`: thread detail.
- Create `src/app/api/membership/checkout/route.ts`: Stripe Checkout Session route.
- Modify `src/app/page.tsx` and `src/app/page.module.css`: add entries for Guides, Forum, Membership.
- Modify `src/app/layout.tsx`, `src/app/sitemap.ts`: add SEO metadata and routes.

## Task 1: Database Schema

- [ ] Add migration with core tables and RLS.
- [ ] Include seed guide article for today's fallback content.
- [ ] Include seed forum posts so the forum does not launch empty.
- [ ] Verify SQL is idempotent with `create table if not exists` and `drop policy if exists`.

## Task 2: Data Helpers

- [ ] Add typed fallback content in `src/lib/community-data.ts`.
- [ ] Fetch published guide articles through Supabase anon client.
- [ ] Fetch forum post list and thread detail through Supabase anon client.
- [ ] Return fallback content when Supabase is not configured or query fails.

## Task 3: Membership Page

- [ ] Build `/membership` with Pro Member benefits, price, and checkout CTA.
- [ ] Implement checkout button as a client component that calls `/api/membership/checkout`.
- [ ] Show a clear "billing setup required" message if Stripe env vars are missing.

## Task 4: Premium Guide Pages

- [ ] Build `/guides` as SEO-friendly guide index.
- [ ] Build `/guides/today` with free preview and member-only premium section.
- [ ] Link guide pages back to today's puzzle and membership page.

## Task 5: Light Forum

- [ ] Build `/forum` with category filters, post list, and composer.
- [ ] Allow authenticated users to submit a basic post through Supabase.
- [ ] Show sign-in CTA for logged-out users.
- [ ] Build `/forum/[id]` thread detail with comments display and premium CTA.

## Task 6: Stripe Checkout Route

- [ ] Implement `POST /api/membership/checkout`.
- [ ] Validate authenticated Supabase user from bearer token.
- [ ] Create Stripe Checkout Session using `mode=subscription`.
- [ ] Return `{ url }` on success.
- [ ] Return actionable JSON errors when Stripe env vars are missing.

## Task 7: Homepage and SEO Integration

- [ ] Add homepage entry cards for Guides, Forum, and Pro Member.
- [ ] Keep the main game above the fold and avoid turning the homepage into a marketing page.
- [ ] Add `/membership`, `/guides`, `/guides/today`, and `/forum` to sitemap.
- [ ] Update metadata to include guides/forum positioning.

## Task 8: Verification

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Open local homepage, membership, guides, and forum pages in browser.
- [ ] Verify mobile layout does not overflow.
- [ ] Commit and push when checks pass.
