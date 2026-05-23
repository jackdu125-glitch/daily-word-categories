"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ANSWER_UNLOCK_SOLVED_COUNT,
  canViewAnswers,
  getProgressStorageKey,
  type Puzzle,
  type SolvedGroup,
} from "@/lib/puzzle";
import styles from "./page.module.css";

type StoredProgress = {
  solved?: SolvedGroup[];
};

type AnswerGateProps = {
  puzzle: Puzzle;
};

export function AnswerGate({ puzzle }: AnswerGateProps) {
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    let saved: string | null = null;

    try {
      saved = window.localStorage.getItem(getProgressStorageKey(puzzle.date));
    } catch {
      queueMicrotask(() => setSolvedCount(0));
      return;
    }

    if (saved) {
      try {
        const progress = JSON.parse(saved) as StoredProgress;
        queueMicrotask(() => setSolvedCount(progress.solved?.length ?? 0));
      } catch {
        queueMicrotask(() => setSolvedCount(0));
      }
    } else {
      queueMicrotask(() => setSolvedCount(0));
    }
  }, [puzzle.date]);

  if (!canViewAnswers(solvedCount)) {
    return (
      <div className={styles.lockedPanel}>
        <span>Answers locked</span>
        <h2>Solve 2 groups before viewing all answers.</h2>
        <p>
          You have solved {solvedCount} of {ANSWER_UNLOCK_SOLVED_COUNT} required
          {" "}groups for this puzzle. Return to today&apos;s game, solve two
          groups, then come back to reveal the full answer list.
        </p>
        <Link href="/">Return to puzzle</Link>
      </div>
    );
  }

  return (
    <div className={styles.groups}>
      {puzzle.categories.map((category) => (
        <section className={styles.group} key={category.name}>
          <span>{category.difficulty}</span>
          <h2>{category.name}</h2>
          <p>{category.words.join(", ")}</p>
        </section>
      ))}
    </div>
  );
}
