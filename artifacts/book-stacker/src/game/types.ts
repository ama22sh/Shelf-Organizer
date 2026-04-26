export type Position = { x: number; y: number };

export type ShelfData = {
  id: string;
  width: number;
  height: number;
  blockedCells?: Position[];
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
};

export type PlacedBook = {
  book: BookData;
  shelfId: string;
  x: number;
  y: number;
  rotated: boolean; // if true, width and height are swapped visually and logically
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
};
