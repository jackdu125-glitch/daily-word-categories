import { getSupabaseAnonClient } from "@/lib/supabase-server";

export type GuideArticle = {
  id: string;
  slug: string;
  puzzle_date: string | null;
  title: string;
  excerpt: string;
  free_body: string;
  created_at: string;
};

export type ForumPost = {
  id: string;
  title: string;
  body: string;
  category: "Today Puzzle" | "Strategy" | "Feedback" | "General";
  is_official: boolean;
  created_at: string;
};

export type ForumComment = {
  id: string;
  post_id: string;
  body: string;
  created_at: string;
};

const fallbackGuide: GuideArticle = {
  id: "fallback-today-guide",
  slug: "today",
  puzzle_date: new Date().toISOString().slice(0, 10),
  title: "Today's Daily Word Categories Strategy",
  excerpt:
    "Start with obvious semantic clusters, then save flexible words for the final two groups.",
  free_body:
    "Scan the board for the cleanest group first. Avoid early guesses that rely on vague word associations. The best opening move is usually the set where all four words share the same concrete category.",
  created_at: new Date().toISOString(),
};

const fallbackPosts: ForumPost[] = [
  {
    id: "today-discussion",
    title: "How did today's board feel?",
    body: "Share the group that made the puzzle click for you. Mark full spoilers clearly.",
    category: "Today Puzzle",
    is_official: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "first-move",
    title: "Best first move: obvious group or weird words?",
    body: "Some players clear the easy set first. Others isolate suspicious words. Which habit works better?",
    category: "Strategy",
    is_official: true,
    created_at: new Date().toISOString(),
  },
];

export async function getGuides() {
  const supabase = getSupabaseAnonClient();

  if (!supabase) {
    return [fallbackGuide];
  }

  const { data, error } = await supabase
    .from("guide_articles")
    .select("id, slug, puzzle_date, title, excerpt, free_body, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error || !data?.length) {
    return [fallbackGuide];
  }

  return data as GuideArticle[];
}

export async function getTodayGuide() {
  const supabase = getSupabaseAnonClient();

  if (!supabase) {
    return fallbackGuide;
  }

  const { data, error } = await supabase
    .from("guide_articles")
    .select("id, slug, puzzle_date, title, excerpt, free_body, created_at")
    .eq("slug", "today")
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return fallbackGuide;
  }

  return data as GuideArticle;
}

export async function getForumPosts() {
  const supabase = getSupabaseAnonClient();

  if (!supabase) {
    return fallbackPosts;
  }

  const { data, error } = await supabase
    .from("forum_posts")
    .select("id, title, body, category, is_official, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data?.length) {
    return fallbackPosts;
  }

  return data as ForumPost[];
}

export async function getForumPost(id: string) {
  const posts = await getForumPosts();
  return posts.find((post) => post.id === id) ?? null;
}

export async function getForumComments(postId: string) {
  const supabase = getSupabaseAnonClient();

  if (!supabase) {
    return [] as ForumComment[];
  }

  const { data, error } = await supabase
    .from("forum_comments")
    .select("id, post_id, body, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error || !data) {
    return [];
  }

  return data as ForumComment[];
}
