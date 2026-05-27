import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Crown } from "lucide-react";
import { getGuides } from "@/lib/community-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Daily Word Categories Guides",
  description:
    "Read Daily Word Categories strategy guides, solving hints, and premium walkthrough previews.",
};

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <main className={styles.shell}>
      <section className={styles.header}>
        <nav>
          <Link href="/">Play today</Link>
          <Link href="/membership">Pro</Link>
          <Link href="/forum">Forum</Link>
        </nav>
        <h1>Strategy guides for sharper solvers.</h1>
        <p>
          Daily hints, category logic, and premium walkthroughs built around the
          puzzle people are already playing.
        </p>
      </section>

      <section className={styles.feature}>
        <BookOpen size={18} aria-hidden="true" />
        <span>Today&apos;s guide</span>
        <h2>Read the current board like a stronger player.</h2>
        <Link href="/guides/today">Open today&apos;s walkthrough</Link>
      </section>

      <section className={styles.list} aria-label="Guide archive">
        {guides.map((guide) => (
          <Link className={styles.item} href={`/guides/${guide.slug}`} key={guide.id}>
            <div>
              <span>{guide.puzzle_date ?? "Strategy"}</span>
              <h2>{guide.title}</h2>
              <p>{guide.excerpt}</p>
            </div>
            <Crown size={18} aria-hidden="true" />
          </Link>
        ))}
      </section>
    </main>
  );
}
