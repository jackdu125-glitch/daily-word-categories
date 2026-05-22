"use client";

import { RotateCcw, Send, Shuffle, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  categoryForSelection,
  fallbackPuzzle,
  shuffleWords,
  type Category,
  type Puzzle,
} from "@/lib/puzzle";
import styles from "./page.module.css";

type SolvedGroup = Category & {
  order: number;
};

type GroupColorStyle = React.CSSProperties & {
  "--group-color": string;
};

const difficultyTone: Record<Category["difficulty"], string> = {
  easy: "var(--group-one)",
  medium: "var(--group-two)",
  hard: "var(--group-three)",
  tricky: "var(--group-four)",
};

export default function Home() {
  const [puzzle, setPuzzle] = useState<Puzzle>(fallbackPuzzle);
  const [words, setWords] = useState(() => shuffleWords(fallbackPuzzle.words));
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState<SolvedGroup[]>([]);
  const [mistakes, setMistakes] = useState(4);
  const [message, setMessage] = useState("Find four hidden categories.");

  useEffect(() => {
    let mounted = true;

    fetch("/api/puzzle")
      .then((response) => response.json())
      .then(({ puzzle: nextPuzzle }: { puzzle: Puzzle }) => {
        if (!mounted) return;
        setPuzzle(nextPuzzle);
        setWords(shuffleWords(nextPuzzle.words));
      })
      .catch(() => setMessage("Offline puzzle loaded."));

    return () => {
      mounted = false;
    };
  }, []);

  const remainingWords = useMemo(() => {
    const solvedWords = new Set(solved.flatMap((group) => group.words));
    return words.filter((word) => !solvedWords.has(word));
  }, [solved, words]);

  const isComplete = solved.length === 4;

  function toggleWord(word: string) {
    if (isComplete) return;

    setSelected((current) => {
      if (current.includes(word)) {
        return current.filter((item) => item !== word);
      }

      if (current.length === 4) {
        return current;
      }

      return [...current, word];
    });
  }

  function submitGuess() {
    if (selected.length !== 4 || isComplete) return;

    const matched = categoryForSelection(puzzle, selected);

    if (!matched) {
      setMistakes((current) => Math.max(0, current - 1));
      setMessage("Not quite. Try another link.");
      setSelected([]);
      return;
    }

    setSolved((current) => [
      ...current,
      {
        ...matched,
        order: current.length + 1,
      },
    ]);
    setSelected([]);
    setMessage(matched.name);
  }

  function resetBoard() {
    setWords(shuffleWords(puzzle.words));
    setSelected([]);
    setSolved([]);
    setMistakes(4);
    setMessage("Fresh board. Same puzzle.");
  }

  function shuffleBoard() {
    setWords((current) => shuffleWords(current));
    setMessage("Board shuffled.");
  }

  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <nav className={styles.nav} aria-label="Game navigation">
          <div className={styles.brand}>
            <Sparkles size={18} aria-hidden="true" />
            <span>Daily Word Categories</span>
          </div>
          <time dateTime={puzzle.date}>{puzzle.date}</time>
        </nav>

        <div className={styles.titleBlock}>
          <h1>Make four groups of four.</h1>
          <p>
            A midnight card-board puzzle for short daily play: quiet, sharp, and
            just difficult enough to make the last group sting.
          </p>
        </div>
      </section>

      <section className={styles.gamePanel} aria-label="Daily puzzle">
        <div className={styles.statusRow}>
          <div>
            <span className={styles.statusLabel}>Mistakes</span>
            <strong>{"●".repeat(mistakes)}</strong>
          </div>
          <div>
            <span className={styles.statusLabel}>Solved</span>
            <strong>{solved.length}/4</strong>
          </div>
        </div>

        <div className={styles.message} role="status">
          {isComplete ? "Complete. Come back tomorrow." : message}
        </div>

        <div className={styles.solvedStack}>
          {solved.map((group) => (
            <article
              className={styles.solvedGroup}
              key={group.name}
              style={
                {
                  "--group-color": difficultyTone[group.difficulty],
                } as GroupColorStyle
              }
            >
              <span>Group {group.order}</span>
              <h2>{group.name}</h2>
              <p>{group.words.join(", ")}</p>
            </article>
          ))}
        </div>

        <div className={styles.grid} aria-label="Word board">
          {remainingWords.map((word) => {
            const active = selected.includes(word);
            return (
              <button
                aria-pressed={active}
                className={active ? styles.tileSelected : styles.tile}
                key={word}
                onClick={() => toggleWord(word)}
                type="button"
              >
                {word}
              </button>
            );
          })}
        </div>

        <div className={styles.controls}>
          <button onClick={shuffleBoard} type="button">
            <Shuffle size={16} aria-hidden="true" />
            Shuffle
          </button>
          <button onClick={resetBoard} type="button">
            <RotateCcw size={16} aria-hidden="true" />
            Reset
          </button>
          <button
            className={styles.submit}
            disabled={selected.length !== 4 || isComplete}
            onClick={submitGuess}
            type="button"
          >
            <Send size={16} aria-hidden="true" />
            Submit
          </button>
        </div>
      </section>
    </main>
  );
}
