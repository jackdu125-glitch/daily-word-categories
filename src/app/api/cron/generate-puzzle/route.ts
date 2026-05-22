import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ProxyAgent, setGlobalDispatcher } from "undici";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase-server";

const generatedPuzzleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  categories: z
    .array(
      z.object({
        name: z.string().min(2).max(48),
        difficulty: z.enum(["easy", "medium", "hard", "tricky"]),
        words: z.array(z.string().min(2).max(18)).length(4),
      }),
    )
    .length(4),
});

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function targetDate() {
  return new Date().toISOString().slice(0, 10);
}

function configureProxy() {
  const proxy =
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY ||
    process.env.https_proxy ||
    process.env.http_proxy;

  if (proxy) {
    setGlobalDispatcher(new ProxyAgent(proxy));
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServiceClient();
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!supabase || !apiKey) {
    return NextResponse.json(
      {
        error: "Missing server configuration",
        required: [
          "NEXT_PUBLIC_SUPABASE_URL",
          "SUPABASE_SERVICE_ROLE_KEY",
          "DEEPSEEK_API_KEY",
        ],
      },
      { status: 500 },
    );
  }

  const date = targetDate();
  configureProxy();
  const client = new OpenAI({
    apiKey,
    baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
  });

  let raw: string;

  try {
    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "Create one NYT Connections-style word category puzzle. Return only valid JSON. Use common English words, no proper nouns, no slurs, no adult content, and avoid obscure trivia.",
        },
        {
          role: "user",
          content: `Create the puzzle for ${date}. Return JSON with this exact shape: {"date":"YYYY-MM-DD","categories":[{"name":"Theme","difficulty":"easy|medium|hard|tricky","words":["WORD","WORD","WORD","WORD"]}]}. It must have exactly 4 categories with exactly 4 uppercase English words each. Make the four category themes distinct and fair, with one tricky category.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
    });

    raw = response.choices[0]?.message?.content ?? "";
  } catch (error) {
    const message = error instanceof Error ? error.message : "DeepSeek request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const parsed = generatedPuzzleSchema.parse(JSON.parse(raw));
  const words = parsed.categories.flatMap((category) =>
    category.words.map((word) => word.toUpperCase()),
  );

  if (new Set(words).size !== 16) {
    return NextResponse.json(
      { error: "Generated puzzle contains duplicate words" },
      { status: 422 },
    );
  }

  const { error } = await supabase.from("puzzles").upsert(
    {
      date: parsed.date,
      words,
      categories: parsed.categories.map((category) => ({
        ...category,
        words: category.words.map((word) => word.toUpperCase()),
      })),
    },
    { onConflict: "date" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, date: parsed.date, words: words.length });
}
