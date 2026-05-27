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
  category: "Announcements" | "General" | "Guides" | "Fan-Art" | "Bug Report";
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
  title: "Today's new game AAA Strategy Brief",
  excerpt:
    "Track the newest AAA release chatter, then compress guides into routes, builds, bosses, and key player questions.",
  free_body:
    "Start with the game's current patch, highest-search guide topics, and the biggest blocker players mention. A useful brief should answer what to do next, what to collect, what build works, and what mistake to avoid.",
  created_at: new Date().toISOString(),
};

const fallbackPosts: ForumPost[] = [
  {
    id: "today-discussion",
    title: "Which AAA guide should new game break down next?",
    body: "Drop the game, boss, build, quest, or collectible route you want summarized into a cleaner player brief.",
    category: "General",
    is_official: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "first-move",
    title: "Best guide format: route map, build card, or boss checklist?",
    body: "The strongest guide sites organize information differently. Which format helps you act fastest in-game?",
    category: "Guides",
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
