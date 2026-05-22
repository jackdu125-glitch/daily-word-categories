import { NextResponse } from "next/server";
import { fallbackPuzzle, type Puzzle } from "@/lib/puzzle";
import { getSupabaseAnonClient } from "@/lib/supabase-server";

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const supabase = getSupabaseAnonClient();

  if (!supabase) {
    return NextResponse.json({ puzzle: fallbackPuzzle, source: "fallback" });
  }

  const { data, error } = await supabase
    .from("puzzles")
    .select("date, words, categories")
    .eq("date", today)
    .maybeSingle<Puzzle>();

  if (error || !data) {
    return NextResponse.json({ puzzle: fallbackPuzzle, source: "fallback" });
  }

  return NextResponse.json({ puzzle: data, source: "supabase" });
}
