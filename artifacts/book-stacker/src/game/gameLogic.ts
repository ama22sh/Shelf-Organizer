import type { BookData, Level, PlacedBook, ShelfData } from "./types";

export function getBookDims(book: BookData, rotated: boolean): { w: number; h: number } {
  return rotated ? { w: book.height, h: book.width } : { w: book.width, h: book.height };
}

export function isCellBlocked(shelf: ShelfData, x: number, y: number): boolean {
  return !!shelf.blockedCells?.some((c) => c.x === x && c.y === y);
}

export function canPlace(
  shelf: ShelfData,
  placed: PlacedBook[],
  book: BookData,
  rotated: boolean,
  x: number,
  y: number,
  ignoreId?: string,
): boolean {
  const { w, h } = getBookDims(book, rotated);
  if (x < 0 || y < 0 || x + w > shelf.width || y + h > shelf.height) return false;
  for (let dx = 0; dx < w; dx++) {
    for (let dy = 0; dy < h; dy++) {
      const cx = x + dx;
      const cy = y + dy;
      if (isCellBlocked(shelf, cx, cy)) return false;
      for (const p of placed) {
        if (p.shelfId !== shelf.id) continue;
        if (ignoreId && p.book.id === ignoreId) continue;
        const pd = getBookDims(p.book, p.rotated);
        if (
          cx >= p.x &&
          cx < p.x + pd.w &&
          cy >= p.y &&
          cy < p.y + pd.h
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

export function totalShelfArea(level: Level): number {
  return level.shelves.reduce((acc, s) => {
    const blocked = s.blockedCells?.length ?? 0;
    return acc + s.width * s.height - blocked;
  }, 0);
}

export function totalBookArea(level: Level): number {
  return level.books.reduce((acc, b) => acc + b.width * b.height, 0);
}

export function isLevelWon(level: Level, placed: PlacedBook[]): boolean {
  return placed.length === level.books.length;
}

/**
 * Returns true if any pending book can be placed somewhere on any shelf
 * given the current placement. Considers rotations for rotatable books and
 * the fragile-must-rest-on-floor rule. Heavy/fragile stacking interactions
 * are intentionally NOT checked here — they require future state, so the
 * geometry-only check is the safe game-over condition.
 */
export function anyBookFits(
  level: Level,
  placed: PlacedBook[],
  pending: BookData[],
): boolean {
  for (const book of pending) {
    const rotations = book.rotatable ? [false, true] : [false];
    for (const rotated of rotations) {
      for (const shelf of level.shelves) {
        const { w, h } = getBookDims(book, rotated);
        if (w > shelf.width || h > shelf.height) continue;
        for (let y = 0; y <= shelf.height - h; y++) {
          for (let x = 0; x <= shelf.width - w; x++) {
            if (book.fragile && y + h !== shelf.height) continue;
            if (canPlace(shelf, placed, book, rotated, x, y)) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}

export function computeStars(
  level: Level,
  moves: number,
  timeSec: number,
): number {
  const minMoves = level.books.length;
  const moveBudget = minMoves + 2;
  const timeBudget = level.constraints?.timeLimit ?? Math.max(30, minMoves * 12);
  let stars = 1;
  if (moves <= moveBudget) stars = 2;
  if (moves <= minMoves && timeSec <= timeBudget * 0.6) stars = 3;
  return stars;
}
