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
