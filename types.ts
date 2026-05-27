export type Position = { x: number; y: number };

export type ShelfData = {
  id: string;
  width: number;
  height: number;
  blockedCells?: Position[];
  /**
   * Hardcore levels (80+): number of visual zoom sections this shelf is split into.
   * When set, the shelf is divided into `sections` equal horizontal zones.
   * The game camera zooms into one section at a time for clarity.
   */
  sections?: number;
};

export type BookData = {
  id: string;
  width: number;
  height: number;
  color: string;
  title: string;
  pattern: "lines" | "dots" | "diamonds" | "double-lines" | "stars" | "none";
  fragile?: boolean;
  heavy?: boolean;
  rotatable?: boolean;
};

export type Constraints = {
  timeLimit?: number; // seconds
  moveLimit?: number;
};

export type Level = {
  id: number;
  name: string;
  shelves: ShelfData[];
  books: BookData[];
  constraints?: Constraints;
  /**
   * Tier label for UI display and progression grouping.
   * 1=Tutorial, 2=Easy, 3=Beginner, 4=Intermediate, 5=Challenging,
   * 6=Hard, 7=Expert, 8=Master, 9=Hardcore
   */
  tier?: number;
};

export type PlacedBook = {
  book: BookData;
  shelfId: string;
  x: number;
  y: number;
  rotated: boolean; // if true, width and height are swapped visually and logically
};

/**
 * Tracks zoom section progress for hardcore levels (80+).
 * activeSection is 0-indexed. When a section is filled, it moves to the next.
 */
export type SectionState = {
  shelfId: string;
  activeSection: number;
  completedSections: number[];
};

export type GameState = {
  levelId: number;
  status: "playing" | "won" | "lost";
  placedBooks: PlacedBook[];
  pendingBooks: BookData[];
  moves: number;
  startTime: number;
  elapsedTime: number;
  heldBookId: string | null;
  heldBookRotated: boolean;
  /** Present only on hardcore levels (80+) that use section-based zoom */
  sectionStates?: SectionState[];
};