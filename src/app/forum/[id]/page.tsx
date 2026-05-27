import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crown } from "lucide-react";
import { getForumComments, getForumPost } from "@/lib/community-data";
import styles from "./page.module.css";

type ForumThreadProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ForumThreadProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getForumPost(id);

  return {
    title: post ? post.title : "Forum Thread",
    description: post?.body ?? "Daily Word Categories forum thread.",
  };
}

export default async function ForumThreadPage({ params }: ForumThreadProps) {
  const { id } = await params;
  const post = await getForumPost(id);

  if (!post) {
    notFound();
  }

  const comments = await getForumComments(post.id);

  return (
    <main className={styles.shell}>
      <article className={styles.card}>
        <nav className={styles.nav}>
          <Link href="/forum">Forum</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/membership">Pro</Link>
        </nav>

        <span className={styles.category}>{post.category}</span>
        <h1>{post.title}</h1>
        <p className={styles.body}>{post.body}</p>

        <section className={styles.memberBox}>
          <Crown size={18} aria-hidden="true" />
          <div>
            <h2>Member angle</h2>
            <p>
              Pro members get deeper walkthroughs for the same puzzle, then use
              discussion threads to compare solving habits.
            </p>
          </div>
        </section>

        <section className={styles.comments}>
          <h2>Comments</h2>
          {comments.length ? (
            comments.map((comment) => (
              <article className={styles.comment} key={comment.id}>
                <p>{comment.body}</p>
              </article>
            ))
          ) : (
            <p className={styles.empty}>No comments yet. Start from the forum list.</p>
          )}
        </section>
      </article>
    </main>
  );
}
