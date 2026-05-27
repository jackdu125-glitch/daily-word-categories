"use client";

import {
  BookOpen,
  CalendarDays,
  Clock3,
  Crown,
  ListChecks,
  Lock,
  MessageSquare,
  RotateCcw,
  Send,
  Shuffle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AuthStatus } from "@/components/auth-status";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  categoryForSelection,
  ANSWER_UNLOCK_SOLVED_COUNT,
  canViewAnswers,
  createShareText,
  fallbackPuzzle,
  getProgressStorageKey,
  getSolvedWords,
  shuffleWords,
  type SolvedGroup,
  type Puzzle,
} from "@/lib/puzzle";
import styles from "./page.module.css";

type GroupColorStyle = React.CSSProperties & {
  "--group-color": string;
};

type StoredProgress = {
  solved: SolvedGroup[];
  mistakes: number;
  completedAt?: string;
};

const difficultyTone: Record<Puzzle["categories"][number]["difficulty"], string> = {
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
  const [shareStatus, setShareStatus] = useState("");
  const [hydratedDate, setHydratedDate] = useState("");
  const syncedCompletionKey = useRef("");

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

  useEffect(() => {
    const storageKey = getProgressStorageKey(puzzle.date);
    const saved = window.localStorage.getItem(storageKey);

    if (saved) {
      try {
        const progress = JSON.parse(saved) as StoredProgress;
        queueMicrotask(() => {
          setSolved(progress.solved ?? []);
          setMistakes(progress.mistakes ?? 4);
          setSelected([]);
          setMessage(
            progress.completedAt ? "Complete. Come back tomorrow." : "Progress restored.",
          );
          setHydratedDate(puzzle.date);
        });
        return;
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    queueMicrotask(() => {
      setSolved([]);
      setMistakes(4);
      setSelected([]);
      setMessage("Find four hidden categories.");
      setHydratedDate(puzzle.date);
    });
  }, [puzzle.date]);

  useEffect(() => {
    if (hydratedDate !== puzzle.date) return;

    const storageKey = getProgressStorageKey(puzzle.date);
    const progress: StoredProgress = {
      solved,
      mistakes,
      completedAt: solved.length === 4 ? new Date().toISOString() : undefined,
    };

    window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [hydratedDate, mistakes, puzzle.date, solved]);

  useEffect(() => {
    if (hydratedDate !== puzzle.date || solved.length !== 4) return;

    const syncKey = `${puzzle.date}:${solved.length}`;
    if (syncedCompletionKey.current === syncKey) return;
    syncedCompletionKey.current = syncKey;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;

      supabase.from("userprogress").upsert({
        userid: data.user.id,
        puzzledate: puzzle.date,
        solvedat: new Date().toISOString(),
      });
    });
  }, [hydratedDate, puzzle.date, solved.length]);

  const isComplete = solved.length === 4;
  const isFailed = mistakes === 0 && !isComplete;
  const answersUnlocked = canViewAnswers(solved.length);
  const displayGroups = useMemo(
    () =>
      isFailed
        ? puzzle.categories.map((category, index) => ({
            ...category,
            order: index + 1,
          }))
        : solved,
    [isFailed, puzzle.categories, solved],
  );

  const remainingWords = useMemo(() => {
    const solvedWords = getSolvedWords(displayGroups);
    return words.filter((word) => !solvedWords.has(word));
  }, [displayGroups, words]);

  function toggleWord(word: string) {
    if (isComplete || isFailed) return;

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
    if (selected.length !== 4 || isComplete || isFailed) return;

    const matched = categoryForSelection(puzzle, selected);

    if (!matched) {
      setMistakes((current) => {
        const next = Math.max(0, current - 1);
        setMessage(
          next === 0 ? "Out of guesses. The solution is revealed." : "Not quite. Try another link.",
        );
        return next;
      });
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
    setShareStatus("");
    setMessage("Fresh board. Same puzzle.");
    window.localStorage.removeItem(getProgressStorageKey(puzzle.date));
  }

  function shuffleBoard() {
    if (isComplete || isFailed) return;
    setWords((current) => shuffleWords(current));
    setMessage("Board shuffled.");
  }

  function deselectAll() {
    setSelected([]);
    setMessage("Selection cleared.");
  }

  async function shareResult() {
    const text = createShareText(puzzle, 4 - mistakes, isComplete);

    try {
      if (navigator.share) {
        await navigator.share({
          text,
          title: "new game",
          url: "https://www.jackdu2.me",
        });
        setShareStatus("Shared.");
        return;
      }

      await navigator.clipboard.writeText(text);
      setShareStatus("Copied to clipboard.");
    } catch {
      setShareStatus("Share text ready. Copy from your browser menu.");
    }
  }

  return (
    <main className={styles.shell}>
      <div className={styles.ambientStage} aria-hidden="true">
        <div className={styles.orbitRing} />
        <div className={`${styles.floatCard} ${styles.floatCardOne}`}>
          DAILY
        </div>
        <div className={`${styles.floatCard} ${styles.floatCardTwo}`}>
          WORD
        </div>
        <div className={`${styles.floatCard} ${styles.floatCardThree}`}>
          FOUR
        </div>
      </div>

      <section className={styles.hero}>
        <nav className={styles.nav} aria-label="Game navigation">
          <div className={styles.brand}>
            <Sparkles size={18} aria-hidden="true" />
            <span>new game</span>
          </div>
          <div className={styles.navActions}>
            <time dateTime={puzzle.date}>{puzzle.date}</time>
            <AuthStatus className={styles.authLink} />
          </div>
        </nav>

        <div className={styles.titleBlock}>
          <h1>Make four groups of four.</h1>
          <p>
            A midnight card-board puzzle for short daily play: quiet, sharp, and
            just difficult enough to make the last group sting.
          </p>
        </div>

        <div className={styles.entryGrid} aria-label="Site sections">
          <Link className={styles.entryCard} href="/how-to-play">
            <BookOpen size={17} aria-hidden="true" />
            <span>Rules</span>
            <small>Learn how the puzzle works.</small>
          </Link>
          <Link className={styles.entryCard} href="/archive">
            <CalendarDays size={17} aria-hidden="true" />
            <span>Archive</span>
            <small>Browse previous daily puzzles.</small>
          </Link>
          <Link className={styles.entryCard} href="/guides">
            <Sparkles size={17} aria-hidden="true" />
            <span>Guides</span>
            <small>AAA briefs and walkthrough summaries.</small>
          </Link>
          <Link className={styles.entryCard} href="/forum">
            <MessageSquare size={17} aria-hidden="true" />
            <span>Forum</span>
            <small>Open member game discussions.</small>
          </Link>
          <Link className={styles.entryCard} href="/membership">
            <Crown size={17} aria-hidden="true" />
            <span>Pro member</span>
            <small>Unlock deeper explanations.</small>
          </Link>
          {answersUnlocked ? (
            <Link className={styles.entryCard} href={`/answers/${puzzle.date}`}>
              <ListChecks size={17} aria-hidden="true" />
              <span>Today&apos;s answer</span>
              <small>Reveal the current groups.</small>
            </Link>
          ) : (
            <div className={`${styles.entryCard} ${styles.entryLocked}`}>
              <Lock size={17} aria-hidden="true" />
              <span>Today&apos;s answer</span>
              <small>Solve {ANSWER_UNLOCK_SOLVED_COUNT} groups to unlock.</small>
            </div>
          )}
          <div className={`${styles.entryCard} ${styles.entryLocked}`}>
            <Clock3 size={17} aria-hidden="true" />
            <span>Next puzzle</span>
            <small>Unlocks tomorrow at 6:00 AM.</small>
          </div>
        </div>
      </section>

      <section className={styles.gamePanel} aria-label="Daily puzzle">
        <div className={styles.statusRow}>
          <div>
            <span className={styles.statusLabel}>Mistakes</span>
            <strong>{mistakes}/4 left</strong>
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
          {displayGroups.map((group) => (
            <article
              className={styles.solvedGroup}
              key={group.name}
              style={
                {
                  "--group-color": difficultyTone[group.difficulty],
                } as GroupColorStyle
              }
            >
              <span>{isFailed ? "Solution" : `Group ${group.order}`}</span>
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
          <button disabled={isComplete || isFailed} onClick={shuffleBoard} type="button">
            <Shuffle size={16} aria-hidden="true" />
            Shuffle
          </button>
          <button disabled={!selected.length} onClick={deselectAll} type="button">
            Deselect
          </button>
          <button onClick={resetBoard} type="button">
            <RotateCcw size={16} aria-hidden="true" />
            Restart
          </button>
          <button
            className={styles.submit}
            disabled={selected.length !== 4 || isComplete || isFailed}
            onClick={submitGuess}
            type="button"
          >
            <Send size={16} aria-hidden="true" />
            Submit
          </button>
        </div>

        {isComplete ? (
          <div className={styles.completePanel}>
            <span>Today&apos;s result</span>
            <h2>Solved with {4 - mistakes} mistakes.</h2>
            <button onClick={shareResult} type="button">
              Share result
            </button>
            <div className={styles.completeActions}>
              <Link href="/archive">Play from archive</Link>
              <span>Next puzzle unlocks tomorrow at 6:00 AM.</span>
            </div>
            {shareStatus ? <p>{shareStatus}</p> : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
