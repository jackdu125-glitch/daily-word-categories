import { fallbackPuzzle, todayIsoDate, type Puzzle } from "@/lib/puzzle";
import { getSupabaseAnonClient } from "@/lib/supabase-server";

export type PuzzleListItem = {
  date: string;
};

export async function getTodayPuzzle() {
  return getPuzzleByDate(todayIsoDate());
}

export async function getPuzzleByDate(date: string): Promise<Puzzle | null> {
  const supabase = getSupabaseAnonClient();

  if (!supabase) {
    return date === fallbackPuzzle.date ? fallbackPuzzle : null;
  }

  const { data, error } = await supabase
    .from("puzzles")
    .select("date, words, categories")
    .eq("date", date)
    .maybeSingle<Puzzle>();

  if (error || !data) {
    return date === fallbackPuzzle.date ? fallbackPuzzle : null;
  }

  return data;
}

export async function getRecentPuzzles(limit = 30): Promise<PuzzleListItem[]> {
  const supabase = getSupabaseAnonClient();

  if (!supabase) {
    return [{ date: fallbackPuzzle.date }];
  }

  const { data, error } = await supabase
    .from("puzzles")
    .select("date")
    .order("date", { ascending: false })
    .limit(limit)
    .returns<PuzzleListItem[]>();

  if (error || !data?.length) {
    return [{ date: fallbackPuzzle.date }];
  }

  return data;
}
