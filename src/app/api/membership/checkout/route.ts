import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePriceId = process.env.STRIPE_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jackdu2.me";
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  if (!token) {
    return NextResponse.json({ error: "Sign in before starting checkout." }, { status: 401 });
  }

  if (!stripeSecretKey || !stripePriceId) {
    return NextResponse.json(
      { error: "Stripe billing is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID." },
      { status: 503 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.json({ error: "Your session expired. Sign in again." }, { status: 401 });
  }

  const body = new URLSearchParams({
    mode: "subscription",
    success_url: `${siteUrl}/membership?checkout=success`,
    cancel_url: `${siteUrl}/membership?checkout=cancelled`,
    client_reference_id: data.user.id,
    "line_items[0][price]": stripePriceId,
    "line_items[0][quantity]": "1",
    "metadata[userid]": data.user.id,
    "subscription_data[metadata][userid]": data.user.id,
  });

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const payload = (await stripeResponse.json()) as { url?: string; error?: { message?: string } };

  if (!stripeResponse.ok || !payload.url) {
    return NextResponse.json(
      { error: payload.error?.message ?? "Stripe checkout failed." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: payload.url });
}
