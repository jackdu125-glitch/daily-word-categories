import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Crown } from "lucide-react";
import { getGuides } from "@/lib/community-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "new game AAA Guides",
  description:
    "Read new game AAA guide briefs, walkthrough notes, build tips, and premium strategy summaries.",
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
        <h1>Read the latest AAA strategy layer.</h1>
        <p>
          new game tracks major releases, studies the best guide sites, then
          turns walkthroughs, builds, maps, and boss notes into cleaner briefs.
        </p>
      </section>

      <section className={styles.feature}>
        <BookOpen size={18} aria-hidden="true" />
        <span>Today&apos;s briefing</span>
        <h2>Start with the latest release notes, key guides, and player questions.</h2>
        <Link href="/guides/today">Open today&apos;s AAA brief</Link>
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
