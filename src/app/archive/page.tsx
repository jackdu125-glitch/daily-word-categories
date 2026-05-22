import type { Metadata } from "next";
import Link from "next/link";
import { formatPuzzleDate } from "@/lib/puzzle";
import { getRecentPuzzles } from "@/lib/puzzles-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Daily Word Categories Archive",
  description:
    "Browse previous Daily Word Categories puzzles and answer pages by date.",
};

export default async function ArchivePage() {
  const puzzles = await getRecentPuzzles(60);

  return (
    <main className={styles.shell}>
      <section className={styles.header}>
        <Link href="/">Play today</Link>
        <h1>Puzzle Archive</h1>
        <p>Previous Daily Word Categories puzzles and answers.</p>
      </section>

      <section className={styles.list} aria-label="Puzzle archive">
        {puzzles.map((puzzle) => (
          <Link className={styles.item} href={`/answers/${puzzle.date}`} key={puzzle.date}>
            <span>{formatPuzzleDate(puzzle.date)}</span>
            <strong>View answers</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
