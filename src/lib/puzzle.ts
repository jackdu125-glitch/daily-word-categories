export type Category = {
  name: string;
  words: string[];
  difficulty: "easy" | "medium" | "hard" | "tricky";
};

export type Puzzle = {
  date: string;
  words: string[];
  categories: Category[];
};

export type SolvedGroup = Category & {
  order: number;
};

export const fallbackPuzzle: Puzzle = {
  date: new Date().toISOString().slice(0, 10),
  words: [
    "BASIL",
    "THYME",
    "SAGE",
    "DILL",
    "MERCURY",
    "VENUS",
    "MARS",
    "SATURN",
    "BOW",
    "ARROW",
    "QUIVER",
    "TARGET",
    "RIVER",
    "DELTA",
    "BANK",
    "CURRENT",
  ],
  categories: [
    {
      name: "Herbs",
      words: ["BASIL", "THYME", "SAGE", "DILL"],
      difficulty: "easy",
    },
    {
      name: "Planets",
      words: ["MERCURY", "VENUS", "MARS", "SATURN"],
      difficulty: "medium",
    },
    {
      name: "Archery words",
      words: ["BOW", "ARROW", "QUIVER", "TARGET"],
      difficulty: "hard",
    },
    {
      name: "River terms",
      words: ["RIVER", "DELTA", "BANK", "CURRENT"],
      difficulty: "tricky",
    },
  ],
};

export function shuffleWords(words: string[]) {
  return [...words].sort(() => Math.random() - 0.5);
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function formatPuzzleDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function getProgressStorageKey(date: string) {
  return `daily-word-categories:${date}`;
}

export function getSolvedWords(solved: Pick<SolvedGroup, "words">[]) {
  return new Set(solved.flatMap((group) => group.words));
}

export function createShareText(
  puzzle: Puzzle,
  mistakesUsed: number,
  completed: boolean,
) {
  const result = completed
    ? `Solved with ${mistakesUsed} ${mistakesUsed === 1 ? "mistake" : "mistakes"}`
    : "Still working on today's puzzle";

  return [
    "Daily Word Categories",
    formatPuzzleDate(puzzle.date),
    result,
    "https://jackdu2.me",
  ].join("\n");
}

export function normalizeWord(word: string) {
  return word.trim().toUpperCase();
}

export function categoryForSelection(puzzle: Puzzle, selected: string[]) {
  const normalized = selected.map(normalizeWord).sort();

  return puzzle.categories.find((category) => {
    const expected = category.words.map(normalizeWord).sort();
    return expected.every((word, index) => word === normalized[index]);
  });
}
