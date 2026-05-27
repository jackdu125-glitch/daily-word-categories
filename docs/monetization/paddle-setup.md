# Paddle Membership Setup

This site uses Paddle for the first monetization path: `new game Pro` at `$3.99 / month`.

## Dashboard Setup

1. Open Paddle.
2. Create a product named `new game Pro`.
3. Create a recurring monthly price for `$3.99`.
4. Copy the price ID. It should look like `pri_...`.
5. Go to Developer tools > Authentication.
6. Create a server-side API key.
7. Give it permission to create transactions.
8. In Checkout settings, set the default payment link/domain to `https://www.jackdu2.me/membership`.
9. Start in sandbox first. Move to live only after checkout and domain approval are complete.

## Environment Variables

Local `.env.local`:

```text
NEXT_PUBLIC_SITE_URL=https://www.jackdu2.me
PADDLE_ENVIRONMENT=sandbox
PADDLE_API_KEY=replace_with_paddle_api_key
PADDLE_PRICE_ID=replace_with_paddle_price_id
```

Vercel Production:

```text
NEXT_PUBLIC_SITE_URL=https://www.jackdu2.me
PADDLE_ENVIRONMENT=live
PADDLE_API_KEY=replace_with_live_paddle_api_key
PADDLE_PRICE_ID=replace_with_live_paddle_price_id
```

## Test Flow

1. Sign in at `/login`.
2. Open `/membership`.
3. Click `Start Pro membership`.
4. The site calls `/api/membership/checkout`.
5. Paddle creates a transaction and returns a checkout URL.
6. The browser redirects to Paddle Checkout.

## Notes

- The API key must stay server-side. Never expose it in React components.
- The current route stores the Supabase user ID and email in Paddle `custom_data`.
- Webhook-based membership activation is the next step after the checkout link works.
