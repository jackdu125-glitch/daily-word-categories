import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { getForumPosts } from "@/lib/community-data";
import { ForumClient } from "./forum-client";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Daily Word Categories Forum",
  description:
    "Discuss Daily Word Categories strategy, puzzle feedback, and daily solving notes.",
};

export default async function ForumPage() {
  const posts = await getForumPosts();

  return (
    <main className={styles.shell}>
      <section className={styles.header}>
        <nav>
          <Link href="/">Play today</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/membership">Pro</Link>
        </nav>
        <div className={styles.mark}>
          <MessageSquare size={22} aria-hidden="true" />
        </div>
        <h1>Small forum. Better solving notes.</h1>
        <p>
          Keep the discussion focused: today&apos;s puzzle, strategy habits,
          product feedback, and future game ideas.
        </p>
      </section>

      <ForumClient initialPosts={posts} />
    </main>
  );
}
