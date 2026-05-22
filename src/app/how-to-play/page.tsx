import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "How to Play Daily Word Categories",
  description:
    "Learn the rules for Daily Word Categories, a daily word grouping puzzle with 16 words and 4 hidden categories.",
};

export default function HowToPlayPage() {
  return (
    <main className={styles.shell}>
      <article className={styles.card}>
        <Link className={styles.backLink} href="/">
          Play today&apos;s puzzle
        </Link>
        <h1>How to Play Daily Word Categories</h1>
        <p>
          Daily Word Categories is a short daily word puzzle. You get 16 words,
          and your goal is to find four hidden groups of four.
        </p>

        <section>
          <h2>Rules</h2>
          <ol>
            <li>Select exactly four words that belong together.</li>
            <li>Submit your guess.</li>
            <li>A correct group locks in and reveals its category.</li>
            <li>An incorrect group costs one mistake.</li>
            <li>Solve all four groups before you run out of mistakes.</li>
            <li>
              The full answer page unlocks only after you solve at least two
              groups for that day.
            </li>
          </ol>
        </section>

        <section className={styles.notice}>
          <h2>Answer access</h2>
          <p>
            Today&apos;s answers are locked at first. To keep the daily puzzle
            fair, solve two correct groups before opening the full answer list.
            Older answer pages use the same local progress rule for each date.
          </p>
        </section>

        <section>
          <h2>Tips</h2>
          <p>
            Start with the most obvious theme, then look for words with double
            meanings. The final group is often the trickiest because every
            leftover word must fit somewhere.
          </p>
        </section>
      </article>
    </main>
  );
}
