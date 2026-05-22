import { NextResponse } from "next/server";
import { fallbackPuzzle } from "@/lib/puzzle";
import { getTodayPuzzle } from "@/lib/puzzles-data";

export async function GET() {
  const puzzle = await getTodayPuzzle();

  if (!puzzle) {
    return NextResponse.json({ puzzle: fallbackPuzzle, source: "fallback" });
  }

  return NextResponse.json({ puzzle, source: "supabase" });
}
