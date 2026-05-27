import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const paddleApiKey = process.env.PADDLE_API_KEY;
  const paddlePriceId = process.env.PADDLE_PRICE_ID;
  const paddleEnvironment = process.env.PADDLE_ENVIRONMENT ?? "live";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jackdu2.me";
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  if (!token) {
    return NextResponse.json({ error: "Sign in before starting checkout." }, { status: 401 });
  }

  if (!paddleApiKey || !paddlePriceId) {
    return NextResponse.json(
      { error: "Paddle billing is not configured yet. Add PADDLE_API_KEY and PADDLE_PRICE_ID." },
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

  const paddleBaseUrl =
    paddleEnvironment === "sandbox"
      ? "https://sandbox-api.paddle.com"
      : "https://api.paddle.com";

  const paddleResponse = await fetch(`${paddleBaseUrl}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paddleApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          price_id: paddlePriceId,
          quantity: 1,
        },
      ],
      custom_data: {
        userid: data.user.id,
        user_email: data.user.email ?? null,
        product: "new-game-pro",
      },
      checkout: {
        url: `${siteUrl}/membership?checkout=return`,
      },
    }),
  });
  const payload = (await paddleResponse.json()) as {
    data?: { checkout?: { url?: string | null } };
    error?: { detail?: string; message?: string };
  };

  if (!paddleResponse.ok || !payload.data?.checkout?.url) {
    return NextResponse.json(
      { error: payload.error?.detail ?? payload.error?.message ?? "Paddle checkout failed." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: payload.data.checkout.url });
}
