# Membership Guides Forum Design

## Goal

Build Daily Word Categories into a paid membership content product with a light forum, while keeping the original daily game as the main entry point.

## Product Shape

The site stays focused on one game first. The free game remains the homepage. Around it, we add a monetization layer:

- Free visitors can play the daily puzzle, read rules, browse archive dates, and see limited answer content.
- Signed-in users can save completion progress and participate in the light forum.
- Members can read premium strategy guides, complete daily explanations, and receive a visible member status.

This is not a full Reddit-style community in phase one. It is a focused game guide community built for SEO, retention, and paid conversion.

## First-Phase Pages

- `/membership`: explains the paid plan, benefits, and checkout entry.
- `/guides`: guide index for daily strategy content.
- `/guides/today`: today's official walkthrough, with free preview and premium sections.
- `/forum`: light discussion board with topic list and post composer.
- `/forum/[id]`: individual discussion thread with comments.
- Existing `/answers/[date]`: keeps the current answer gate and adds premium positioning.

## Membership Model

Phase one supports one paid tier:

- Name: Pro Member
- Suggested public price: `$3.99 / month`
- Benefits:
  - Full daily solving walkthrough
  - Premium archive explanations
  - Member badge in forum
  - Early access positioning for future games
  - Ad-free promise, even if ads are not active yet

Stripe Checkout is the preferred billing path. The implementation will support real Stripe environment variables, but the UI must remain usable when Stripe is not configured by showing a clear setup state instead of breaking.

## Data Model

Add these Supabase tables:

- `profiles`: one row per authenticated user, with display name and role.
- `memberships`: stores membership status from payment provider or manual admin grant.
- `guide_articles`: stores official guide content by date and slug.
- `forum_posts`: stores user-created discussion posts.
- `forum_comments`: stores comments under posts.
- `forum_votes`: stores post likes.

RLS rules:

- Anyone can read published guides and forum posts.
- Only authenticated users can create forum posts and comments.
- Users can update/delete only their own forum content.
- Only members can read premium guide body fields.
- Service role can manage generated official guide content.

## Guide Content Strategy

Each daily guide has:

- Free preview: a short hook, theme hints, and one starter strategy.
- Premium body: full category-by-category explanation, clue patterns, common traps, and final answer logic.

The `/guides/today` page becomes the primary SEO and conversion page. It should link back to the game and to membership.

## Forum Strategy

The forum is intentionally small:

- Topic list with title, category, comment count, and member badge where applicable.
- Categories: `Today Puzzle`, `Strategy`, `Feedback`, `General`.
- A signed-in composer.
- A logged-out prompt to sign in.
- A member CTA where premium discussion would help.

No private messages, moderation dashboard, nested replies, notifications, or rich editor in phase one.

## Payments

Use Stripe Checkout Sessions from a server route:

- `POST /api/membership/checkout`
- Requires authenticated user.
- Requires `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID`.
- Creates a subscription Checkout Session.
- Redirects to Stripe's hosted checkout URL.

Stripe webhooks are phase two unless the keys are ready. Phase one includes a `memberships` table and UI that can represent active membership, plus a safe fallback when no membership exists.

## Design Direction

Keep the current Apple plus NYT Games gray visual system. The new membership and forum surfaces should feel like an extension of the game:

- Soft gray background
- Dark, crisp text
- White translucent panels
- 8px radius
- Dense but readable information
- No heavy social-network clutter

## Success Criteria

- A visitor can understand why membership exists.
- A signed-in player can reach forum and guide areas from the homepage.
- Premium content areas clearly show free preview versus member-only content.
- Stripe checkout route is ready for real keys without exposing secrets.
- Database migration defines the core membership and forum schema with RLS.
- The project still builds and lints cleanly.
