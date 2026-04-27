export type StoryCategory =
  | "adventure"
  | "mystery"
  | "history"
  | "science"
  | "fantasy"
  | "motivational";

export type StoryAccess = "free" | "premium";

export type Story = {
  id: string;
  title: string;
  author: string;
  category: StoryCategory;
  access: StoryAccess;
  /** Cost in coins to unlock when access === "premium". */
  cost?: number;
  /** Approximate read time in minutes. */
  readTime: number;
  /** Coins rewarded when the player finishes reading the last page. */
  reward: number;
  /** Short hook shown on the cover / library card. */
  blurb: string;
  /** Each entry is one displayed page. */
  pages: string[];
  /** Optional accent color for the spine — any valid CSS color. */
  spine?: string;
};

export type DailyFact = {
  id: string;
  title: string;
  body: string;
  category: StoryCategory;
};

export type QuizQuestion = {
  id: string;
  /** A sentence with `___` marking the blank. */
  sentence: string;
  /** Options shown to the child; one of them must equal `answer`. */
  options: string[];
  answer: string;
  /** Optional gentle hint shown on a wrong answer. */
  hint?: string;
};
