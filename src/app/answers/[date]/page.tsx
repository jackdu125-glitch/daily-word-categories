import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPuzzleDate } from "@/lib/puzzle";
import { getPuzzleByDate, getRecentPuzzles } from "@/lib/puzzles-data";
import { AnswerGate } from "./answer-gate";
import styles from "./page.module.css";

type AnswerPageProps = {
  params: Promise<{
    date: string;
  }>;
};

export async function generateStaticParams() {
  const puzzles = await getRecentPuzzles(30);
  return puzzles.map((puzzle) => ({ date: puzzle.date }));
}

export async function generateMetadata({
  params,
}: AnswerPageProps): Promise<Metadata> {
  const { date } = await params;
  const label = formatPuzzleDate(date);

  return {
    title: `Daily Word Categories Answers for ${label}`,
    description: `See the Daily Word Categories answers and category groups for ${label}.`,
  };
}

export default async function AnswerPage({ params }: AnswerPageProps) {
  const { date } = await params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
  }

  const puzzle = await getPuzzleByDate(date);

  if (!puzzle) {
    notFound();
  }

  return (
    <main className={styles.shell}>
      <article className={styles.card}>
        <nav className={styles.links} aria-label="Answer navigation">
          <Link href="/">Play today</Link>
          <Link href="/archive">Archive</Link>
        </nav>

        <p className={styles.kicker}>Daily answers</p>
        <h1>{formatPuzzleDate(puzzle.date)}</h1>
        <p className={styles.intro}>
          Full answers unlock after you solve two groups in the puzzle.
        </p>

        <AnswerGate puzzle={puzzle} />
      </article>
    </main>
  );
}
