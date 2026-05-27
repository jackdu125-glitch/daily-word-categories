import type { Metadata } from "next";
import Link from "next/link";
import { Crown, LockKeyhole, Play } from "lucide-react";
import { getTodayGuide } from "@/lib/community-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Today's Daily Word Categories Guide",
  description:
    "Read today's Daily Word Categories strategy preview and unlock the full premium walkthrough.",
};

export default async function TodayGuidePage() {
  const guide = await getTodayGuide();

  return (
    <main className={styles.shell}>
      <article className={styles.card}>
        <nav className={styles.nav}>
          <Link href="/">Play today</Link>
          <Link href="/guides">All guides</Link>
          <Link href="/membership">Pro</Link>
        </nav>

        <p className={styles.kicker}>Today&apos;s walkthrough</p>
        <h1>{guide.title}</h1>
        <p className={styles.intro}>{guide.excerpt}</p>

        <section className={styles.preview}>
          <Play size={18} aria-hidden="true" />
          <span>Free preview</span>
          <p>{guide.free_body}</p>
        </section>

        <section className={styles.premium}>
          <LockKeyhole size={18} aria-hidden="true" />
          <span>Pro section</span>
          <h2>Unlock the complete category-by-category explanation.</h2>
          <p>
            Pro members get the full solve path, trap notes, final category
            logic, and archive walkthrough access.
          </p>
          <Link href="/membership">
            <Crown size={16} aria-hidden="true" />
            Join Pro
          </Link>
        </section>
      </article>
    </main>
  );
}
