"use client";

import { ArrowLeft, LogOut, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      queueMicrotask(() => {
        setStatus("Supabase is not configured yet.");
      });
      return;
    }

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

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Sending sign-in link...");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("Supabase is not configured yet.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    setStatus(error ? error.message : "Check your email for the sign-in link.");
  }

  async function signInWithGoogle() {
    setStatus("Opening Google sign-in...");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("Supabase is not configured yet.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setStatus(`${error.message}. Enable Google in Supabase Auth providers.`);
    }
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    setUser(null);
    setStatus("Signed out.");
  }

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <Link className={styles.backLink} href="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to puzzle
        </Link>

        <div className={styles.header}>
          <div className={styles.iconMark}>
            <UserRound size={22} aria-hidden="true" />
          </div>
          <h1>{user ? "Your puzzle account" : "Sign in to save your streak"}</h1>
          <p>
            Save completed puzzles to your account and keep your daily word-game
            progress ready for the next session.
          </p>
        </div>

        {user ? (
          <div className={styles.accountCard}>
            <span>Signed in as</span>
            <strong>{user.email ?? "Puzzle player"}</strong>
            <button onClick={signOut} type="button">
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </div>
        ) : (
          <div className={styles.formStack}>
            <form onSubmit={sendMagicLink}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputRow}>
                <Mail size={17} aria-hidden="true" />
                <input
                  id="email"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
              <button className={styles.primaryButton} type="submit">
                Send magic link
              </button>
            </form>

            <button className={styles.oauthButton} onClick={signInWithGoogle} type="button">
              <UserRound size={17} aria-hidden="true" />
              Continue with Google
            </button>
          </div>
        )}

        {status ? <p className={styles.status}>{status}</p> : null}

        <div className={styles.footerNote}>
          Guests can still play. Signing in only adds account-based completion
          history for future retention features.
        </div>
      </section>
    </main>
  );
}
