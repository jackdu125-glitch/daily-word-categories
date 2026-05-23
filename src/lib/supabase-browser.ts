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
