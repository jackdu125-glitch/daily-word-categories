"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { ForumPost } from "@/lib/community-data";
import styles from "./page.module.css";

const categories = ["All", "Today Puzzle", "Strategy", "Feedback", "General"] as const;

type ForumClientProps = {
  initialPosts: ForumPost[];
};

export function ForumClient({ initialPosts }: ForumClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [signedIn, setSignedIn] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session?.user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  const visiblePosts = useMemo(
    () => posts.filter((post) => category === "All" || post.category === category),
    [category, posts],
  );

  async function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Publishing...");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) {
      setStatus("Sign in before posting.");
      return;
    }

    const { data: inserted, error } = await supabase
      .from("forum_posts")
      .insert({
        userid: user.id,
        title,
        body,
        category: category === "All" ? "Today Puzzle" : category,
      })
      .select("id, title, body, category, is_official, created_at")
      .single();

    if (error || !inserted) {
      setStatus(error?.message ?? "Post failed.");
      return;
    }

    setPosts((current) => [inserted, ...current]);
    setTitle("");
    setBody("");
    setStatus("Posted.");
  }

  return (
    <>
      <section className={styles.filters} aria-label="Forum categories">
        {categories.map((item) => (
          <button
            className={item === category ? styles.filterActive : styles.filter}
            key={item}
            onClick={() => setCategory(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </section>

      <section className={styles.composer}>
        {signedIn ? (
          <form onSubmit={submitPost}>
            <div>
              <label htmlFor="forum-title">Title</label>
              <input
                id="forum-title"
                minLength={4}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="What did you notice today?"
                required
                value={title}
              />
            </div>
            <div>
              <label htmlFor="forum-body">Post</label>
              <textarea
                id="forum-body"
                minLength={12}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Share a strategy, question, or feedback note."
                required
                rows={4}
                value={body}
              />
            </div>
            <button type="submit">
              <MessageSquarePlus size={16} aria-hidden="true" />
              Publish post
            </button>
            {status ? <p>{status}</p> : null}
          </form>
        ) : (
          <div className={styles.signInPrompt}>
            <h2>Sign in to post.</h2>
            <p>Readers can browse freely. Members and signed-in players can start discussions.</p>
            <Link href="/login">Sign in</Link>
          </div>
        )}
      </section>

      <section className={styles.posts} aria-label="Forum posts">
        {visiblePosts.map((post) => (
          <Link className={styles.post} href={`/forum/${post.id}`} key={post.id}>
            <div>
              <span>{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </div>
            {post.is_official ? <strong>Official</strong> : null}
          </Link>
        ))}
      </section>
    </>
  );
}
