import { createClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      userprogress: {
        Row: {
          userid: string;
          puzzledate: string;
          solvedat: string;
        };
        Insert: {
          userid: string;
          puzzledate: string;
          solvedat?: string;
        };
        Update: {
          userid?: string;
          puzzledate?: string;
          solvedat?: string;
        };
        Relationships: [];
      };
      forum_posts: {
        Row: {
          id: string;
          userid: string | null;
          title: string;
          body: string;
          category: "Announcements" | "General" | "Guides" | "Fan-Art" | "Bug Report";
          is_official: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          userid?: string | null;
          title: string;
          body: string;
          category?: "Announcements" | "General" | "Guides" | "Fan-Art" | "Bug Report";
          is_official?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          body?: string;
          category?: "Announcements" | "General" | "Guides" | "Fan-Art" | "Bug Report";
          updated_at?: string;
        };
        Relationships: [];
      };
      forum_comments: {
        Row: {
          id: string;
          post_id: string;
          userid: string | null;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          userid?: string | null;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      memberships: {
        Row: {
          userid: string;
          status: "free" | "trialing" | "active" | "past_due" | "canceled";
          provider: string | null;
          provider_customer_id: string | null;
          provider_subscription_id: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          userid: string;
          status?: "free" | "trialing" | "active" | "past_due" | "canceled";
          provider?: string | null;
          provider_customer_id?: string | null;
          provider_subscription_id?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "free" | "trialing" | "active" | "past_due" | "canceled";
          provider?: string | null;
          provider_customer_id?: string | null;
          provider_subscription_id?: string | null;
          current_period_end?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type SupabaseBrowserClient = ReturnType<typeof createClient<Database>>;

let browserClient: SupabaseBrowserClient | null = null;

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}
