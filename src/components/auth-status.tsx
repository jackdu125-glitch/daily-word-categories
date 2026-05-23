"use client";

import { LogIn, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type AuthStatusProps = {
  className?: string;
};

export function AuthStatus({ className }: AuthStatusProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Link className={className} href="/login">
      {user ? <UserRound size={15} aria-hidden="true" /> : <LogIn size={15} aria-hidden="true" />}
      <span>{user ? "Account" : "Sign in"}</span>
    </Link>
  );
}
